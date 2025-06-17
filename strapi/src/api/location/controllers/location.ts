/**
 * location controller
 */

import { factories } from '@strapi/strapi'

// Helper function for hybrid search
async function performHybridSearch(searchQuery: string, locations: any[], strapi: any) {
  try {
    const embeddingService = strapi.service('api::location.embedding');
    let searchEmbedding = null;

    // Try to generate embedding for search query
    try {
      searchEmbedding = await embeddingService.generateEmbedding(searchQuery);
      console.log('Generated search embedding successfully');
    } catch (error) {
      console.warn('Could not generate search embedding, falling back to keyword search only:', error);
    }

    const searchResults = [];

    for (const location of locations) {
      const scores = {
        keyword: 0,
        semantic: 0,
        total: 0
      };

      // 1. Keyword-based scoring (traditional search)
      scores.keyword = calculateKeywordScore(searchQuery, location);

      // 2. Semantic similarity scoring (if embeddings available)
      if (searchEmbedding && location.embeddings) {
        try {
          const locationEmbedding = JSON.parse(location.embeddings);
          // Validate embedding array
          if (Array.isArray(locationEmbedding) && locationEmbedding.length === 768) {
            scores.semantic = embeddingService.calculateSimilarity(searchEmbedding, locationEmbedding);
          } else {
            console.warn(`Invalid embedding array for location ${location.id}: length ${locationEmbedding?.length || 'unknown'}`);
            scores.semantic = 0;
          }
        } catch (error) {
          console.warn(`Could not parse embeddings for location ${location.id}: ${error.message}`);
          scores.semantic = 0;
        }
      }

      // 3. Apply stricter thresholds before combining scores
      const semanticThreshold = 0.50; // Cosine similarity must be at least 0.5 (increased for better relevance)
      const keywordThreshold = 0.15; // Minimum keyword relevance (stricter)
      
      // Only proceed if we have meaningful similarity
      const hasSemanticRelevance = scores.semantic >= semanticThreshold;
      const hasKeywordRelevance = scores.keyword >= keywordThreshold;
      
      // For very short queries (likely generic), require higher standards
      const isGenericQuery = searchQuery.length <= 3;
      const shouldInclude = isGenericQuery 
        ? (hasSemanticRelevance && hasKeywordRelevance) // Both required for generic queries
        : (hasSemanticRelevance || hasKeywordRelevance); // Either is fine for specific queries
      
      if (shouldInclude) {
        // Combine scores with weights
        // Keyword score: 40% weight, Semantic score: 60% weight
        scores.total = (scores.keyword * 0.4) + (scores.semantic * 0.6);
        
                 // Apply final combined threshold
         const minCombinedThreshold = 0.25;
        if (scores.total >= minCombinedThreshold) {
          searchResults.push({
            ...location,
            _searchScore: scores.total,
            _keywordScore: scores.keyword,
            _semanticScore: scores.semantic,
          });
        }
      }
    }

    // Sort by total score (highest first), with semantic score as tiebreaker
    searchResults.sort((a, b) => {
      if (Math.abs(b._searchScore - a._searchScore) < 0.001) {
        // If total scores are very close, prioritize higher semantic similarity
        return b._semanticScore - a._semanticScore;
      }
      return b._searchScore - a._searchScore;
    });

    // Remove search score fields from final results
    const cleanResults = searchResults.map(result => {
      const { _searchScore, _keywordScore, _semanticScore, ...cleanResult } = result;
      return cleanResult;
    });

    console.log(`🔍 Semantic search for "${searchQuery}": ${cleanResults.length} high-relevance results (from ${searchResults.length} candidates)`);
    
    // Log top 5 results with detailed scores for debugging
    if (searchResults.length > 0) {
      console.log('🏆 Top search results with similarity scores:');
      searchResults.slice(0, 5).forEach((r, index) => {
        console.log(`  ${index + 1}. ${r.name} (${r.category})`);
        console.log(`     📊 Total: ${r._searchScore.toFixed(3)} | 🔤 Keyword: ${r._keywordScore.toFixed(3)} | 🧠 Semantic: ${r._semanticScore.toFixed(3)}`);
      });
    } else {
      console.log('❌ No results met the relevance threshold');
    }

    return cleanResults;
  } catch (error) {
    console.error('Error in hybrid search:', error);
    throw error;
  }
}

// Helper function for keyword scoring
function calculateKeywordScore(searchQuery: string, location: any): number {
  const query = searchQuery.toLowerCase();
  let score = 0;

  // Search in different fields with different weights
  const fields = [
    { field: location.name, weight: 0.2 },
    { field: location.category, weight: 0.8 },
  ];

  for (const { field, weight } of fields) {
    if (!field) continue;

    const fieldValue = field.toLowerCase();
    
    // Exact match gets highest score
    if (fieldValue === query) {
      score += weight * 1.0;
    }
    // Starts with query gets high score
    else if (fieldValue.startsWith(query)) {
      score += weight * 0.8;
    }
    // Contains query gets medium score
    else if (fieldValue.includes(query)) {
      score += weight * 0.6;
    }
    // Word boundary match gets good score
    else if (new RegExp(`\\b${query}\\b`, 'i').test(fieldValue)) {
      score += weight * 0.7;
    }
  }

  // Boost score for shorter names (more relevant matches)
  if (location.name && location.name.toLowerCase().includes(query)) {
    const nameLength = location.name.length;
    const queryLength = query.length;
    const lengthBoost = Math.min(queryLength / nameLength, 0.2);
    score += lengthBoost;
  }

  return Math.min(score, 1.0); // Cap at 1.0
}

export default factories.createCoreController('api::location.location', ({ strapi }) => ({
  // Custom create method with embedding generation
  async create(ctx) {
    try {
      console.log('Location create method called');
      const { data } = ctx.request.body;
      console.log('Request data:', data);

      // Generate embeddings before creating the location
      const embeddingService = strapi.service('api::location.embedding');
      console.log('Embedding service loaded:', !!embeddingService);
      
      const embeddings = await embeddingService.processLocationEmbeddings(data);
      console.log('Generated embeddings:', embeddings ? 'Success' : 'Failed');

      // Add embeddings to the data if generated successfully
      if (embeddings) {
        data.embeddings = embeddings;
        console.log('Added embeddings to data');
      }

      // Call the default create method with the enhanced data
      const response = await super.create(ctx);
      
      console.log(`Location created with embeddings: "${data.name}"`);
      return response;
    } catch (error) {
      console.error('Error in location create with embeddings:', error);
      // Fall back to default creation without embeddings if there's an error
      return super.create(ctx);
    }
  },

  // Custom update method with embedding regeneration
  async update(ctx) {
    try {
      const { data } = ctx.request.body;

      // Check if fields that affect embeddings have changed
      const embeddingFields = ['name', 'category'];
      const hasEmbeddingFieldChanges = embeddingFields.some(field => data[field] !== undefined);

      if (hasEmbeddingFieldChanges) {
        // Get the existing location data to merge with updates
        const existingLocation = await strapi.entityService.findOne('api::location.location', ctx.params.id);
        const mergedData = { ...existingLocation, ...data };

        // Regenerate embeddings with the updated data
        const embeddingService = strapi.service('api::location.embedding');
        const embeddings = await embeddingService.processLocationEmbeddings(mergedData);

        if (embeddings) {
          data.embeddings = embeddings;
          console.log(`Regenerated embeddings for updated location: "${mergedData.name}"`);
        }
      }

      // Call the default update method
      return super.update(ctx);
    } catch (error) {
      console.error('Error in location update with embeddings:', error);
      // Fall back to default update without embeddings if there's an error
      return super.update(ctx);
    }
  },

  // Custom search method with semantic similarity
  async search(ctx) {
    try {
      const { query } = ctx.request.query;
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return ctx.badRequest('Search query is required');
      }

      const searchQuery = query.trim();
      console.log(`Semantic search for: "${searchQuery}"`);

      // Get all active locations with embeddings
      const locations = await strapi.entityService.findMany('api::location.location', {
        filters: {
          is_active: true,
          resource: true,
        },
        populate: '*',
        limit: 1000, // Adjust as needed
      });

      if (!locations || locations.length === 0) {
        return { data: [] };
      }

      // Perform hybrid search: keyword + semantic
      const results = await performHybridSearch(searchQuery, locations, strapi);

      return { data: results };
    } catch (error) {
      console.error('Error in semantic search:', error);
      return ctx.internalServerError('An error occurred during search');
    }
  }
}));
