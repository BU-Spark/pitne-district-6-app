/**
 * Script to generate embeddings for Location collection type using NomicAI
 * 
 * Field proportions:
 * - 10% name field
 * - 30% category field  
 * - 60% description field
 * 
 * Features:
 * - Filters out stop words from description
 * - Overwrites existing embeddings
 * - Uses NomicAI embedding API
 * 
 * Usage: node scripts/generate-location-embeddings.js
 */

// Environment variables will be loaded when Strapi initializes

// Using built-in fetch (Node.js 18+)

// Common stop words to filter out from descriptions
const STOP_WORDS = new Set([
  'and', 'the', 'this', 'that', 'these', 'those', 'a', 'an', 'is', 'are', 'was', 'were', 
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 
  'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'to', 'of', 'in', 'on', 
  'at', 'by', 'for', 'with', 'without', 'from', 'up', 'out', 'off', 'over', 'under', 
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now'
]);

/**
 * Clean and filter text by removing stop words and unnecessary characters
 * @param {string} text - Input text to clean
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/) // Split into words
    .filter(word => word.length > 2 && !STOP_WORDS.has(word)) // Filter stop words and short words
    .join(' ') // Join back
    .trim();
}

/**
 * Create weighted text content based on field proportions
 * @param {Object} location - Location object with name, category, description
 * @returns {string} - Weighted text content
 */
function createWeightedContent(location) {
  const { name = '', category = '', description = '' } = location;
  
  // Clean the description text
  const cleanedDescription = cleanText(description);
  
  // Create weighted content by repeating fields based on proportions
  const nameWeight = 1; // 10% baseline
  const categoryWeight = 6; // 30% (3x name)
  const descriptionWeight = 3; // 60% (6x name)
  
  const weightedParts = [];
  
  // Add name (10%) - keep original formatting for names
  if (name.trim()) {
    for (let i = 0; i < nameWeight; i++) {
      weightedParts.push(name.trim());
    }
  }
  
  // Add category (30%) - keep original formatting for categories
  if (category.trim()) {
    for (let i = 0; i < categoryWeight; i++) {
      weightedParts.push(category.trim());
    }
  }
  
  // Add cleaned description (60%)
  if (cleanedDescription.trim()) {
    for (let i = 0; i < descriptionWeight; i++) {
      weightedParts.push(cleanedDescription.trim());
    }
  }
  
  return weightedParts.join(' ');
}

/**
 * Generate embedding using NomicAI API
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} - Embedding vector
 */
async function generateNomicEmbedding(text) {
  try {
    const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'nomic-embed-text-v1.5',
        texts: [text],
        task_type: 'search_document',
        dimensionality: 768
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NomicAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.embeddings || !data.embeddings[0]) {
      throw new Error('Invalid response from NomicAI API');
    }

    return data.embeddings[0];
  } catch (error) {
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embedding for a single location
 * @param {Object} location - Location object
 * @returns {Promise<Array|null>} - Embedding vector or null if failed
 */
async function generateEmbedding(location) {
  try {
    const weightedContent = createWeightedContent(location);
    
    if (!weightedContent.trim()) {
      console.warn(`Location ${location.id} has no content to embed`);
      return null;
    }
    
    console.log(`Generating embedding for location ${location.id}: "${location.name}"`);
    console.log(`Content length: ${weightedContent.length} characters`);
    console.log(`Sample content: ${weightedContent.substring(0, 100)}...`);
    
    const embedding = await generateNomicEmbedding(weightedContent);
    return embedding;
  } catch (error) {
    console.error(`Error generating embedding for location ${location.id}:`, error.message);
    return null;
  }
}

/**
 * Batch process embeddings with rate limiting
 * @param {Array} locations - Array of location objects
 * @param {number} batchSize - Number of requests per batch
 * @param {number} delayMs - Delay between batches in milliseconds
 * @returns {Promise<Array>} - Array of results
 */
async function processEmbeddingsBatch(locations, batchSize = 3, delayMs = 1500) {
  const results = [];
  
  for (let i = 0; i < locations.length; i += batchSize) {
    const batch = locations.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(locations.length / batchSize)}`);
    
    const batchPromises = batch.map(async (location) => {
      const embedding = await generateEmbedding(location);
      return {
        locationId: location.id,
        location: location,
        embedding: embedding,
        success: embedding !== null
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Rate limiting delay
    if (i + batchSize < locations.length) {
      console.log(`Waiting ${delayMs}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

/**
 * Main function to generate embeddings for all locations
 */
async function generateLocationEmbeddings() {
  try {
    console.log('🚀 Starting location embeddings generation with NomicAI...\n');
    
    // Initialize Strapi (this loads environment variables)
    const { createStrapi, compileStrapi } = require('@strapi/strapi');
    const appContext = await compileStrapi();
    const strapi = await createStrapi(appContext).load();
    
    // Validate NomicAI API key after Strapi loads environment
    if (!process.env.NOMIC_API_KEY) {
      throw new Error('NOMIC_API_KEY environment variable is required');
    }
    
    console.log('✅ Strapi loaded successfully');
    
    // Fetch all locations (including those with existing embeddings)
    const locations = await strapi.entityService.findMany('api::location.location', {
      fields: ['id', 'name', 'category', 'description', 'embeddings'],
      publicationState: 'preview', // Include both published and draft
    });
    
    console.log(`📍 Found ${locations.length} locations to process`);
    
    // Filter locations or show overwrite info
    const locationsWithEmbeddings = locations.filter(loc => loc.embeddings);
    const locationsWithoutEmbeddings = locations.filter(loc => !loc.embeddings);
    
    console.log(`📊 Embedding status:`);
    console.log(`- Locations with existing embeddings: ${locationsWithEmbeddings.length} (will be overwritten)`);
    console.log(`- Locations without embeddings: ${locationsWithoutEmbeddings.length}`);
    console.log(`- Total to process: ${locations.length}\n`);
    
    if (locations.length === 0) {
      console.log('No locations found. Exiting...');
      return;
    }
    
    // Show stop words being filtered
    console.log(`🔍 Filtering stop words: ${Array.from(STOP_WORDS).slice(0, 10).join(', ')}... (${STOP_WORDS.size} total)\n`);
    
    // Generate embeddings in batches
    const results = await processEmbeddingsBatch(locations, 3, 1500);
    
    // Process results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`📈 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
    
    // Update locations with embeddings
    console.log('\n💾 Updating locations with embeddings...');
    
    let updateCount = 0;
    let overwriteCount = 0;
    
    for (const result of successful) {
      try {
        const hadEmbeddings = !!result.location.embeddings;
        
        await strapi.entityService.update('api::location.location', result.locationId, {
          data: {
            embeddings: JSON.stringify(result.embedding)
          }
        });
        
        if (hadEmbeddings) {
          overwriteCount++;
          console.log(`🔄 Overwritten embeddings for location ${result.locationId}: "${result.location.name}"`);
        } else {
          console.log(`✅ Created embeddings for location ${result.locationId}: "${result.location.name}"`);
        }
        
        updateCount++;
      } catch (error) {
        console.error(`❌ Failed to update location ${result.locationId}:`, error.message);
      }
    }
    
    // Final statistics
    console.log(`\n📈 Update Summary:`);
    console.log(`✅ Total updated: ${updateCount}`);
    console.log(`🔄 Overwritten: ${overwriteCount}`);
    console.log(`🆕 Newly created: ${updateCount - overwriteCount}`);
    
    // Report failed locations
    if (failed.length > 0) {
      console.log('\n❌ Failed locations:');
      failed.forEach(result => {
        console.log(`- ID: ${result.locationId}, Name: "${result.location.name}"`);
      });
    }
    
    // Show sample cleaned content
    if (successful.length > 0) {
      const sampleLocation = successful[0].location;
      const originalDescription = sampleLocation.description || '';
      const cleanedDescription = cleanText(originalDescription);
      
      console.log('\n🧹 Sample text cleaning:');
      console.log(`Original: ${originalDescription.substring(0, 100)}...`);
      console.log(`Cleaned: ${cleanedDescription.substring(0, 100)}...`);
    }
    
    console.log('\n🎉 Embeddings generation completed!');
    
    // Clean up Strapi instance
    await strapi.destroy();
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

/**
 * Utility function to test embedding generation for a single location
 */
async function testSingleLocation(locationId) {
  try {
    console.log(`🧪 Testing embedding generation for location ID: ${locationId}\n`);
    
    const { createStrapi, compileStrapi } = require('@strapi/strapi');
    const appContext = await compileStrapi();
    const strapi = await createStrapi(appContext).load();
    
    if (!process.env.NOMIC_API_KEY) {
      throw new Error('NOMIC_API_KEY environment variable is required');
    }
    
    const location = await strapi.entityService.findOne('api::location.location', locationId, {
      fields: ['id', 'name', 'category', 'description', 'embeddings'],
    });
    
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }
    
    console.log('📍 Location details:');
    console.log(`- ID: ${location.id}`);
    console.log(`- Name: ${location.name}`);
    console.log(`- Category: ${location.category}`);
    console.log(`- Has existing embeddings: ${!!location.embeddings}`);
    console.log(`- Description: ${location.description?.substring(0, 100)}...`);
    
    // Show text cleaning process
    const originalDescription = location.description || '';
    const cleanedDescription = cleanText(originalDescription);
    
    console.log(`\n🧹 Text cleaning demonstration:`);
    console.log(`Original description: ${originalDescription}`);
    console.log(`Cleaned description: ${cleanedDescription}`);
    
    const weightedContent = createWeightedContent(location);
    console.log(`\n📝 Weighted content (${weightedContent.length} chars):`);
    console.log(weightedContent.substring(0, 300) + '...');
    
    const embedding = await generateEmbedding(location);
    
    if (embedding) {
      console.log(`\n✅ Embedding generated successfully!`);
      console.log(`📊 Embedding dimensions: ${embedding.length}`);
      console.log(`🔢 First 10 values: [${embedding.slice(0, 10).map(v => v.toFixed(6)).join(', ')}...]`);
      
      // Update the location if requested
      console.log(`\n💾 Updating location with new embedding...`);
      await strapi.entityService.update('api::location.location', locationId, {
        data: {
          embeddings: JSON.stringify(embedding)
        }
      });
      console.log(`✅ Location ${locationId} updated successfully`);
    } else {
      console.log('\n❌ Failed to generate embedding');
    }
    
    // Clean up Strapi instance
    await strapi.destroy();
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  } finally {
    process.exit(0);
  }
}

/**
 * Utility function to analyze stop word filtering effectiveness
 */
async function analyzeStopWordFiltering() {
  try {
    console.log('🔍 Analyzing stop word filtering effectiveness...\n');
    
    const { createStrapi, compileStrapi } = require('@strapi/strapi');
    const appContext = await compileStrapi();
    const strapi = await createStrapi(appContext).load();
    
    const locations = await strapi.entityService.findMany('api::location.location', {
      fields: ['id', 'name', 'description'],
      limit: 5, // Analyze first 5 locations
    });
    
    console.log('📊 Stop word filtering analysis:\n');
    
    for (const location of locations) {
      const description = location.description || '';
      const originalWords = description.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const cleanedWords = cleanText(description).split(/\s+/).filter(w => w.length > 0);
      
      const removedWords = originalWords.filter(word => 
        !cleanedWords.includes(word.replace(/[^\w]/g, ''))
      );
      
      console.log(`📍 Location: ${location.name}`);
      console.log(`- Original word count: ${originalWords.length}`);
      console.log(`- Cleaned word count: ${cleanedWords.length}`);
      console.log(`- Words removed: ${removedWords.length} (${((removedWords.length / originalWords.length) * 100).toFixed(1)}%)`);
      console.log(`- Sample removed words: ${removedWords.slice(0, 10).join(', ')}`);
      console.log('');
    }
    
    // Clean up Strapi instance
    await strapi.destroy();
    
  } catch (error) {
    console.error('💥 Analysis error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const command = args[0];
    
    if (command === 'test' && args[1]) {
      // Test mode: node scripts/generate-location-embeddings.js test <locationId>
      const locationId = parseInt(args[1]);
      testSingleLocation(locationId);
    } else if (command === 'analyze') {
      // Analyze mode: node scripts/generate-location-embeddings.js analyze
      analyzeStopWordFiltering();
    } else {
      console.error('Usage:');
      console.error('  Generate all: node scripts/generate-location-embeddings.js');
      console.error('  Test single: node scripts/generate-location-embeddings.js test <locationId>');
      console.error('  Analyze filtering: node scripts/generate-location-embeddings.js analyze');
      process.exit(1);
    }
  } else {
    // Normal mode: generate embeddings for all locations
    generateLocationEmbeddings();
  }
}

module.exports = {
  generateLocationEmbeddings,
  testSingleLocation,
  createWeightedContent,
  generateEmbedding,
  cleanText,
  analyzeStopWordFiltering
}; 