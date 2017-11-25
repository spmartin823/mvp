'use strict'; // ?
const mongoose = require('mongoose');
// called this to auto attribute to google-distance-matrix 
const GOOGLE_API_KEY = require('../keys/googleMapsApi') 
const Stores = mongoose.model('storeSchema')
const distance = require('google-distance-matrix')
// these all are prefixed with api/ so that

// post 'api/stores' //tested
// the async requires you to have node 9+ or a babelrc compiler.
exports.createNewStore = async function (req, res) {
  // this will take in an address and use the google geo location api to get the coordinates and
  // post those coordinates to the database. 
  // I: 
    // locationAddress
    // name
  // console.log('this is the req.body', req.body)
  // decorate the req.body, then plug it into the schema to save, then send it. 
  let resObj = new Stores(req.body)


  res.send(resObj)
};

// get 'api/stores'
exports.getAllStores = function(req, res) {
  Stores.find({}, function(err, data) {
    if (err) {res.send(err)}
    // check if undefined to account for calls from other functions.
    // if it is called by another funciton, the data is passed to the first arg, 
    // which should be a callback. 
    return res !== undefined ? res.send(data) : req(data);
  })
}; 

// put '/api/stores'

exports.updateAllStoresYelpReviews = async function(req, res) {
  // if this has not been called in the last day (not sure if this is handled
  // in this function or in the calling function, or in the frontend), this
  // will call the Yelp api and update the reviews on the stores.  
  res.send(req)
}

// purge '/api/stores'
exports.findAndDeleteDuplicates = function(req, res) {
  // searches for coordinates that have very little variance (< 1 block === .05 miles === 0.0007173 long)
  res.send('route not yet defined')
}


//=====================================================

// 'get /api/stores/:id'
exports.readOneStore = function(req, res) {
  Stores.findById(req.params.id, function(err, store) {
    if (err) res.send(err);
    res.send(store);
  });
};

// 'put api/stores/:id'
exports.updateStore = function(req, res) {
  Stores.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, store) {
    if (err) res.send(err);
    res.send(store);
  });
};

// delete '/stores/:id'
exports.removeStore = (req, res) => {
  Stores.remove (
    {_id : req.params.id}, 
    (err, store) => {
      if (err) {res.send(err)}
      else if (store.name === undefined) res.send('store does not exit')
      else {res.send(`${store.name} successfully deleted`)}
    }
  )
};

// get '/api/stores/near'
// this takes in a param for latLng (current user location), maxDist and num. The latLng is required. 
exports.findNearbyStores = function(req, res) {
  let strLatLng = req.query.latLng; 
  let arrLatLng = req.query.latLng.split(',').map((e) => Number(e))
  let maxDistance = req.query.maxDist || 100 // this is in miles
  let numOfStores = req.query.num || 15
  let modeOfTransport = req.query.mode || 'walking'
  // console.log('params: \n arrLatLng', arrLatLng, '\n maxDistance: ' , maxDistance, '\n numOfStores: ', numOfStores, '\n modeOfTransport: ', modeOfTransport)
  
  exports.getAllStores((allStores) => {
    let culledStores = exports.getStoresWithinMaxDistance(arrLatLng, allStores, maxDistance * 1.1, Math.floor(numOfStores * 1.2))
    if (culledStores.length === 0) res.send({error : 
      'You are not in New York City. MVPizza only works in New York City right now.'})
    let storeCoords = culledStores
      .map(store => store.locationGeometry.join(","))
    distance.mode(modeOfTransport)
    distance.units('imperial')
    // wrap strLatLng in an array because the 'google-distance-matrix' module 
    // is expecting an array. 
    distance.matrix([strLatLng], storeCoords, (err, response) => {
      let data = response.rows[0].elements 
      let culledStoresInRangeIndices = exports.getXClosestIndexes(numOfStores, data)
      let culledStoresWithDurationAndDistance = culledStoresInRangeIndices
        .map(index => {
          let store = JSON.parse(JSON.stringify(culledStores[index])) // dirty copy
          store.distance = data[index].distance
          store.duration = data[index].duration
          return store; 
        })
      res.send(culledStoresWithDurationAndDistance)
    })
  }) 
} 

// this takes in a param for latLng.
exports.findNearestStore = function(req, res) {
  // this could just itself call the findNearbyStores with certain params. 
  
}


exports.getStoresWithinMaxDistance = (curLoc, stores, maxDist, maxNum) => {
  // to limit the number of api calls to google needed, we will determine
  // the closest 1.2 * numOfStores whose hypotenuse to the current location is 
  // less than 1.1 * maxDist (values are already scaled in args). This is done
  // with the pythagorean theorem. One degree latitude = 69.172 miles. 
  // console.log( maxDist, maxNum)
  return stores
      // filter by distance. Can't just sort because don't want any over maxDist.
    .filter((store) => exports.pythagDist(curLoc, store.locationGeometry) < maxDist)
      // sort by distance.
    .sort((a, b) => exports.pythagDist(curLoc, a.locationGeometry) - exports.pythagDist(curLoc, b.locationGeometry))
      // only take the first maxNum stores. 
    .reverse().slice(stores.length - maxNum).reverse(); 
}

exports.pythagDist = (latLng1, latLng2) => {
  // takes in two latLng coordinates (arr i.e. [ 40.8627438, -73.8962428 ]) 
  // and uses the pythag to find the distance in miles 
  let latLngDist = ((latLng1[0] - latLng2[0]) ** 2) + ((latLng1[1] - latLng2[1]) ** 2) ** 0.5
  return latLngDist * 69.172; 
}

exports.getXClosestIndexes = (maxLength, data) => {
  // given the google-distance-matrix api data and a maxLength number, 
  // return the an array of indices of length maxLength with the closest 
  // places, in order of closest to farthest. 
  let durationValuesArray = data.map(el => el.duration.value)
  var closestXIndexes = []
  for (let i = 0; i < durationValuesArray.length; i++) {
    if (closestXIndexes.length < maxLength) {
      // just push the index, not the actual value. 
      closestXIndexes.push(i)
    } else {
      var longest = closestXIndexes[maxLength - 1] // the index at the end of closestXIndexes
      if (durationValuesArray[longest] > durationValuesArray[i]) {
        closestXIndexes[maxLength - 1] = i
      }
    }
    closestXIndexes.sort((a, b) => durationValuesArray[a] - durationValuesArray[b])
  }
  return closestXIndexes; 
}











