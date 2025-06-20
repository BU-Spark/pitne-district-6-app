/**
 * Utility script to calculate embedding similarity between locations (NomicAI)
 * 
 * Usage: 
 * - Find similar locations: node scripts/embedding-similarity.js similar <locationId> [limit]
 * - Compare two locations: node scripts/embedding-similarity.js compare <locationId1> <locationId2>
 * - Analyze embedding quality: node scripts/embedding-similarity.js analyze
 */

/**
 * Calculate cosine similarity between two embedding vectors
 * @param {Array<number>} vecA - First embedding vector
 * @param {Array<number>} vecB - Second embedding vector
 * @returns {number} - Cosine similarity score (-1 to 1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimension mismatch: ${vecA.length} vs ${vecB.length}`);
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}

/**
 * Parse embedding from JSON string with validation
 * @param {string} embeddingStr - JSON string containing embedding array
 * @returns {Array<number>} - Parsed embedding vector
 */
function parseEmbedding(embeddingStr) {
  try {
    const embedding = JSON.parse(embeddingStr);
    if (!Array.isArray(embedding)) {
      throw new Error('Embedding is not an array');
    }
    
    // Validate NomicAI embedding dimensions (should be 768)
    if (embedding.length !== 768) {
      console.warn(`Warning: Expected 768 dimensions, got ${embedding.length}`);
    }
    
    return embedding.map(Number);
  } catch (error) {
    throw new Error(`Failed to parse embedding: ${error.message}`);
  }
}

/**
 * Get similarity interpretation based on cosine similarity score
 * @param {number} similarity - Cosine similarity score
 * @returns {Object} - Interpretation with level and description
 */
function getSimilarityInterpretation(similarity) {
  if (similarity > 0.95) {
    return { level: 'Identical', description: 'Nearly identical content', color: '🟢' };
  } else if (similarity > 0.85) {
    return { level: 'Very High', description: 'Very similar content and purpose', color: '🟢' };
  } else if (similarity > 0.75) {
    return { level: 'High', description: 'Similar content with common themes', color: '🟡' };
  } else if (similarity > 0.60) {
    return { level: 'Moderate', description: 'Some similarities in content or category', color: '🟡' };
  } else if (similarity > 0.40) {
    return { level: 'Low', description: 'Few commonalities, mostly different', color: '🟠' };
  } else {
    return { level: 'Very Low', description: 'Quite different content and purpose', color: '🔴' };
  }
}

/**
 * Find locations similar to a given location
 * @param {number} targetLocationId - ID of the target location
 * @param {number} limit - Maximum number of similar locations to return
 */
async function findSimilarLocations(targetLocationId, limit = 5) {
  try {
    console.log(`🔍 Finding locations similar to ID ${targetLocationId}...\n`);
    
    // Initialize Strapi
    const strapi = require('@strapi/strapi')();
    await strapi.load();
    
    // Get target location
    const targetLocation = await strapi.entityService.findOne('api::location.location', targetLocationId, {
      fields: ['id', 'name', 'category', 'description', 'embeddings'],
    });
    
    if (!targetLocation) {
      throw new Error(`Location with ID ${targetLocationId} not found`);
    }
    
    if (!targetLocation.embeddings) {
      throw new Error(`Location ${targetLocationId} has no embeddings. Run embedding generation first.`);
    }
    
    console.log('🎯 Target Location:');
    console.log(`- ID: ${targetLocation.id}`);
    console.log(`- Name: ${targetLocation.name}`);
    console.log(`- Category: ${targetLocation.category}`);
    console.log(`- Description: ${targetLocation.description?.substring(0, 120)}...`);
    
    const targetEmbedding = parseEmbedding(targetLocation.embeddings);
    console.log(`- Embedding dimensions: ${targetEmbedding.length}`);
    
    // Get all other locations with embeddings
    const allLocations = await strapi.entityService.findMany('api::location.location', {
      fields: ['id', 'name', 'category', 'description', 'embeddings'],
      filters: {
        id: { $ne: targetLocationId },
        embeddings: { $notNull: true }
      },
      publicationState: 'preview',
    });
    
    console.log(`\n📊 Comparing with ${allLocations.length} other locations...\n`);
    
    // Calculate similarities
    const similarities = [];
    
    for (const location of allLocations) {
      try {
        const embedding = parseEmbedding(location.embeddings);
        const similarity = cosineSimilarity(targetEmbedding, embedding);
        
        similarities.push({
          location,
          similarity,
          percentage: (similarity * 100).toFixed(1),
          interpretation: getSimilarityInterpretation(similarity)
        });
      } catch (error) {
        console.warn(`⚠️  Skipping location ${location.id}: ${error.message}`);
      }
    }
    
    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Display results
    console.log(`🏆 Top ${Math.min(limit, similarities.length)} Most Similar Locations:\n`);
    
    for (let i = 0; i < Math.min(limit, similarities.length); i++) {
      const result = similarities[i];
      const { location, similarity, percentage, interpretation } = result;
      
      console.log(`${i + 1}. ${location.name}`);
      console.log(`   📍 Category: ${location.category}`);
      console.log(`   ${interpretation.color} Similarity: ${percentage}% (${interpretation.level})`);
      console.log(`   💭 ${interpretation.description}`);
      console.log(`   📝 Description: ${location.description?.substring(0, 100)}...`);
      console.log('');
    }
    
    // Category analysis
    const categoryMatches = similarities.filter(s => 
      s.location.category === targetLocation.category
    ).length;
    
    console.log('📈 Similarity Analysis:');
    console.log(`- Same category matches: ${categoryMatches}/${similarities.length} (${((categoryMatches/similarities.length)*100).toFixed(1)}%)`);
    
    // Statistics
    const avgSimilarity = similarities.reduce((sum, s) => sum + s.similarity, 0) / similarities.length;
    const maxSimilarity = similarities[0]?.similarity || 0;
    const minSimilarity = similarities[similarities.length - 1]?.similarity || 0;
    
    console.log(`- Average similarity: ${(avgSimilarity * 100).toFixed(1)}%`);
    console.log(`- Highest similarity: ${(maxSimilarity * 100).toFixed(1)}%`);
    console.log(`- Lowest similarity: ${(minSimilarity * 100).toFixed(1)}%`);
    
    // Distribution analysis
    const highSimilarity = similarities.filter(s => s.similarity > 0.75).length;
    const mediumSimilarity = similarities.filter(s => s.similarity > 0.5 && s.similarity <= 0.75).length;
    const lowSimilarity = similarities.filter(s => s.similarity <= 0.5).length;
    
    console.log(`\n📊 Similarity Distribution:`);
    console.log(`- High (>75%): ${highSimilarity} locations`);
    console.log(`- Medium (50-75%): ${mediumSimilarity} locations`);
    console.log(`- Low (≤50%): ${lowSimilarity} locations`);
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    process.exit(0);
  }
}

/**
 * Compare similarity between two specific locations
 * @param {number} locationId1 - ID of first location
 * @param {number} locationId2 - ID of second location
 */
async function compareLocations(locationId1, locationId2) {
  try {
    console.log(`⚖️  Comparing locations ${locationId1} and ${locationId2}...\n`);
    
    // Initialize Strapi
    const strapi = require('@strapi/strapi')();
    await strapi.load();
    
    // Get both locations
    const [location1, location2] = await Promise.all([
      strapi.entityService.findOne('api::location.location', locationId1, {
        fields: ['id', 'name', 'category', 'description', 'embeddings'],
      }),
      strapi.entityService.findOne('api::location.location', locationId2, {
        fields: ['id', 'name', 'category', 'description', 'embeddings'],
      })
    ]);
    
    if (!location1) {
      throw new Error(`Location with ID ${locationId1} not found`);
    }
    
    if (!location2) {
      throw new Error(`Location with ID ${locationId2} not found`);
    }
    
    if (!location1.embeddings) {
      throw new Error(`Location ${locationId1} has no embeddings`);
    }
    
    if (!location2.embeddings) {
      throw new Error(`Location ${locationId2} has no embeddings`);
    }
    
    // Display location details
    console.log('📍 Location 1:');
    console.log(`- ID: ${location1.id}`);
    console.log(`- Name: ${location1.name}`);
    console.log(`- Category: ${location1.category}`);
    console.log(`- Description: ${location1.description?.substring(0, 120)}...`);
    
    console.log('\n📍 Location 2:');
    console.log(`- ID: ${location2.id}`);
    console.log(`- Name: ${location2.name}`);
    console.log(`- Category: ${location2.category}`);
    console.log(`- Description: ${location2.description?.substring(0, 120)}...`);
    
    // Calculate similarity
    const embedding1 = parseEmbedding(location1.embeddings);
    const embedding2 = parseEmbedding(location2.embeddings);
    
    console.log(`\n🔢 Embedding Info:`);
    console.log(`- Location 1 dimensions: ${embedding1.length}`);
    console.log(`- Location 2 dimensions: ${embedding2.length}`);
    
    const similarity = cosineSimilarity(embedding1, embedding2);
    const percentage = (similarity * 100).toFixed(1);
    const interpretation = getSimilarityInterpretation(similarity);
    
    console.log('\n🎯 Similarity Results:');
    console.log(`- Cosine Similarity: ${similarity.toFixed(6)}`);
    console.log(`- Percentage: ${percentage}%`);
    console.log(`- ${interpretation.color} Level: ${interpretation.level}`);
    console.log(`- Interpretation: ${interpretation.description}`);
    
    // Additional analysis
    const sameCategory = location1.category === location2.category;
    console.log(`\n🏷️  Category Analysis:`);
    console.log(`- Same Category: ${sameCategory ? 'Yes' : 'No'}`);
    
    if (sameCategory) {
      console.log(`- Both locations are in: ${location1.category}`);
    } else {
      console.log(`- Location 1: ${location1.category}`);
      console.log(`- Location 2: ${location2.category}`);
    }
    
    // Name similarity (simple check)
    const name1Words = location1.name.toLowerCase().split(/\s+/);
    const name2Words = location2.name.toLowerCase().split(/\s+/);
    const commonWords = name1Words.filter(word => name2Words.includes(word));
    
    console.log(`\n📝 Name Analysis:`);
    console.log(`- Common words in names: ${commonWords.length > 0 ? commonWords.join(', ') : 'None'}`);
    console.log(`- Name similarity hint: ${commonWords.length > 0 ? 'Names share common terms' : 'Names are quite different'}`);
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    process.exit(0);
  }
}

/**
 * Analyze overall embedding quality and distribution
 */
async function analyzeEmbeddingQuality() {
  try {
    console.log('🔍 Analyzing embedding quality and distribution...\n');
    
    // Initialize Strapi
    const strapi = require('@strapi/strapi')();
    await strapi.load();
    
    // Get all locations with embeddings
    const locations = await strapi.entityService.findMany('api::location.location', {
      fields: ['id', 'name', 'category', 'embeddings'],
      filters: {
        embeddings: { $notNull: true }
      },
      publicationState: 'preview',
    });
    
    console.log(`📊 Found ${locations.length} locations with embeddings\n`);
    
    if (locations.length === 0) {
      console.log('No embeddings found. Run the generation script first.');
      return;
    }
    
    // Parse all embeddings
    const embeddings = [];
    const invalidEmbeddings = [];
    
    for (const location of locations) {
      try {
        const embedding = parseEmbedding(location.embeddings);
        embeddings.push({ location, embedding });
      } catch (error) {
        invalidEmbeddings.push({ location, error: error.message });
      }
    }
    
    console.log(`✅ Valid embeddings: ${embeddings.length}`);
    console.log(`❌ Invalid embeddings: ${invalidEmbeddings.length}`);
    
    if (invalidEmbeddings.length > 0) {
      console.log('\n❌ Invalid embeddings:');
      invalidEmbeddings.forEach(({ location, error }) => {
        console.log(`- ID ${location.id} (${location.name}): ${error}`);
      });
    }
    
    if (embeddings.length === 0) {
      console.log('\nNo valid embeddings to analyze.');
      return;
    }
    
    // Dimension analysis
    const dimensions = embeddings.map(e => e.embedding.length);
    const uniqueDimensions = [...new Set(dimensions)];
    
    console.log('\n🔢 Dimension Analysis:');
    console.log(`- Expected dimensions: 768 (NomicAI standard)`);
    console.log(`- Unique dimensions found: ${uniqueDimensions.join(', ')}`);
    console.log(`- Dimension consistency: ${uniqueDimensions.length === 1 ? 'Good' : 'Issues detected'}`);
    
    // Category distribution
    const categoryGroups = {};
    embeddings.forEach(({ location }) => {
      if (!categoryGroups[location.category]) {
        categoryGroups[location.category] = 0;
      }
      categoryGroups[location.category]++;
    });
    
    console.log('\n🏷️  Category Distribution:');
    Object.entries(categoryGroups)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} locations`);
      });
    
    // Sample pairwise similarity analysis (first 10 locations)
    const sampleSize = Math.min(10, embeddings.length);
    const sampleEmbeddings = embeddings.slice(0, sampleSize);
    
    console.log(`\n📈 Sample Similarity Analysis (${sampleSize} locations):`);
    
    let totalSimilarities = 0;
    let similaritySum = 0;
    const similarities = [];
    
    for (let i = 0; i < sampleEmbeddings.length; i++) {
      for (let j = i + 1; j < sampleEmbeddings.length; j++) {
        const similarity = cosineSimilarity(
          sampleEmbeddings[i].embedding, 
          sampleEmbeddings[j].embedding
        );
        similarities.push(similarity);
        similaritySum += similarity;
        totalSimilarities++;
      }
    }
    
    const avgSimilarity = similaritySum / totalSimilarities;
    const maxSimilarity = Math.max(...similarities);
    const minSimilarity = Math.min(...similarities);
    
    console.log(`- Average pairwise similarity: ${(avgSimilarity * 100).toFixed(1)}%`);
    console.log(`- Maximum similarity: ${(maxSimilarity * 100).toFixed(1)}%`);
    console.log(`- Minimum similarity: ${(minSimilarity * 100).toFixed(1)}%`);
    
    // Quality assessment
    console.log('\n🎯 Embedding Quality Assessment:');
    
    if (avgSimilarity > 0.8) {
      console.log('⚠️  High average similarity - embeddings may be too similar');
    } else if (avgSimilarity < 0.2) {
      console.log('⚠️  Low average similarity - embeddings may be too different');
    } else {
      console.log('✅ Good embedding diversity');
    }
    
    if (uniqueDimensions.length === 1 && uniqueDimensions[0] === 768) {
      console.log('✅ Consistent NomicAI embedding dimensions');
    } else {
      console.log('⚠️  Inconsistent embedding dimensions detected');
    }
    
    console.log(`\n📋 Recommendations:`);
    console.log('- Use similarity scores > 75% to find highly related locations');
    console.log('- Consider similarity scores 50-75% for moderate relevance');
    console.log('- Investigate locations with very high similarity (>95%) for potential duplicates');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Find similar: node scripts/embedding-similarity.js similar <locationId> [limit]');
    console.log('  Compare two: node scripts/embedding-similarity.js compare <locationId1> <locationId2>');
    console.log('  Analyze quality: node scripts/embedding-similarity.js analyze');
    process.exit(1);
  }
  
  const command = args[0];
  
  if (command === 'similar') {
    const locationId = parseInt(args[1]);
    const limit = args[2] ? parseInt(args[2]) : 5;
    
    if (!locationId) {
      console.error('Error: Location ID is required');
      process.exit(1);
    }
    
    findSimilarLocations(locationId, limit);
    
  } else if (command === 'compare') {
    const locationId1 = parseInt(args[1]);
    const locationId2 = parseInt(args[2]);
    
    if (!locationId1 || !locationId2) {
      console.error('Error: Two location IDs are required');
      process.exit(1);
    }
    
    compareLocations(locationId1, locationId2);
    
  } else if (command === 'analyze') {
    analyzeEmbeddingQuality();
    
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

module.exports = {
  cosineSimilarity,
  parseEmbedding,
  getSimilarityInterpretation,
  findSimilarLocations,
  compareLocations,
  analyzeEmbeddingQuality
}; 