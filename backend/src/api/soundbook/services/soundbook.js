'use strict';

/**
 * soundbook service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::soundbook.soundbook');
