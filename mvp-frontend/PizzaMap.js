import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import expo from 'expo'; 
import { Components, MapView } from 'expo'; 
import axios from 'axios'
import icon from './assets/pizza-68.png'
import { Button } from 'react-native-elements'
import PizzaInfo from './PizzaInfo'
import polyline from './polylineTool.js'

export class PizzaMap extends React.Component {
  constructor(props) {
    super(props);
    this.lat = Number(props.currentLocation.split(',')[0])
    this.lng = Number(props.currentLocation.split(',')[1])
    this.currentLocation = props.currentLocation
    this.initialRegion = {
      latitude: this.lat,
      longitude: this.lng,
      // change these to change initial zoom level
      latitudeDelta: 0.02,
      longitudeDelta: 0.005,
    }
    this.handleMarkerPress = (event) => {
      // console.log(event);
      // console.log('this', this)  
    }

    this.state = {
      storeData : null, 
      coords : null,
      currentMarker : null, 
    }

    this.getPizzaStoreLocations = async () => {

      let local = 'http://localhost:3000'
      // TODO: need to add a process.env variable here. 
      // TODO: rewrite this entire section with backticks
      let extension = '/api/stores/near?latLng='
      let currentLocation = props.currentLocation
      // console.log(currentLocation)
      let completeUrl = local + extension + currentLocation; 
      console.log('get request url: ', completeUrl)
      var storeData = await axios.get(completeUrl);
      storeData = storeData.data; 
      console.log('storeData', storeData[0])
      this.setState({storeData}) 
      return storeData; 
    }
  
    // need to figure out how this is actually working at some point. 
    // this is currently delivering driving directions instead of walking directions. 
    this.getDirections = async (startLoc, destinationLoc) => { 
      try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&mode=walking`)
        let respJson = await resp.json();
        let points = polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
          return  {
            latitude : point[0],
            longitude : point[1]
          }
        })
        this.setState({coords})
      } catch(error) {
        console.error(error) 
      }
    }
  }

  componentWillMount() {
    this.getPizzaStoreLocations()
  }
  

  render(props) {
    return (this.state.storeData) ? (
      <MapView
        style={{ flex: 1 }}
        initialRegion={this.initialRegion}
      >
        <MapView.Marker 
          coordinate = {{
            latitude: this.lat, 
            longitude: this.lng
          }}
        />

      {this.state.storeData.map((marker) => {
          return (
          <View>
          <MapView.Marker 
            key = {marker._id} 
            coordinate = {{
              latitude: marker.locationGeometry[0], 
              longitude: marker.locationGeometry[1]
            }}
            image = {icon}
            onPress = {() => {
              console.log('this is what is passed to getDirections: ', this.currentLocation, marker.locationGeometry.join(','))
              this.getDirections(this.currentLocation, marker.locationGeometry.join(','))
            }}
          > 
            <MapView.Callout> 
              <Text>{marker.name} </Text> 
              <Text>{marker.duration.text} away </Text> 
              <Text>Sanitation Rating: {marker.sanitationRating} </Text> 
            </MapView.Callout>    
          </MapView.Marker>
          </View>  
          ) 
        })
      }
      <MapView.Polyline 
        coordinates={this.state.coords}
        strokeWidth={4}
        strokeColor="blue"
      />
      </MapView> 

    ) : (<Text> loading... </Text>)
  }
}

export default PizzaMap;


















