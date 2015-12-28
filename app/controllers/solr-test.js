"use strict";

var solrClient = require("solr-client");
var q = require("q");
var express = require('express');
var router = express.Router();

var client = solrClient.createClient({
    port: "8085",
    path: "/solr/search",
    solrVersion: "4.0"
});

function search(queryParam, filters) {   
    var query = client.createQuery()
        .q(queryParam || "*:*")
        .fl(["handle", "dc.contributor.author", "dc.identifier", "dc.description", "dc.title", "author_keyword", "location.path_1_s,location.path_2_s,location.path_3_s"])
        .facet({
            limit: 10,
            field: "author_keyword",
            pivot: {
                "fields": ["location.path_1_s,location.path_2_s,location.path_3_s", "author_keyword"]
            }
        });

    console.log("Filters tested: " + filters)
    for (var filter in filters) {
        if (filters.hasOwnProperty(filter)) {
            var fq = "fq=" + encodeURIComponent("{!raw f=" + filter +"}" + filters[filter]);
            console.log("fq: " + fq);            
            query.set(fq);
        }
    }
    console.log(query);
    var deferred = q.defer();
    client.search(query, function(err, obj) {
        console.log("Query completed");
        if (err) {
            deferred.reject(err);
            console.log(err);
        } else {
            console.log(obj);
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
        console.log(items);
        res.json(items);
    },function (err) {
        console.log(err);
    })
    .done();
});

router.get('/hierarcy', function (req, res, next) {
    console.log(req.query);
    search(req.query.q, JSON.parse(req.query.filters))
    .then(function (items) {
        res.json(items);
    });
});