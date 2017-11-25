import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import expo from 'expo'; 
import { Components, MapView } from 'expo'; 
import PizzaMap from './PizzaMap'
import OptionsMenu from './OptionsMenu'
//TODO: pass default data from server to the app.state
// get current location from the user.
// create a map based on current location. 

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: null, 
    }
  
    this.getLocation = async () => {
      // permission request only if there is not already a state with location.
      const { Location, Permissions } = expo; // ES6
      let status = await Permissions.askAsync(Permissions.LOCATION)
      if (status.status === 'granted') {
        var location = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
        this.setState({'currentLocation' : [location.coords.latitude, location.coords.longitude].join(',')})
      } else {
        this.setState({'currentLocation' : 'permission not granted'})
        console.error('permission not granted');
      }
    }
  }

  componentWillMount() {
    this.getLocation(); 
  }


  render() {
    // console.log('this is the location: ', this.state.currentLocation)
    // check to make sure that the currentLocation is both defined and not the result of an error. 
    return (this.state.currentLocation !== 'permission not granted' && this.state.currentLocation !== null) ? (
        <View style={styles.container}>
          {/* TODO: BUILD OUT THESE COMPONENTS EVEN A LITTLE BIT
          <Text>This text will show{this.state.currentLocation}</Text>
          
          <OptionsMenu 
            currentLocation={this.state.currentLocation}

          />
        */}
          <PizzaMap currentLocation={this.state.currentLocation}/>          

        </View>
    ) : (<Text>Please enable location services.</Text>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexWrap: 'wrap', 
    justifyContent: 'center',
  },
});
