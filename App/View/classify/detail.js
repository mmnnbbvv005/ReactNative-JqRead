import React from 'react';
import { View,Text,StyleSheet,TouchableWithoutFeedback,Image,ActivityIndicator,FlatList,RefreshControl,TouchableOpacity } from 'react-native';
import HeadComp from '../../components/Header/index'
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');
export default class ClassifyDetailScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      list:[],
      minor:null,
      minorSel:'',
      start:0,
      limit:10,
      type:'hot',
      typeList:[{ name: '热门', value: 'hot' }, { name: '新书', value: 'new' }, { name: '好评', value: 'reputation' }, { name: '完结', value: 'over' }, { name: '包月', value: 'monthly' }],
    }
  };
  GetClassify(){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/cats/lv2',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var obj=null
        var data=responseJson[this.props.navigation.state.params.gender]
        data=data.filter(i=>{
          return i.major===this.props.navigation.state.params.major
        })
        this.setState({
          isLoading:false,
          minor:data[0].mins
        })
        if(this.props.navigation.state.params.gender!=='press'){
          obj={
                gender:this.props.navigation.state.params.gender,
                major:this.props.navigation.state.params.major,
                type:this.state.type
          }
          if(data[0].mins.length>0){
            obj.minor=data[0].mins[0]
          }else{
            obj.minor=''
          }
        }else{
          obj={
            gender:this.props.navigation.state.params.gender,
            major:this.props.navigation.state.params.major,
            minor:'',
            type:this.state.type
          }
        }
        this.GetClassifyList(obj)
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetClassifyList(params,load){
    if(!load){
      this.setState({
        isLoading:true
      })
    }

    fetch('https://api.zhuishushenqi.com/book/by-categories?gender='+params.gender+'&type='+params.type+'&major='+params.major+'&minor='+params.minor+'&start='+this.state.start+'&limit=10',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(load){
          this.setState(previousState => {
            return {
              isLoading: false,
              list: previousState.list.concat(responseJson.books),
            }
          })
        }else{
          this.setState({
            isLoading:false,
            list:responseJson.books
          })
        }

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  componentDidMount(){
    this.GetClassify()
  }
  needHeight(){
    if(this.props.navigation.state.params.gender==='press'){
      return (height-70)
    }else{
      return (height-160)
    }

  }
  jsNUM(num){
    if(parseInt(num)>10000){
      return (parseInt(num)/10000).toFixed(1)+'万'
    }else{
      return num
    }
  }

  typeColor(value){
    if(value==this.state.type){
      return '#e81e2a'
    }
  }
  typeSel(value){
    this.setState({
      start: 0,
      type:value
    },()=>{
      var obj={
        gender:this.props.navigation.state.params.gender,
        major:this.props.navigation.state.params.major,
        minor:this.state.minorSel,
        type:value
      }
      this.GetClassifyList(obj)
    })
  }
  minorClass(value){
    if(value==this.state.minorSel){
      return styles.sel
    }
  }
  navSel(value){
    this.setState({
      start: 0,
      minorSel:value
    },()=>{
      var obj={
        gender:this.props.navigation.state.params.gender,
        major:this.props.navigation.state.params.major,
        minor:value,
        type:this.state.type
      }
      this.GetClassifyList(obj)
    })
  }
  loadMore(){
    this.setState(previousState => {
      return {
        start: previousState.start+=10,
      }
    },()=>{
      var obj={
        gender:this.props.navigation.state.params.gender,
        major:this.props.navigation.state.params.major,
        minor:this.state.minorSel,
        type:this.state.type
      }
      this.GetClassifyList(obj,true)
    })
  }

  render() {
    var nav=null,type=null,content=null
    if(this.props.navigation.state.params.gender!=='press'){
      type=<View style={styles.nav}>
      <FlatList
          data={this.state.typeList}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          ListFooterComponent={
            <Text style={{display:'none'}}>{this.state.type}</Text>
          }
          renderItem={({item,index}) => <TouchableOpacity onPress={()=>this.typeSel(item.value)}>
            <View style={styles.navList}>
              <Text style={{fontSize:16,color:this.typeColor(item.value)}}>{item.name}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
      if(this.state.minor&&this.state.minor.length>0){
        nav=<View style={styles.nav}>
        <FlatList
            data={this.state.minor}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator = {false}
            ListHeaderComponent={
            <TouchableOpacity onPress={()=>this.navSel('')}>
              <View style={styles.navList}>
                <Text style={[{fontSize:16},this.minorClass('')]}>全部</Text>
              </View>
            </TouchableOpacity>
            }
            renderItem={({item,index}) => <TouchableOpacity onPress={()=>this.navSel(item)}>
              <View style={styles.navList}>
                <Text style={[{fontSize:16},this.minorClass(item)]}>{item}</Text>
              </View>
            </TouchableOpacity>}
        />
      </View>
      }
    }

    if(this.state.list.length>0&&!this.state.isLoading){
      content=<FlatList
        data={this.state.list}
        // contentContainerStyle={{flex:1}}
        onEndReachedThreshold={0.5}
        onEndReached={()=>this.loadMore()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('BookDetailScreen',{title:item.title,id:item._id})}>
        <View  style={styles.list}>
          <View style={styles.img}>
            <Image style={{width:100,height:150}} source={{uri:'http://statics.zhuishushenqi.com'+item.cover}} />
          </View>
          <View>
            <Text style={{fontSize:18,color:'#000'}}>{item.title}</Text>
            <Text style={{marginVertical:5}}>{item.author}</Text>
            <Text style={{width:width-140}} numberOfLines={3} ellipsizeMode='tail'>{item.shortIntro}</Text>
            <View style={{flexDirection:'row',marginTop:10}}>
              <Text><Text style={{color:'#b93321'}}>{this.jsNUM(item.latelyFollower)}</Text> 人气 </Text>
              <Text> | </Text>
              <Text> <Text style={{color:'#b93321'}}>{item.retentionRatio} % </Text>留存</Text>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>}
      />
    }else if(this.state.isLoading){
      content=<View style={{alignItems:'center',marginTop:200}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中~~</Text>
      </View>
    }
    return (
      <View style={{ flex: 1,backgroundColor:'#F0F0F0' }}>
        <HeadComp name={this.props.navigation.state.params.major}  showBack={true}  right="search" navigation={this.props.navigation}/>
        <View>
          {type}
          {nav}
          <View style={{padding:10,height:this.needHeight()}}>
            {content}
          </View>
        </View>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  nav:{
    backgroundColor:'#ffffff',
    padding: 10,
  },
  navList:{
    marginHorizontal:10
  },
  sel:{
    color:'#e81e2a'
  },
  list:{
    flex:1,
    flexDirection: 'row',
    height:150,
    backgroundColor:'#fff',
    overflow: 'hidden',
    marginBottom: 10,
  },
  img:{
    width:100,
    height:150,
    marginRight: 20
  }
});
