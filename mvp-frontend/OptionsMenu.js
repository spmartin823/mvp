import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import expo from 'expo'; 
import { Components, MapView } from 'expo'; 
import ReloadButton from './ReloadButton.js'

export class OptionsMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render(props) {
    return (
      <View> 
        <Text> This is where the options will go </Text> 
        <ReloadButton />
      </View> 
    );
  }
}

export default OptionsMenu;