import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
import FontIcon from 'react-native-vector-icons/FontAwesome'; //引入图标
import { Dimensions } from 'react-native';

let width=Dimensions.get('window').width
export default class ReadFooter extends React.Component {
  state = {
    bottomAnim: new Animated.Value(-80)  // top初始值设为-60
  }
  openFooter() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.bottomAnim,            // 动画中的变量值
      {
        toValue: 0,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  closeFooter() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.bottomAnim,            // 动画中的变量值
      {
        toValue: -80,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  render() {
    let { bottomAnim } = this.state;
    return (
      <Animated.View style={[styles.footer,{...this.props.style,bottom:bottomAnim}]}>
          <TouchableOpacity onPress={this.props.changeLight()}>
            <View style={styles.btn}>
              <Icon name={this.props.light?"ios-moon":'ios-sunny'} size={32} color='#fafafa'/>
              <Text style={styles.text}>{this.props.light?'夜间':'白天'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.openOption()}>
            <View style={styles.btn}>
              <FontIcon name="font" size={32} color='#fafafa'/>
              <Text style={styles.text}>选项</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <View style={styles.btn}>
              <Icon name="ios-play-circle" size={32} color='#fafafa'/>
              <Text style={styles.text}>自动</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={this.props.openCate()}>
            <View style={styles.btn}>
              <Icon name="ios-list" size={32} color='#fafafa'/>
              <Text style={styles.text}>目录</Text>
            </View>
          </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles=StyleSheet.create({
 footer:{
   position:'absolute',
   bottom:0,
   height:80,
   width:width,
   zIndex:20,
   flexDirection: 'row',
   backgroundColor:'rgba(0,0,0,0.8)',
   paddingHorizontal:20,
   justifyContent:'space-around',
   alignItems: 'center',
  },
  btn:{
    alignItems:'center'
  },
  text:{
    fontSize:16,
    color:'#ffffff'
  }
})
