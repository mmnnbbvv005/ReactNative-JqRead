import React from 'react';
import { View,Text,ScrollView,StyleSheet,Image,TouchableWithoutFeedback,FlatList,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeadComp from '../../components/Header/index'
import {connect} from 'react-redux';
import {setMyBooks} from '../../Redux/Actions/index'
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');
class BookDetailScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      details:null,
      recommend:[],
      atoc:''
    }
  };
  GetBookDetail(id){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/book/'+id,{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          details:responseJson
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetBookRecom(id){
    fetch('https://api.zhuishushenqi.com/book/'+id+'/recommend',{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var obj=[]
        responseJson.books.forEach((item,index) => {
          if(index<6){
            obj.push(item)
          }
        });
        this.setState({
          recommend:obj
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetAtoc(id){
    fetch('https://api.zhuishushenqi.com/atoc?view=summary&book='+id,{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          atoc:responseJson[1]._id
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  _keyExtractor = (item, index) => item._id;
  componentDidMount(){
    this.GetBookDetail(this.props.navigation.state.params.id)
    this.GetBookRecom(this.props.navigation.state.params.id)
    this.GetAtoc(this.props.navigation.state.params.id)
  }
  wordCount(num){
    if(num>10000){
      return (num/10000 ).toFixed(1)+'万'
    }else{
      return num
    }
  }

  _addBook(){
    var data=this.state.details,books={}
    var obj={
      id:this.props.navigation.state.params.id,
      title:data.title,
      img:'http://statics.zhuishushenqi.com'+data.cover,
      atoc:this.state.atoc,
      chapter:0,
      page:0,
      sel:false
    }
    AsyncStorage.getItem('myBooks',(error,result)=>{
      if (error) {
          return
      }
      if(result){
        var res=JSON.parse(result)
        if(res[this.props.navigation.state.params.id]){
          alert('书籍已存在')
          return
        }
        books=res
      }
      books[this.props.navigation.state.params.id]=obj
      this.props.dispatch(setMyBooks(books))

      AsyncStorage.setItem('myBooks',JSON.stringify(books),(error)=>{
        if (error) {
            alert('加入书架失败');
        } else  {
            alert('加入书架成功');
        }
      })
    })
  }


  render() {
    let content=null
    if(this.state.details){
      if(this.state.isLoading){
        content=<View style={{height:600,justifyContent:'center',alignItems:'center'}}>
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </View>
      }else{
        content=<View>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View>
                <Image style={{width:90,height:120,borderRadius:2}} resizeMode='contain' source={{uri:'http://statics.zhuishushenqi.com'+this.state.details.cover}} />
              </View>
              <View style={styles.headerTitle}>
                <Text style={{fontSize:20,color:'#000000'}}>{this.state.details.title}</Text>
                <View style={{ marginTop:10, color:'#9a9a9a',flexDirection:'row' }}>
                  <Text>{this.state.details.author} |</Text>
                  <Text> {this.state.details.majorCate}</Text>
                </View>
                <Text style={{marginTop:10}}>{this.wordCount(this.state.details.wordCount)}字</Text>
                <Text style={this.state.details.isSerial?styles.serial:styles.finish}>{this.state.details.isSerial?'连载':'完结'}</Text>
              </View>
            </View>
            <View style={styles.moreData}>
              <Text>人气 : <Text style={styles.moreDataTxt}>{this.wordCount(this.state.details.latelyFollower)}</Text></Text>
              <Text>读者留存率 : <Text style={styles.moreDataTxt}>{this.state.details.retentionRatio}%</Text></Text>
            </View>
          </View>
          <View style={styles.intro}>
            <Text style={{fontSize:18}}>
              最新章节:
              <Text style={{color:'#3dbafd'}}>{this.state.details.lastChapter}</Text>
            </Text>
            <Text style={{marginTop:10,fontSize:18}}>         {this.state.details.longIntro}</Text>
          </View>
          <View style={styles.recommend}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{fontSize:18,marginBottom:10}}>猜你喜欢</Text>
              <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('RecommendScreen',{id:this.props.navigation.state.params.id})}>
                <Text style={{fontSize:18,color:'#3dbafd'}}>更多</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.recommendList}>
              <FlatList
                data={this.state.recommend}
                keyExtractor={this._keyExtractor}
                numColumns={3}
                renderItem={({item}) =><TouchableWithoutFeedback onPress={()=>this.props.navigation.push('BookDetailScreen',{title:item.title,id:item._id})}>
                    <View style={{width:width*0.25, marginBottom:10,marginHorizontal:14}}>
                    <Image style={{width:width*0.25,height:170,borderRadius:2}} resizeMode='contain' source={{uri:'http://statics.zhuishushenqi.com'+item.cover}} />
                    <Text numberOfLines={1}>{item.title}</Text>
                  </View>
                </TouchableWithoutFeedback>
                }
              />
            </View>
          </View>
      </View>
      }
    }
    return (
      <View style={{ flex: 1 ,backgroundColor:'#f3f3f3' }}>
        <HeadComp navigation={this.props.navigation} showBack={true} name={this.props.navigation.state.params.title} />
        <ScrollView >
          {content}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableWithoutFeedback onPress={()=>this._addBook()}>
            <Text style={styles.btn}>加入书架</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ReadScreen',{atoc:this.state.atoc,chapter:0,id:this.props.navigation.state.params.id,img:'http://statics.zhuishushenqi.com'+this.state.details.cover,page:0,title:this.state.details.title})}>
            <Text style={[styles.btn,{backgroundColor:'#3dbafd',color:'#ffffff'}]}>立即阅读</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('CataScreen',{atoc:this.state.atoc,chapter:0,id:this.props.navigation.state.params.id,img:'http://statics.zhuishushenqi.com'+this.state.details.cover,page:0,title:this.state.details.title})}>
            <Text style={styles.btn}>浏览目录</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    height:220,
    padding: 20,
    backgroundColor:'#ffffff',
  },
  headerInfo:{
    flexDirection:'row',
  },
  headerTitle:{
    marginLeft:20,
    fontSize:18
  },
  serial:{
    color:'#3dbafd',
    marginTop:10
  },
  finish:{
    color:'#eb2d4a',
    marginTop:10
  },
  moreData:{
    marginTop:20,
    paddingHorizontal: 20,
    width:width*0.9,
    height:40,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color:'#9a9a9a',
    borderWidth: 1,
    borderColor: '#9a9a9a',
    borderRadius:10
  },
  moreDataTxt:{
    fontSize:18,
    color:'#000000'
  },
  intro:{
    backgroundColor:'#ffffff',
    marginTop:10,
    padding:20,
    color:'#000000'
  },
  recommend:{
    backgroundColor:'#ffffff',
    marginTop:10,
    paddingHorizontal:20,
    paddingTop: 10,
  },
  footer:{
    height:60,
    flexShrink: 0,
    width: '100%',
    flexDirection:'row',
    backgroundColor:'#ffffff',
    elevation:5
  },
  btn:{
    height:60,
    lineHeight:60,
    flex:1,
    textAlign:'center',
    fontSize:16
  },
  loading:{
    width:80,
    height:80,
    borderRadius:5,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems:'center'
  }
});

function mapStateToProps(state){
  const {mybooks} = state;
  return {
    mybooks
  }
}


export default connect(mapStateToProps)(BookDetailScreen)
