'use strict'; // ?
module.exports = function(app) {
  var user = require('../controllers/userController.js');
  var game = require('../controllers/gameController.js');
  var algorithms = require('../controllers/algorithmController.js');
  // routes for game:
  app.get('/users', user.getAllUsers)
  app.post('/users', user.addAUser);

  // routes to handle getting and updating specific user. 
  app.get('/users/:username', user.getSpecificUserData)
  app.put('/users/:username', user.updateUser)

  // routes for games:
  app.get('/games', game.getAllGames)
  app.post('/games', game.addAGame);

  app.put('/games/:id', game.updateGame)

  // routes algorithms: 
  app.get('/algos', game.getAllAlgorithms)
  app.post('/algos', game.addAlgorithm);

  app.put('/algos/:id', game.updateAlgorithm)
  
};