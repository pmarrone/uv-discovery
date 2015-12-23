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
        .fl(["handle", "dc.contributor.author", "dc.description", "dc.title", "author_keyword", "location.path_1_s,location.path_2_s,location.path_3_s"])
        .facet({
            field: "author_keyword",
            pivot: {
                "fields": ["location.path_1_s,location.path_2_s,location.path_3_s", "author_keyword"]
            }
        });

    console.log("Filters: " + filters)
    for (var filter in filters) {
        if (filters.hasOwnProperty(filter)) {
            var fq = "fq=" + encodeURIComponent("{!raw f=" + filter +"}" + filters[filter]);
            console.log("fq: " + fq);            
            query.set(fq);
        }
    }

    var deferred = q.defer();
    client.search(query, function(err, obj) {
        if (err) {
            deferred.reject(err);
            //console.log(err);
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
    console.log(req.query);
    search(req.query.q, JSON.parse(req.query.filters || "{}"))
    .then(function (items) {
        res.json(items);
    });
});

router.get('/hierarcy', function (req, res, next) {
    console.log(req.query);
    search(req.query.q, JSON.parse(req.query.filters))
    .then(function (items) {
        res.json(items);
    });
});