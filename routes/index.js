// Require
const express = require('express');
const googleTrends = require('google-trends-api');
// Router
const router = express.Router();
// Import controllers
const {
    getOverTime,
    postOverTime,
    getAutoComplete,
    postAutoComplete,
    getByRegion,
    postByRegion,
    getRelatedQueries,
    postRelatedQueries,
    getRelatedTopics,
    postRelatedTopics,
    getRealTime,
    postRealTime,
    getDaily,
    postDaily
} = require('../controllers/index');

/**
 * GET OVERTIME INTEREST ROUTE
 */
router.get('/overtime', getOverTime)
    /**
     * POST OVERTIME INTEREST Route
     */
    .post('/overtime', postOverTime)
    // GET DAILY
    .get('/daily', getDaily)
    // POST DAILY
    .post('/daily', postDaily)
    // GET AUTOCOMPLETE ROUTE
    .get('/autocomplete', getAutoComplete)
    // POST AUTOCOMPLETE ROUTE
    .post('/autocomplete', postAutoComplete)
    // GET BY REGION ROUTE
    .get('/byregion', getByRegion)
    // POST BY REGION ROUTE
    .post('/byregion', postByRegion)
    // GET RELETED QUERIES
    .get('/relatedqueries', getRelatedQueries)
    // POST RELETED QUERIES
    .post('/relatedqueries', postRelatedQueries)
    // GET RELATED TOPICS
    .get('/relatedtopics', getRelatedTopics)
    // POST RELATED TOPICS
    .post('/relatedtopics', postRelatedTopics)
    // GET REAL TIME
    .get('/realtime', getRealTime)
    // POST REAL TIME
    .post('/realtime', postRealTime);

// Export
module.exports = router;