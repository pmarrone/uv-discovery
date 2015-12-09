angular.module("solr-discovery", 
	["ui.bootstrap", "ui.router", "ngResource"])
.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state("app", {
		url: "/",
		templateUrl: "spa/app.html"
	})
});
