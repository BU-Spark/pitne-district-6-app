/**
 * resource router
 */

import { factories } from '@strapi/strapi';

console.log('Loading resource routes...');

export default [
  {
    method: 'GET',
    path: '/resources/categories-with-count',
    handler: 'api::resource.resource.categoriesWithCount',
    config: {
      policies: [],
      auth: false, // Set to false for public, true for restricted
    },
  },
  {
    method: 'GET',
    path: '/resources/test',
    handler: async (ctx) => {
      console.log('Test route hit!');
      ctx.send('test ok');
    },
    config: {
      auth: false,
    },
  },
];
