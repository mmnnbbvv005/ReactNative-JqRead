import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
import { Dimensions } from 'react-native';

let width=Dimensions.get('window').width
export default class ReadHead extends React.Component {
  state = {
    topAnim: new Animated.Value(-60),  // top初始值设为-60
  }
  openHead() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.topAnim,            // 动画中的变量值
      {
        toValue: 0,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  closeHead() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.topAnim,            // 动画中的变量值
      {
        toValue: -60,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  render() {
    let { topAnim } = this.state;
    return (
      <Animated.View style={[styles.head,{...this.props.style,top:topAnim}]}>
        <TouchableOpacity onPress={() => this.props.onBack()}>
          <Icon name="ios-arrow-back" size={32} color='#fafafa'/>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles=StyleSheet.create({
 head:{
   position:'absolute',
   left:0,
   height:60,
   width:width,
   zIndex:20,
   backgroundColor:'rgba(0,0,0,0.8)',
   paddingHorizontal:20,
   justifyContent:'center',
  }
})
