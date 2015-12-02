"use strict";

var solrClient = require("solr-client");
var q = require("q");
var express = require('express');
var router = express.Router();

var client = solrClient.createClient({
	port: "8085",
	path: "/solr/search"
});

function search(queryParam) {
	var query = client.createQuery().q(queryParam || "*:*").fl(["handle", "author"]);
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
  app.use('/author/', router);
};

router.get('/', function (req, res, next) {
  	search(req.query.q)
  	.then(function (authors) {
  		res.json(authors.response);
  	});
});