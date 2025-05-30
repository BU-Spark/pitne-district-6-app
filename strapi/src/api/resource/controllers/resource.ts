/**
 * resource controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::resource.resource', ({ strapi }) => ({
  async categoriesWithCount(ctx) {
    // Get all resources
    const resources = await strapi.entityService.findMany('api::resource.resource', {
      fields: ['category'],
      populate: {},
      filters: {},
      publicationState: 'live',
      sort: [],
      limit: -1, // get all
    });

    // Ensure resources is always an array
    const resourceArray = Array.isArray(resources) ? resources : [resources];

    // Count by category
    const counts = {};
    for (const resource of resourceArray) {
      const cat = resource.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }

    // Format as array
    const result = Object.entries(counts).map(([name, count]) => ({ name, count }));

    ctx.send(result);
  },
}));
