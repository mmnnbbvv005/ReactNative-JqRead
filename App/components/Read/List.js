import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList
} from 'react-native';
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');

export default class header extends Component{
    render() {
      return (
        <FlatList
            data={this.props.val.text}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index}) =>
            <View onStartShouldSetResponderCapture={()=>{return true}} onResponderRelease={(e)=>this.props._onResponderRelease(e,this.props.val,index)}>
              <Text style={{fontSize:20,marginLeft:15}}>{this.props.val.title}</Text>
              <Text style={{width:width,height:height,fontSize:this.props.fontSize,lineHeight:42,paddingHorizontal:15}}>{item}</Text>
              <Text style={{position:'absolute',zIndex: 10,bottom:20,right:25,fontSize:20}}>{index+1}/{this.props.val.text.length}</Text>
            </View>}
          />
      )
    }
}
