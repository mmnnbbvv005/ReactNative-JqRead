import React from 'react';
import { View,Text,ScrollView,StyleSheet,Image,TouchableWithoutFeedback,FlatList } from 'react-native';
import HeadComp from '../../components/Header/index'
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');

export default class BookDetailScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      recommend:[]
    }
  };
  GetBookRecom(id){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/book/'+id+'/recommend',{
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
          recommend:responseJson.books
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  _keyExtractor = (item, index) => item._id;

  componentDidMount(){
    this.GetBookRecom(this.props.navigation.state.params.id)
  }
  jsNUM(num){
    if(parseInt(num)>10000){
      return (parseInt(num)/10000).toFixed(1)+'万'
    }else{
      return num
    }
  }
  render() {
    var content=null
    if(this.state.recommend.length>0){
      content=
      <FlatList
        data={this.state.recommend}
        keyExtractor={this._keyExtractor}
        removeClippedSubviews={true}
        renderItem={({item}) => <TouchableWithoutFeedback onPress={()=>this.props.navigation.push('BookDetailScreen',{title:item.title,id:item._id})}>
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
        </TouchableWithoutFeedback>}
      />
    }
    return (
      <View style={{ flex: 1 ,backgroundColor:'#f3f3f3' }}>
        <HeadComp navigation={this.props.navigation} showBack={true} name='相关书籍' />
        <ScrollView contentContainerStyle={{padding:10}}>
          {content}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
