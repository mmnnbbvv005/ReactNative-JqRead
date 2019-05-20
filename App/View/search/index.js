import React from 'react';
import { View,Text,StyleSheet,Image,FlatList,TextInput,TouchableOpacity,ActivityIndicator } from 'react-native';
import HeadComp from '../../components/Header/index'
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
var dismissKeyboard = require('dismissKeyboard');
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');
export default class SearchScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      hotSearch:null,
      hotWords:null,
      searchList:[],
      text:'',
      start:0,
      limit:10,
      submitFlag:true
    }
  };

  GetHotSearch(){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/book/search-hotwords',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var arr=[]
        responseJson.searchHotWords.forEach((item,index) => {
          if(index<10){
            arr.push(item)
          }
        });
        this.setState({
          isLoading: false,
          hotSearch:arr
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetHotWord(){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/book/hot-word',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var arr=[]
        responseJson.hotWords.forEach((item,index) => {
          if(index<6){
            arr.push(item)
          }
        });
        this.setState({
          isLoading: false,
          hotWords:arr
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetSearchRes(text,load){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/book/fuzzy-search?query='+text+'&start='+this.state.start+'&limit='+this.state.limit,{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if(load){
          this.setState(previousState => {
            return {
              isLoading: false,
              submitFlag:false,
              searchList: previousState.searchList.concat(responseJson.books),
            }
          })
        }else{
          this.setState({
            isLoading: false,
            searchList:responseJson.books,
            submitFlag:false
          },()=>{
            this._flatList.scrollToIndex({viewPosition:0,index:0})
          })
        }
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  componentDidMount(){
    this.GetHotSearch()
    this.GetHotWord()
  }

  jsNUM(num){
    if(parseInt(num)>10000){
      return (parseInt(num)/10000).toFixed(1)+'万'
    }else{
      return num
    }
  }
  hotClass(index){
    if(index===0){
      return styles.first
    }else if(index===1){
      return styles.second
    }else if(index===2){
      return styles.third
    }
  }
  color(){
    var color=['#CEFFCE','#FFD2D2','#FFF4C1','#CAFFFF']
    return color[Math.floor(Math.random() * 4)]
  }
  submit(){
    if(this.state.submitFlag){
      this.setState({
        start:0
      },()=>{
        this.GetSearchRes(this.state.text)
        dismissKeyboard()
      })

    }else{
      this.setState({
        searchList:[],
        text:'',
        submitFlag:true,
        start:0
      })
    }
  }
  selHot(text){
    this.setState({
      text:text,
      start:0
    },()=>this.GetSearchRes(text))

  }
  loadMore(){
    this.setState(previousState => {
      return {
        start: previousState.start+=10,
      }
    },()=>{
      this.GetSearchRes(this.state.text,true)
    })
  }
  componen(item){
    return <TouchableOpacity onPress={()=>this.props.navigation.navigate('BookDetailScreen',{title:item.title,id:item._id})}>
    <View  style={styles.list}>
      <View style={styles.img}>
        <Image style={{width:100,height:150}} source={{uri:'http://statics.zhuishushenqi.com'+item.cover}} />
      </View>
      <View>
        <Text style={{fontSize:18,color:'#000'}}>{item.title}</Text>
        <Text style={{marginVertical:10}}>{item.author}</Text>
        <Text style={{width:width-140}} numberOfLines={3} ellipsizeMode='tail'>{item.shortIntro}</Text>
        <View style={{flexDirection:'row',marginTop:10}}>
          <Text><Text style={{color:'#b93321'}}>{this.jsNUM(item.latelyFollower)}</Text> 人气 </Text>
          <Text> | </Text>
          <Text> <Text style={{color:'#b93321'}}>{item.retentionRatio} % </Text>留存</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  }

  render() {
    var searchCom=null,wordCom=[],content=null
    if(this.state.hotSearch){
      searchCom=
      <FlatList
        data={this.state.hotSearch}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item,index}) => <TouchableOpacity onPress={()=>{this.selHot(item.word)}}>
          <View style={styles.hotlist}>
            <Text style={[styles.rank,this.hotClass(index)]}>{index+1}</Text>
            <Text style={styles.hotSearchWord}>{item.word}</Text>
          </View>
        </TouchableOpacity>}
      />
    }
    if(this.state.hotWords){
      this.state.hotWords.forEach((item,index) => {
        wordCom.push(
          <TouchableOpacity key={index} onPress={()=>{this.selHot(item)}}>
            <View>
              <Text style={[styles.hotWord,{backgroundColor:this.color()}]}>{item}</Text>
            </View>
          </TouchableOpacity>
        )
      });
    }
    if(this.state.searchList.length>0){
      content=
      <View style={{padding:10}}>
        <FlatList
          ref={(flatList)=>this._flatList = flatList}
          contentContainerStyle={{paddingBottom:100}}
          data={this.state.searchList}
          onEndReachedThreshold={0.5}
          onEndReached={()=>this.loadMore()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => this.componen(item)}
        />
      </View>
    }else if(this.state.isLoading){
      content=<View style={{alignItems:'center',marginTop:200}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中~~</Text>
      </View>
    }else{
      content=<View>
        <View style={{paddingHorizontal:20,marginTop:10}}>
          <Text style={{fontSize:20}}>搜索热词</Text>
          <View style={styles.hotFrame}>
            {searchCom}
          </View>
          <Text style={{fontSize:20,marginTop:10}}>精品推荐</Text>
          <View style={styles.hotFrame}>
            {wordCom}
          </View>
        </View>
      </View>
    }
    return (
      <View style={{ flex: 1 }}>
        <HeadComp name='搜索' navigation={this.props.navigation}/>
        <View style={styles.searchFrame}>
          <Icon name='ios-search' size={20} style={styles.icon_search} />
          <TextInput
            style={styles.search}
            placeholder="请输入搜索关键字"
            returnKeyType={'search'}
            value={this.state.text}
            onSubmitEditing={()=>{
              this.setState({
                start:0
              },()=>this.GetSearchRes(this.state.text))
              }}
            onChangeText={(text) => this.setState({text})}
          />
          <TouchableOpacity onPress={()=>this.submit()}>
            <Text style={styles.submit}>{this.state.submitFlag?'确定':'取消'}</Text>
          </TouchableOpacity>
        </View>
        {content}
      </View>
    );
  }
}

const styles=StyleSheet.create({
  searchFrame:{
    flexDirection:'row',
    paddingHorizontal:20,
    marginBottom:10
  },
  hotFrame:{
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hotlist:{
    flexDirection:'row',
    width:200
  },
  hotSearchWord:{
    height:25,
    lineHeight:25,
    marginLeft: 15,
    marginBottom: 15,
    fontSize:16
  },
  search:{
    height:40,
    width:width*0.85,
    backgroundColor:'#F0F0F0',
    borderRadius: 25,
    paddingLeft: 40,
    fontSize:16,
    marginRight:10
  },
  icon_search:{
    position:'absolute',
    top: 10,
    left:35,
    zIndex:10
  },
  submit:{
    height:35,
    lineHeight:35,
    fontSize:16
  },
  hotWord:{
    marginRight: 15,
    marginBottom: 15,
    fontSize:16,
    paddingHorizontal: 10,
    height:30,
    lineHeight:30
  },
  rank:{
    fontSize:16,
    height:25,
    width:25,
    lineHeight:25,
    textAlign:'center',
    backgroundColor:'#d3d7d4',
    color:'#ffffff'
  },
  first:{
    backgroundColor:'#f14c36'
  },
  second:{
    backgroundColor:'#ffc743'
  },
  third:{
    backgroundColor:'#f8aba6'
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
})
