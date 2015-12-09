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

function search(queryParam) {
    var query = client.createQuery()
        .q(queryParam || "*:*")
        .fl(["handle", "dc.contributor.author", "dc.description", "dc.title", "author_keyword"])
        .facet({
            field: "author_keyword",
            pivot: {
                "fields": ["author_keyword"]
            }
        });
    var deferred = q.defer();
    client.search(query, function(err, obj) {
        if (err) {
            deferred.reject(error);
            console.log(err);
        } else {
            console.log(obj);
            deferred.resolve(obj);
        }
    });
    return deferred.promise;
}

module.exports = function (app) {
  app.use('/items/', router);
};

router.get('/', function (req, res, next) {
    console.log(req.query);
    search(req.query.q)
    .then(function (items) {
        res.json(items);
    });
});