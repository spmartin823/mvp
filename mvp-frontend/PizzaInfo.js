import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import expo from 'expo'; 
import { Components, MapView } from 'expo'; 

export class PizzaInfo extends React.Component {
  constructor(props) {
    super(props);
    console.log('this gets run')
    this.marker = props.marker
    this.state = {
      modalVisible: true, 
    };

    this.setModalVisable = (visible) => {
      this.setState({modalVisible: visible})
    }

  }

  render(props) {
    return (
      <View> 
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View>
            <Text>{this.marker.name} </Text> 
            <Text>{this.marker.duration.text} away </Text> 
            <Text>Sanitation Rating: {this.marker.sanitationRating} </Text> 
            
            <TouchableHighlight 
            onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
            <Text> turn on</Text> 
            </TouchableHighlight>

          </View>
        </Modal>
      </View> 
    );
  }
}

export default PizzaInfo;

