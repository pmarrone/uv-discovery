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


Q.nfcall(client.indices.create.bind(client.indices), {
  index: 'document'
})
.then(function () {
  return client.indices.putMapping({
    index: 'document',
    type: 'dspace-oai',
    body: {
       properties: {
        'dc:contributor':  {
          type: 'string',
          store : "yes",
          "term_vector" : "with_positions_offsets",
          fields: {
            'raw': {'type': 'string', 'index': 'not_analyzed'}
          }
        },
        'dc:description':  {
          type: 'string',
          store: 'yes',
          "term_vector" : "with_positions_offsets"
        }
      }
    }
  });
})
.then(function () {
  var url = 'http://172.16.248.212:8080/cgi-bin/koha/oai.pl?verb=ListRecords&metadataPrefix=oai_dc';
  //var url = 'http://rdu.unc.edu.ar/oai/snrd?verb=ListRecords&metadataPrefix=oai_dc';
  return rp(url);
})
.then(xmlResult => {
  //console.log(xmlResult);
  return parseString(xmlResult);
}).then(result => {
  console.log(result);
  
  var promises = result['OAI-PMH'].ListRecords[0].record.map(document => {
    debugger;
    var metadata = document.metadata[0]['oai_dc:dc'][0];
    
    console.log(metadata);

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
})
.then(function () {
  console.log('Done!');
}).done();
