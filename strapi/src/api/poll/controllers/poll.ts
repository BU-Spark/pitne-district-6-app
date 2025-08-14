/**
 * poll controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::poll.poll', ({ strapi }) => ({
  /**
   * Find active polls
   */
  async findActive(ctx) {
    try {
      const now = new Date().toISOString();
      
      const polls = await strapi.entityService.findMany('api::poll.poll', {
        filters: {
          is_active: true,
          start_date: { $lte: now },
          end_date: { $gte: now },
        },
        sort: { createdAt: 'desc' },
        limit: 1,
        publicationState: 'live',
      });

      ctx.send({ data: polls });
    } catch (error) {
      ctx.badRequest('Failed to fetch active polls');
    }
  },
}));
