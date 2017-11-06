import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import expo from 'expo'; 
import { Components, MapView } from 'expo'; 
import { Button } from 'react-native-elements'

export class ReloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render(props) {
    return (
      <View> 
        <Button
          raised
          title='Redo Search In Current Area'
          onPress={this.reloadPizzaPlaces}
          backgroundColor='cornflowerblue'
          
        />
      </View> 
    );
  }
}

export default ReloadButton;