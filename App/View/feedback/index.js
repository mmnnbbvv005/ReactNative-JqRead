import React from 'react';
import { View,Text,StyleSheet, } from 'react-native';
import HeadComp from '../../components/Header/index'

export default class FeedbackScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 ,backgroundColor:'#f3f3f3' }}>
        <HeadComp navigation={this.props.navigation} showMine={true} name='关于' />

      </View>
    );
  }
}

const styles = StyleSheet.create({

});
