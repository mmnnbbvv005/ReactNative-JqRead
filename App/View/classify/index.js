import React from 'react';
import { View,Text,StyleSheet,TouchableWithoutFeedback,ActivityIndicator,FlatList,Animated,TouchableOpacity } from 'react-native';
import HeadComp from '../../components/Header/index'
import ViewPager from "@react-native-community/viewpager";
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');
export default class ClassifyScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      leftAnim:new Animated.Value(0),
      male:null,
      female:null,
      press:null,
      navIndex:0
    }
  };
  GetClassify(){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/cats/lv2/statistics',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading:false,
          male:responseJson.male,
          female:responseJson.female,
          press:responseJson.press,
          navIndex:0
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  componentDidMount(){
    this.GetClassify()
  }

  navColor(index){
    if(index===this.state.navIndex){
      return 'red'
    }
  }
  navPosition(){
    return this.state.navIndex*(width/3)
  }
  navSel(index){
    this.viewPager.setPage(index);
    this.setState({
      navIndex:index
    },()=>{
      Animated.timing(                  // 随时间变化而执行动画
        this.state.leftAnim,            // 动画中的变量值
        {
          toValue: this.state.navIndex*(width/3),
          duration: 100,
        }
      ).start();                        // 开始执行动画
    })
  }
  onPageSelected=(event)=>{
    this.setState({
      navIndex:event.nativeEvent.position
    },()=>{
      Animated.timing(                  // 随时间变化而执行动画
        this.state.leftAnim,            // 动画中的变量值
        {
          toValue: this.state.navIndex*(width/3),
          duration: 100,
        }
      ).start();                        // 开始执行动画
    })
  }

  render() {
    var male=null,female=null,press=null
    let {leftAnim} = this.state
    if(this.state.male){
      male=<FlatList
        data={this.state.male}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item,index}) => <TouchableOpacity  onPress={()=>this.props.navigation.navigate('ClassifyDetailScreen',{major:item.name,gender:'male'})}>
          <View style={styles.list}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>(共{item.bookCount}本)</Text>
          </View>
        </TouchableOpacity>}
      />
    }
    if(this.state.female){
      female=<FlatList
        data={this.state.female}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item,index}) => <TouchableOpacity onPress={()=>this.props.navigation.navigate('ClassifyDetailScreen',{major:item.name,gender:'female'})}>
          <View style={styles.list}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>(共{item.bookCount}本)</Text>
          </View>
        </TouchableOpacity>}
      />
    }
    if(this.state.press){
      press=<FlatList
        data={this.state.press}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item,index}) => <TouchableOpacity onPress={()=>this.props.navigation.navigate('ClassifyDetailScreen',{major:item.name,gender:'press'})}>
          <View style={styles.list}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>(共{item.bookCount}本)</Text>
          </View>
        </TouchableOpacity>}
      />
    }
    return (
      <View style={{ flex: 1,backgroundColor:'#F0F0F0' }}>
        <HeadComp name='分类'  right="search" navigation={this.props.navigation}/>
        <View style={{flexDirection:'row', backgroundColor:'#ffffff',position:'relative'}}>
          <View style={{flex:1,height:40}}>
            <TouchableWithoutFeedback onPress={()=>this.navSel(0)}>
              <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(0)}}>男生</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex:1,height:40,}}>
            <TouchableWithoutFeedback onPress={()=>this.navSel(1)}>
              <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(1)}}>女生</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex:1,height:40,}}>
            <TouchableWithoutFeedback onPress={()=>this.navSel(2)}>
              <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(2)}}>出版</Text>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={{...this.props.style,position:'absolute', bottom:0,left:leftAnim, width:width/3,height:2,backgroundColor:'red'}}></Animated.View>
        </View>
        <ViewPager ref={viewPager=>{this.viewPager=viewPager;}} style={{width:width,height:height-100}} onPageSelected={this.onPageSelected.bind(this)} >
          <View style={{padding:10}}>
            {male}
          </View>
          <View style={{padding:10}}>
            {female}
          </View>
          <View style={{padding:10}}>
            {press}
          </View>
        </ViewPager>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  list:{
    backgroundColor:'#ffffff',
    marginHorizontal: 15,
    marginVertical: 10,
    width:width*0.41,
    height:60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name:{
    fontSize:18,
    color:'#000000',
  },
  count:{
    color:'#d3d7d4',
  }
});
