'use strict'; // ?
module.exports = function(app) {
  var store = require('../controllers/storeController.js');

  // for some reason these have to go at the top. 
  app.get('/api/stores/near', store.findNearbyStores)
  app.get('/api/stores/nearest', store.findNearestStore)

  app.route('/api/stores')
    .post(store.createNewStore)
    .get(store.getAllStores)
    .put(store.updateAllStoresYelpReviews)
    .purge(store.findAndDeleteDuplicates); 

  app.route('/api/stores/:id')
    .get(store.readOneStore)
    .put(store.updateStore)
    .delete(store.removeStore);

}