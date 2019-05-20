import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');

export default class header extends Component{
    render() {
      let right=null
      let left=null
      if(this.props.right==='edit'){
        right=<View style={styles.right}>
          <TouchableWithoutFeedback onPress={()=>this.props.changeEdit()}>
            <Text style={{color:'#000000',fontSize:16,}}>{this.props.edit?'编辑':'完成'}</Text>
          </TouchableWithoutFeedback>
      </View>
      }else if(this.props.right==='search'){
        right=<View style={styles.right}>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('SearchScreen')}>
          <Icon name='md-search' color='#999999' size={24}/>
        </TouchableWithoutFeedback>
      </View>
      }
      if(this.props.showBack){
        left=<View style={styles.back}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" size={32} color='#000000' />
          </TouchableWithoutFeedback>
        </View>
      }else if(this.props.showMine){
        left=<View style={styles.back}>
          <TouchableWithoutFeedback onPress={()=>this.props.navigation.openDrawer()}>
              <Icon name="md-menu" size={32} color='#000000' />
          </TouchableWithoutFeedback>
        </View>
      }
      return (
        <View style={styles.container}>
            {left}
            <Text style={{fontSize:22,color:'#000'}}>{this.props.name}</Text>
            {right}
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#ffffff',
        width:width,
        height:60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    back:{
      position:'absolute',
      left:20,
    },
    right:{
      position:'absolute',
      right:20
    }
});
