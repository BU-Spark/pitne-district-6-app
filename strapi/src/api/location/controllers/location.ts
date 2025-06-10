/**
 * location controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::location.location', ({ strapi }) => ({
  // Default CRUD operations
  ...factories.createCoreController('api::location.location'),

  // Custom search endpoint
  async search(ctx) {
    try {
      const { query } = ctx.request.query;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return ctx.badRequest('Search query is required');
      }

      // Search locations by name using case-insensitive contains
      const locations = await strapi.db.query('api::location.location').findMany({
        where: {
          $and: [
            {
              name: {
                $containsi: query.trim(),
              },
            },
            {
              is_active: {
                $eq: true,
              },
            },
            {
              resource: {
                $eq: true,
              },
            },
            {
              publishedAt: {
                $notNull: true,
              },
            },
          ],
        },
        populate: true,
        limit: 50, // Limit search results
        orderBy: { name: 'asc' },
      });

      // Remove potential duplicates by filtering unique documentId
      const uniqueLocations = locations.filter((location, index, self) => 
        index === self.findIndex(l => l.documentId === location.documentId)
      );

      return {
        data: uniqueLocations,
        meta: {
          total: uniqueLocations.length,
        },
      };
    } catch (error) {
      console.error('Search error:', error);
      return ctx.internalServerError('An error occurred while searching locations');
    }
  },
}));
