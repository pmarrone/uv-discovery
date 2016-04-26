var elasticsearch = require('elasticsearch');
var rp = require('request-promise');
var Q = require("q");
var parseString = Q.nfbind(require('xml2js').parseString);
var util = require('util');


var client = new elasticsearch.Client({
  host: 'elasticsearch:9200',
  log: 'trace',
  apiVersion: '2.x'
});


rp('test-oai-url')
.then(xmlResult => {
	return parseString(xmlResult);
})
.then(result => {
	//console.log(result);
	var promises = result['OAI-PMH'].ListRecords[0].record.map(document => {
		var metadata = document.metadata[0]['oai_dc:dc'][0];
		console.log(metadata);
		debugger;
		return {
			identifier: document.header[0].identifier[0],
			header: document.header[0],
			metadata: metadata
		}
	}).map(document => {
		console.log(document);
		return client.index({
			index: 'document',
			type: 'dspace-oai',
			id: document.identifier,
			body: document.metadata
		});
	});

	return Q.all(promises);
}).then(function () {
	console.log('Done!');
}).done();
