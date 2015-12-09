var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');


module.exports = function (app) {
  app.use('/', router);
};

router.get('/spa/**.html', function (req, res, next) {
  var articles = [new Article(), new Article()];
  res.render("spa/" + req.params[0], {});
});
