'use strict'; // right?
var mongoose = require('mongoose');
var db = require('../server.js')

var Schema = mongoose.Schema;

var storeSchema = new Schema({
  _id : {
    type: String,  
  }, 

  locationAddress: {
    type: String, 
    required: true, 
  }, 

  name: {
    type: String, 

  },

  // this will not be used until there is some sort of auth and session system
  // in place. The ratings themselves will have to be some sort of object. 
  ratings: {
    type: Array, 
    default: [], 
  }, 

  // this refers to the date and time that the yelp reviews were updated.  If 
  // this is greater than a day, then the yelp review api will be called again.
  dateUpdated: {
    type: Date,
    default: Date.now
  },

  dollar: {
    type: Boolean,
    default: true, 
  }, 

  sanitationRating: {
    type: String, 
    default: "A", 
  }, 

  locationGeometry: {
    type: Array, 
  }, 

  yelpReviews: {
    type: Array, 
  }, 

  yelpRating: {
    type: Number,
  }, 

  // these will not be stored as actualy photos (buffer), they will be stored
  // as strings that are urls refrencing the photos. 
  yelpPhotos: {
    type: String,
  }, 

  // these will not be stored as actualy photos (buffer), they will be stored
  // as strings that are urls refrencing the menus. If I can get the text of 
  // the menus, then the string format will already work. 
  yelpMenus: {
    type: String,
  }
});

mongoose.model('storeSchema', storeSchema);


// sample data looks like this: 

// {
//     "_id": {
//         "$oid": "59fbc1f474ce466ca1925641"
//     },
//     "locationAddress": "755 6th Ave New York, NY 10010",
//     "name": "2 Bros Pizza, Flat Iron",
//     "ratings": [],
//     "dateUpdated": {
//         "$date": "2017-11-03T01:10:12.632Z"
//     },
//     "dollar": true,
//     "sanitationRating": "A",
//     "locationGeometry": [
//         40.744382,
//         -73.992049
//     ],
//     "__v": 0
// }