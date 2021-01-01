// Require
const googleTrends = require('google-trends-api');

/**
 * GET INTEREST OVERTIME ROUTE
 */
exports.getOverTime = async (req, res) => {

    let keyword = 'Black lives matter';
    try {
        /**
         * TRENDS OVER TIME
         */
        let trendsOverTime = await googleTrends.interestOverTime({
            keyword: keyword,
            startTime: new Date('2020-01-01'),
            endTime: new Date(),
            granularTimeResolution: true
        });
        // Await promise response
        let promRes = await trendsOverTime;
        // If not response return false
        if (!promRes) {
            // Return false
            return res.render('index.ejs', {
                success: false,
                data: [],
                keyword
            });
        }
        // return res.send(promRes)
        // Create an array of objects time and values
        let arrData = [];
        JSON.parse(promRes).default.timelineData.forEach(t => {
            // console.log(t.formattedTime)
            // console.log(t.value)
            arrData.push({
                time: t.formattedTime,
                value: t.value,
                keyword
            })
        });
        // console.log(arrData);
        // Return the array
        if (arrData.length > 0) {
            return res.render('index.ejs', {
                success: true,
                data: arrData
            });
        }
        // else
        return res.render('index.ejs', {
            success: false,
            data: []
        });
    } catch (error) {
        if (error) throw error;
    }
}

/**
 * POST INTEREST OVERTIME ROUTE
 */
exports.postOverTime = async (req, res) => {
    // Destructuring req.body
    let {
        start
    } = req.body;
    // console.log(startDate)
    // Clear string from specials charts
    let keyword = req.body.keyword.replace(/[^\w\s]/gi, '');
    // console.log(keyword)
    try {
        /**
         * TRENDS OVER TIME
         */
        let trendsOverTime = await googleTrends.interestOverTime({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(),
            granularTimeResolution: true
        });
        // Await response
        let promRes = await trendsOverTime;
        if (!promRes) {
            // Return false
            return res.render('index.ejs', {
                success: false,
                data: [],
                keyword
            });
        }
        // return res.send(promRes)
        // Create array of objects with time and values
        let arrData = [];
        JSON.parse(promRes).default.timelineData.forEach(t => {
            // console.log(t.formattedTime)
            // console.log(t.value)
            arrData.push({
                time: t.formattedTime,
                value: t.value,
                keyword
            })
        });
        // console.log(arrData);
        // Return the array
        if (arrData.length > 0) {
            return res.render('index.ejs', {
                success: true,
                data: arrData
            });
        }
        // else
        return res.render('index.ejs', {
            success: false,
            data: []
        });
    } catch (error) {
        if (error) throw error;
    }
}
/**
 * GET DAILY TRENDS ROUTE
 */
exports.getDaily = async (req, res) => {
    try {
        /**
         * TRENDS RELATED DAILY
         */

        // DATE YYYY-MM-DD format
        let YYYY = new Date().getFullYear();
        let MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
        let DD = (new Date().getDate()) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
        let ymd = YYYY + '-' + MM + '-' + DD;
        // console.log(ymd);


        let trendsDaily = await googleTrends.dailyTrends({
            trendDate: new Date(), // trend date
            geo: 'IT', // REQUIRED US' will target United States or geo: 'FR' will target France.
            hl: 'it' // optional - type string - preferred language code for results (defaults to english).
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await promise response
        let promResDaily = await trendsDaily;
        // Create a new array
        let dataArr = [];
        // Parse and loop through
        JSON.parse(promResDaily).default.trendingSearchesDays.forEach(trend => {
            //console.log(t)
            // Push Date
            dataArr.push({
                formattedDate: trend.formattedDate,
            });
            // Push all data inside the array
            trend.trendingSearches.forEach(t => {
                // console.log(t);
                dataArr.push(t)
            });
        });
        //console.log(dataArr);
        // Response Render
        if (dataArr.length > 0) {
            return res.render('daily', {
                success: true,
                data: dataArr
            });
        }
        // else
        return res.render('daily', {
            success: false,
            data: []
        });

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * POST DAILY TRENDS ROUTE
 */
exports.postDaily = async (req, res) => {
    // Destructuring req.body
    // console.log(req.body)
    let {
        day,
        geo
    } = req.body;
    // Clear string from specials charts
    geo = req.body.geo.replace(/[^\w\s]/gi, '').toUpperCase();
    day = new Date(day);
    //console.log(geo)
    // console.log(day)
    // console.log(new Date())
    try {
        /**
         * TRENDS RELATED DAILY
         */
        let trendsDaily = await googleTrends.dailyTrends({
            trendDate: day, // trend date
            geo: geo, // REQUIRED US' will target United States or geo: 'FR' will target France.
            hl: 'EN' // optional - type string - preferred language code for results (defaults to english).
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await response promise
        let promResDaily = await trendsDaily;
        // console.log(promResDaily)
        // Search for errors
        let searchError = promResDaily.indexOf('<!DOCTYPE html>');
        // console.log(searchError)
        // IF NOT MATCH RETURN VALUE -1 IF MATCH 0
        // IF 0 RETURN ERROR
        if (searchError === 0) {
            // console.log(searchError);
            // Return success false
            return res.render('daily', {
                success: false,
                data: [{
                    title: {
                        query: 'The requested URL was not found on this server.'
                    }
                }]
            });
        }

        // Create a new array
        let dataArr = [];
        // Parse and loop through
        JSON.parse(promResDaily).default.trendingSearchesDays.forEach(trend => {
            //console.log(t)
            // Push Date
            dataArr.push({
                formattedDate: trend.formattedDate,
            });
            // Push all data inside the array
            trend.trendingSearches.forEach(t => {
                // console.log(t);
                dataArr.push(t)
            });
        });
        // console.log(dataArr);
        // Response Render
        if (dataArr.length > 0) {
            return res.render('daily', {
                success: true,
                data: dataArr
            });
        }
        // Return success false
        return res.render('daily', {
            success: false,
            data: []
        });

    } catch (error) {
        if (error) console.log(error);
    }
}
/**
 * GET AUTOCOMPLETE ROUTE
 */
exports.getAutoComplete = async (req, res) => {
    try {
        /**
         * TRENDS AUTO COMPLETE
         */
        let trendsAutoComplete = await googleTrends.autoComplete({
            keyword: 'Love'
            // , hl: 'EN' // optional - type string - preferred language code for results (defaults to english).
        });
        // Await
        let promResAutoComplete = await trendsAutoComplete;
        // Create a new array
        let newArray = [];
        JSON.parse(promResAutoComplete).default.topics.forEach(a => {
            newArray.push({
                title: a.title,
                type: a.type
            });
        });
        //console.log(newArray);
        // Response
        if (newArray.length > 0) {
            return res.render('autocomplete', {
                success: true,
                data: newArray
            });
        }
        // Return false
        return res.render('autocomplete', {
            success: false,
            data: [{
                title: 'No results.'
            }]
        });

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * POST AUTOCOMPLETE ROUTE
 */
exports.postAutoComplete = async (req, res) => {
    // Destructuring
    let {
        keyword
    } = req.body;
    // Replace specials charts
    keyword = keyword.replace(/[^\w\s]/gi, '');
    // console.log(keyword);
    try {
        /**
         * TRENDS AUTO COMPLETE
         */
        let trendsAutoComplete = await googleTrends.autoComplete({
            keyword: keyword
            // , hl: 'EN' // optional - type string - preferred language code for results (defaults to english).
        });
        // Await response
        let promResAutoComplete = await trendsAutoComplete;
        // Create a new array
        let newArray = [];
        // Push
        JSON.parse(promResAutoComplete).default.topics.forEach(a => {
            newArray.push({
                title: a.title,
                type: a.type
            });
        });
        //  console.log(newArray);
        // Response
        if (newArray.length > 0) {
            return res.render('autocomplete', {
                success: true,
                data: newArray
            });
        }
        // Return false
        return res.render('autocomplete', {
            success: false,
            data: [{
                title: 'No results.'
            }]
        });

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * GET BY REGION ROUTE
 */
exports.getByRegion = async (req, res) => {
    try {
        /**
         * TRENDS BY REGION
         */
        // Define keyword
        let keyword = 'Love'
        let trendsReg = await googleTrends.interestByRegion({
            keyword: keyword,
            startTime: new Date('2020-01-01'),
            endTime: new Date(),
            resolution: 'CITY', // can be COUNTRY, REGION, CITY or DMA
            geo: 'US'
        });
        // Await
        let promResReg = await trendsReg;
        // Create a new array
        let newArray = [];
        JSON.parse(promResReg).default.geoMapData.forEach(r => {
            newArray.push({
                keyword: keyword,
                name: r.geoName,
                value: r.value
            });
        })
        // Sort array
        newArray = newArray.sort((a, b) => {
            return a.value - b.value
        });
        // console.log(newArray)

        // Response
        if (newArray.length > 0)
            return res.render('byregion', {
                success: true,
                data: newArray
            });

        return res.render('byregion', {
            success: false,
            data: []
        });

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * POST BY REGION ROUTE
 */
exports.postByRegion = async (req, res) => {
    try {
        let {
            keyword,
            geo,
            start
        } = req.body;

        // Replace specials charts
        keyword = keyword.replace(/[^\w\s]/gi, '');
        geo = geo.replace(/[^\w\s]/gi, '').toUpperCase();
        start = new Date(start);
        /**
         * TRENDS BY REGION
         */
        // Define keyword
        let trendsReg = await googleTrends.interestByRegion({
            keyword: keyword,
            startTime: start,
            endTime: new Date(),
            resolution: 'CITY', // can be COUNTRY, REGION, CITY or DMA
            geo: geo
        });
        // Await
        let promResReg = await trendsReg;
        // Search for errors
        let searchError = promResReg.indexOf('<!DOCTYPE html>');
        // console.log(searchError)
        // IF NOT MATCH VALUE IS -1 IF MATCH 0
        // IF 0 RETURN ERROR
        if (searchError === 0) {
            // console.log(searchError);
            // Return success false
            return res.render('byregion', {
                success: false,
                data: [{
                    keyword: undefined,
                    name: 'nowhere',
                    value: 10
                }]
            });
        }
        // Create a new array
        let newArray = [];
        // Loop and push
        JSON.parse(promResReg).default.geoMapData.forEach(r => {
            newArray.push({
                keyword: keyword,
                name: r.geoName,
                value: r.value
            });
        })
        // Sort array
        newArray = newArray.sort((a, b) => {
            return a.value - b.value
        });
        // console.log(newArray)

        // Response
        if (newArray.length > 0) {
            return res.render('byregion', {
                success: true,
                data: newArray
            });
        }
        // Else
        return res.render('byregion', {
            success: false,
            data: []
        });

    } catch (error) {
        if (error) throw error;
    }
}

/**
 * GET RELATED QUERIES
 */
exports.getRelatedQueries = async (req, res) => {
    try {
        /**
         * TRENDS RELATED QUERIES
         */
        // Define keyword
        let keyword = 'Black lives matter';
        let start = '2020-01-01';
        let geo = 'US-CA';
        // Query
        let trendsQueries = await googleTrends.relatedQueries({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(),
            geo: geo
        });
        // Await promise response
        let promResQueries = await trendsQueries;
        // Create a new empty array
        let newArray = [];
        // Parse and Push objects values
        JSON.parse(promResQueries).default.rankedList.forEach(q => {
            // console.log(q)
            // Loop through array objects
            q.rankedKeyword.forEach(r => {
                // console.log(r)
                // Push objects inside the new array
                newArray.push({
                    keyword: keyword,
                    query: r.query,
                    value: r.value
                });
            });
        });
        // Sort array
        newArray = newArray.sort((a, b) => {
            return b.value - a.value
        });
        // console.log(newArray);
        // Response
        if (newArray.length > 0) {
            // Return
            return res.render('relatedqueries', {
                success: true,
                data: newArray
            })
        }
        // else response success false empty array
        return res.render('relatedqueries', {
            success: false,
            data: []
        })

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * POST RELATED QUERIES
 */
exports.postRelatedQueries = async (req, res) => {
    // Destructuring req.body
    let {
        keyword,
        geo,
        start
    } = req.body;
    // console.log(req.body)
    try {
        /**
         * TRENDS RELATED QUERIES
         */
        // Define var values and replace
        keyword = keyword.replace(/[^\w\s]/gi, '');
        geo = geo.replace(/[^\w\s]/gi, '').toUpperCase();
        start = new Date(start);
        // Query
        let trendsQueries = await googleTrends.relatedQueries({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(),
            geo: geo
        });
        // Await promise response
        let promResQueries = await trendsQueries;
        // Create a new empty array
        let newArray = [];
        // Parse and Push objects values
        JSON.parse(promResQueries).default.rankedList.forEach(q => {
            // console.log(q)
            // Loop through array objects
            q.rankedKeyword.forEach(r => {
                // console.log(r)
                // Push objects inside the new array
                newArray.push({
                    keyword: keyword,
                    query: r.query,
                    value: r.value
                });
            });
        });
        // Sort array
        newArray = newArray.sort((a, b) => {
            return b.value - a.value
        });
        // console.log(newArray);
        // Response
        if (newArray.length > 0) {
            // Return
            return res.render('relatedqueries', {
                success: true,
                data: newArray
            })
        }
        // else response success false empty array
        return res.render('relatedqueries', {
            success: false,
            data: [{
                keyword,
                query: 'Empty - Try to change date.',
                value: '0'
            }]
        })

    } catch (error) {
        if (error) throw error;
    }
}

/**
 * GET RELATED TOPICS
 */
exports.getRelatedTopics = async (req, res) => {
    try {
        // Define vars
        let keyword = 'Black lives matter';
        let geo = 'US';
        let start = '2020-01-01';
        /**
         * TRENDS RELATED TOPICS
         */
        let trendsTopics = await googleTrends.relatedTopics({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(),
            geo: geo
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await promise response
        let promResTopics = await trendsTopics;
        // Create a new empty array
        let newArray = [];
        // Parse and loop through results and create new array
        JSON.parse(promResTopics).default.rankedList.forEach(t => {
            // Loop through rankedKeyword
            t.rankedKeyword.forEach(r => {
                // console.log(r);
                // Push objects
                newArray.push({
                    keyword: keyword,
                    topic: r.topic.title,
                    type: r.topic.type,
                    value: r.value
                })
            });
        });
        // Sort array
        newArray = newArray.sort((a, b) => {
            return b.value - a.value;
        });
        // console.log(newArray)

        // Response
        // Check
        if (newArray.length > 0) {
            return res.render('topics', {
                success: true,
                data: newArray
            })
        }
        // else
        return res.render('topics', {
            success: false,
            data: []
        })
        res.send(promResTopics)


    } catch (error) {
        if (error) throw error;
    }
}

/**
 * POST RELATED TOPICS
 */
exports.postRelatedTopics = async (req, res) => {
    try {
        // Destructuring
        let {
            keyword,
            start,
            geo
        } = req.body;
        // Define vars values and replace
        keyword = keyword.replace(/[^\w\s]/gi, '');
        // Replace and uppercase
        geo = geo.replace(/[^\w\s]/gi, '').toUpperCase();
        // New date
        start = new Date(start);
        /**
         * TRENDS RELATED TOPICS
         */
        let trendsTopics = await googleTrends.relatedTopics({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(),
            geo: geo
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await promise response
        let promResTopics = await trendsTopics;
        // Create a new empty array
        let newArray = [];
        // Parse and loop through results and create new array
        JSON.parse(promResTopics).default.rankedList.forEach(t => {
            // Loop through rankedKeyword
            t.rankedKeyword.forEach(r => {
                // console.log(r);
                // Push objects
                newArray.push({
                    keyword: keyword,
                    topic: r.topic.title,
                    type: r.topic.type,
                    value: r.value
                })
            });
        });
        // Sort array
        newArray = newArray.sort((a, b) => {
            return b.value - a.value;
        });
        // console.log(newArray)

        // Response
        // Check
        if (newArray.length > 0) {
            return res.render('topics', {
                success: true,
                data: newArray
            })
        }
        // else
        return res.render('topics', {
            success: false,
            data: [{
                keyword,
                topic: 'Empty - Try to change date',
                type: 'Empty - Try to change date',
                value: 0
            }]
        })
        res.send(promResTopics)


    } catch (error) {
        if (error) throw error;
    }
}

/**
 * GET REALT TIME TRENDS
 */
exports.getRealTime = async (req, res) => {
    try {
        /**
         * TRENDS RELATED REAL TIME
         */
        let geo = 'US'
        let trendsRealTime = await googleTrends.realTimeTrends({
            geo: geo,
            category: 'all'
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await promise response
        let promResRealTime = await trendsRealTime;
        // Create new empty array
        let newArray = [];
        // Parse and loop through values
        JSON.parse(promResRealTime).storySummaries.trendingStories.forEach(s => {
            // Push
            newArray.push(s);
        });

        // Response
        if (newArray.length > 0) {
            return res.render('realtime', {
                success: true,
                data: newArray
            })
        }
        // else
        return res.render('realtime', {
            success: false,
            data: []
        })

    } catch (error) {
        if (error) throw error;
    }
}
/**
 * POST REALT TIME TRENDS
 */
exports.postRealTime = async (req, res) => {
    try {
        /**
         * TRENDS RELATED REAL TIME
         */
        // Destructuring
        let {
            geo
        } = req.body;
        // Replace and uppercase
        geo = geo.replace(/[^\w\s]/gi, '').toUpperCase();

        let trendsRealTime = await googleTrends.realTimeTrends({
            geo: geo,
            category: 'all'
            //,resolution: 'CITY'
            // ,geo: 'US-CA'
        });
        // Await promise response
        let promResRealTime = await trendsRealTime;
        let searchError = promResRealTime.indexOf('<!DOCTYPE html>');
        // console.log(searchError)
        // IF NOT MATCH -1 IF MATCH 0
        // IF 0 RETURN ERROR
        if (searchError === 0) {
            // console.log(searchError);
            // Return
            // Return success false
            return res.render('realtime', {
                success: false,
                data: [{
                    articles: [{
                        articleTitle: 'The requested URL was not found on this server.'
                    }]
                }]
            });
        }
        // Create new empty array
        let newArray = [];
        // Parse and loop through values
        JSON.parse(promResRealTime).storySummaries.trendingStories.forEach(s => {
            // Push
            newArray.push(s);
        });

        // Response
        if (newArray.length > 0) {
            return res.render('realtime', {
                success: true,
                data: newArray
            })
        }
        // else
        return res.render('realtime', {
            success: false,
            data: []
        })

    } catch (error) {
        if (error) throw error;
    }
}