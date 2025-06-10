/**
 * Custom location routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/locations/search',
      handler: 'location.search',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 