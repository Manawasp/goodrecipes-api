
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
  , Comment     = mongoose.model('Comment')
  , Recipe      = mongoose.model('Recipe')
  , auth        = require('./services/authentification')
  , random      = require('mongoose-random')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
})


/**
 * [RANDOM] latest 4
 */

router.get('/latest', function(req, res){
  res.type('application/json');
  params = req.body
  Recipe.find().limit(4).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      rData = {error: "recipes: f(router.post'/search')"}
      log.writeLog(req, "commentRecipe", 500, rData)
      res.send(500, rData)
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    rData = {recipes: data_recipes, limit: 4, offset: 0, size: data_recipes.length}
    log.writeLog(req, "commentRecipe", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [RANDOM] random 4
 */

router.get('/random', function(req, res){
  res.type('application/json');
  params = req.body
  if (params.limit) {
    limit = params.limit
  } else {
    limit = 4
  }
  params = req.body
  Recipe.findRandom().limit(limit).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      rData = {error: "recipes: f(router.get'/random')"}
      log.writeLog(req, "commentRecipe", 500, rData)
      res.send(500, rData)
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    rData = {recipes: data_recipes, limit: limit, offset: 0, size: data_recipes.length}
    log.writeLog(req, "commentRecipe", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [RANDOM] month 4
 */

router.get('/month', function(req, res){
  res.type('application/json');
  params = req.body
  Recipe.findRandom().limit(4).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      rData = {error: "recipes: f(router.get'/month')"}
      log.writeLog(req, "commentRecipe", 500, rData)
      res.send(500, rData)
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    rData = {recipes: data_recipes, limit: 4, offset: 0, size: data_recipes.length}
    log.writeLog(req, "commentRecipe", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [RANDOM] week 1
 */

router.get('/week', function(req, res){
  res.type('application/json');
  params = req.body
  Recipe.findRandom().limit(1).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      rData = {error: "recipes: f(router.get'/week')"}
      log.writeLog(req, "commentRecipe", 500, rData)
      res.send(500, rData)
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    rData = {recipes: data_recipes, limit: 1, offset: 0, size: data_recipes.length}
    log.writeLog(req, "commentRecipe", 200, rData)
    res.send(200, rData)
  });
})

/**
 * Export router
 */

module.exports = router
