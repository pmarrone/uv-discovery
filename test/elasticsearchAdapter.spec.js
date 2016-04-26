var expect = require('chai').expect;
var ElasticsearchAdapter = require('./elasticsearchAdapter');

"use strict";
describe("ElasticsearchAdapter", () => {
	describe("constructor", () => {
		it ("should be a function", () => {
			expect(ElasticsearchAdapter).to.be.a('function');
		})
	});
});