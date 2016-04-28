"use strict";

var elasticsearch = require('elasticsearch');
var solrClient = require("solr-client");
var q = require("q");
var express = require('express');
var router = express.Router();

/*
var client = solrClient.createClient({
    port: "8085",
    path: "/solr/search",
    solrVersion: "4.0"
});
*/

var client = new elasticsearch.Client({
  host: 'elasticsearch:9200',
  log: 'trace',
  apiVersion: '2.x'
});


function search(queryParam, filters) { 
    console.log(queryParam);
    console.log(filters);
    var deferred = q.defer();
    client.search(
        {            
            index: 'document',
            body: {
                query: {
                    match: {
                        _all: {
                            query: queryParam || "",
                            "operator" : "and",
                            "fuzziness": "AUTO",
                            "zero_terms_query": "all"
                        }
                    }
                },
                aggs: {
                    "authors" : {
                        "terms" : {
                            "field" : "dc:contributor.raw"
                        }
                    }
                }
            }
        }, function(err, obj) {
        console.log("Query completed");
        if (err) {
            deferred.reject(err);
            //console.log(err);
        } else {
            //console.log(obj);
            deferred.resolve(obj);
        }
    });
    return deferred.promise;
}

module.exports = function (app) {
  app.use('/api', router);
};

router.get('/items', function (req, res, next) {
    search(req.query.q, JSON.parse(req.query.filters || "{}"))
    .then(function (items) {
        //console.log(items.hits);
        res.json(items);
    },function (err) {
        console.log(err);
    })
    .done();
});

router.get('/hierarcy', function (req, res, next) {
    //console.log(req.query);
    search(req.query.q, JSON.parse(req.query.filters))
    .then(function (items) {
        res.json(items);
    });
});