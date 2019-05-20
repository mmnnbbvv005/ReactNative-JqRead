import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Animated,FlatList} from 'react-native';
import { Dimensions } from 'react-native';

let width=Dimensions.get('window').width
export default class ReadOption extends React.Component {
  state = {
    bottomAnim: new Animated.Value(-120),  // top初始值设为-60
    bgList:['#ffffff','#FFF9DE','#e9faff','#c7edcc']
  }
  openOption() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.bottomAnim,            // 动画中的变量值
      {
        toValue: 0,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  closeOption() {
    Animated.timing(                  // 随时间变化而执行动画
      this.state.bottomAnim,            // 动画中的变量值
      {
        toValue: -120,                   // 透明度最终变为1，即完全不透明
        duration: 200,              // 让动画持续一段时间
      }
    ).start();                        // 开始执行动画
  }
  render() {
    let { bottomAnim } = this.state;
    return (
      <Animated.View style={[styles.footer,{...this.props.style,bottom:bottomAnim}]}>
        <View style={styles.option}>
          <Text style={styles.text}>字号</Text>
          <View style={styles.optionBtn}>
            <TouchableOpacity onPress={()=>this.props.minus()}>
              <Text style={styles.fontBtn}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.props.add()}>
              <Text style={styles.fontBtn}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>背景</Text>
          <FlatList
            contentContainerStyle={{marginLeft:50}}
            data={this.state.bgList}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            renderItem={({item,index}) =>
              <TouchableOpacity onPress={()=>this.props.changeBg(item)}>
                <View style={[styles.bgsel,{backgroundColor:item}]}></View>
              </TouchableOpacity>
            }
          />
        </View>
      </Animated.View>
    );
  }
}

const styles=StyleSheet.create({
 footer:{
   position:'absolute',
   bottom:0,
   width:width,
   height:120,
   zIndex:20,
   backgroundColor:'rgba(0,0,0,0.8)',
   padding:20,
  },
  option:{
    flexDirection:'row',
    marginBottom:20
  },
  text:{
    color:'#ffffff',
    fontSize:18
  },
  optionBtn:{
    flexDirection:'row',
    width:320,
    marginLeft: 50,
    justifyContent: 'space-between',
  },
  fontBtn:{
    width:150,
    height:30,
    lineHeight:30,
    color:'#ffffff',
    borderColor:'#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    textAlign:'center',
    fontSize:18
  },
  bgsel:{
    width:30,
    height:30,
    borderRadius:15,
    marginRight: 20,
  }
})
