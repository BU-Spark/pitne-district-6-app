/**
 * Location lifecycle hooks
 * Automatically generate embeddings when locations are created or updated
 */

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    
    try {
      console.log('Location beforeCreate lifecycle called');
      console.log('Data:', data);
      
      // Generate embeddings before creating the location
      const embeddingService = strapi.service('api::location.embedding');
      
      if (embeddingService) {
        console.log('Embedding service found, generating embeddings...');
        const embeddings = await embeddingService.processLocationEmbeddings(data);
        
        if (embeddings) {
          data.embeddings = embeddings;
          console.log(`Generated embeddings for new location: "${data.name}"`);
        } else {
          console.log('No embeddings generated');
        }
      } else {
        console.log('Embedding service not found');
      }
    } catch (error) {
      console.error('Error in beforeCreate lifecycle hook:', error);
      // Don't throw error - let location creation continue without embeddings
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    
    try {
      // Check if fields that affect embeddings have changed
      const embeddingFields = ['name', 'category'];
      const hasEmbeddingFieldChanges = embeddingFields.some(field => data[field] !== undefined);

      if (hasEmbeddingFieldChanges) {
        console.log('Location beforeUpdate lifecycle called - embedding fields changed');
        
        // Get the existing location data to merge with updates
        const existingLocation = await strapi.entityService.findOne('api::location.location', event.params.where.id);
        const mergedData = { ...existingLocation, ...data };

        // Generate embeddings with the updated data
        const embeddingService = strapi.service('api::location.embedding');
        
        if (embeddingService) {
          const embeddings = await embeddingService.processLocationEmbeddings(mergedData);
          
          if (embeddings) {
            data.embeddings = embeddings;
            console.log(`Regenerated embeddings for updated location: "${mergedData.name}"`);
          }
        }
      }
    } catch (error) {
      console.error('Error in beforeUpdate lifecycle hook:', error);
      // Don't throw error - let location update continue without embeddings
    }
  },
}; 