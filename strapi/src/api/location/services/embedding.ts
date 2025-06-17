/**
 * Nomic Embedding Service
 * Generates embeddings using Nomic API directly instead of OpenRouter
 * OpenRouter doesn't support embedding endpoints, only chat completions
 */

interface NomicEmbeddingResponse {
  embeddings: number[][];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export default {
  /**
   * Generate embeddings for text using Nomic API directly
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text is required for embedding generation');
      }

      // Use Nomic API directly for embeddings
      const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nomic-embed-text-v1.5',
          texts: [text.trim()],
          task_type: 'search_document'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Nomic API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json() as NomicEmbeddingResponse;
      
      if (!data.embeddings || !data.embeddings[0]) {
        throw new Error('Invalid response format from Nomic API');
      }

      return data.embeddings[0];
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  },

  /**
   * Generate embedding text from location data
   * Combines only name and category for semantic search
   */
  generateEmbeddingText(locationData: any): string {
    const parts: string[] = [];
    
    if (locationData.name) {
      parts.push(locationData.name);
    }
    
    if (locationData.category) {
      parts.push(locationData.category);
      parts.push(locationData.category);
    }

    return parts.filter(Boolean).join(' ');
  },

  /**
   * Calculate cosine similarity between two embeddings
   * Useful for finding similar locations
   */
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0; // Handle zero vectors
    }

    return dotProduct / (magnitude1 * magnitude2);
  },

  /**
   * Process and store embeddings for a location
   */
  async processLocationEmbeddings(locationData: any): Promise<string | null> {
    try {
      const embeddingText = this.generateEmbeddingText(locationData);
      
      if (!embeddingText) {
        console.warn('No text available for embedding generation');
        return null;
      }

      console.log(`Generating embeddings for location: "${locationData.name}"`);
      console.log(`Embedding text: "${embeddingText}"`);
      
      const embedding = await this.generateEmbedding(embeddingText);
      
      // Store as JSON string in the database
      return JSON.stringify(embedding);
    } catch (error) {
      console.error('Failed to process location embeddings:', error);
      // Don't throw here - we don't want embedding failures to break location creation
      return null;
    }
  }
}; 