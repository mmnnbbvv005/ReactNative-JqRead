import React from 'react';
import { View,Text,StyleSheet,Image,TouchableWithoutFeedback,ActivityIndicator,FlatList,RefreshControl } from 'react-native';
import HeadComp from '../../components/Header/index'
import ViewPager from "@react-native-community/viewpager";
var Demensions = require('Dimensions');
//初始化宽高
var {width,height} = Demensions.get('window');
export default class RankListScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      ranklist:null,
      monthList:null,
      totalList:null,
      refreshing:false,
      navIndex:0
    }
  };
  _onRefresh = (index) => {
    this.setState({refreshing: true});
    switch (index) {
      case 0:
        this.GetRankList(this.props.navigation.state.params.id,0)
        break;
        case 1:
        this.GetRankList(this.props.navigation.state.params.monthId,1)
        break;
        case 2:
        this.GetRankList(this.props.navigation.state.params.totalId,2)
        break;
    }
  }
  _keyExtractor = (item, index) => item._id;
  jsNUM(num){
    if(parseInt(num)>10000){
      return (parseInt(num)/10000).toFixed(1)+'万'
    }else{
      return num
    }
  }
  GetRankList(id,type){
    this.setState({
      isLoading:true
    })
    fetch('https://api.zhuishushenqi.com/ranking/'+id,{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if(type===0){
          this.setState({
            isLoading: false,
            ranklist: responseJson.ranking.books,
            refreshing: false
          })
        }else if(type===1){
          this.setState({
            isLoading: false,
            monthList: responseJson.ranking.books,
            refreshing: false
          })
        }else{
          this.setState({
            isLoading: false,
            totalList: responseJson.ranking.books,
            refreshing: false
          })
        }
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  onPageSelected=(event)=>{
    if(event.nativeEvent.position===1){
      if(!this.state.monthList){
        this.GetRankList(this.props.navigation.state.params.monthId,1)
      }
    }else if(event.nativeEvent.position===2){
      if(!this.state.totalList){
        this.GetRankList(this.props.navigation.state.params.totalId,2)
      }
    }
    this.setState({
      navIndex:event.nativeEvent.position
    })
  }
  componentDidMount(){
    this.GetRankList(this.props.navigation.state.params.id,0)
  }
  componen(item){
    return <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('BookDetailScreen',{title:item.title,id:item._id})}>
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
    </TouchableWithoutFeedback>
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
    if(index===1){
      if(!this.state.monthList){
        this.GetRankList(this.props.navigation.state.params.monthId,1)
      }
    }else if(index===2){
      if(!this.state.totalList){
        this.GetRankList(this.props.navigation.state.params.totalId,2)
      }
    }
    this.setState({
      navIndex:index
    })
  }
  render() {
    let list=[],month=[],total=[],content=null,nav=null,Loading=null
    if(this.state.ranklist){
      list=<FlatList
        data={this.state.ranklist}
        keyExtractor={this._keyExtractor}
        getItemLayout={(data,index)=>(
          {length:150,offset:150*index,index}
        )}
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this,0)}
          />}
        initialNumToRender={5}
        removeClippedSubviews={true}
        renderItem={({item}) => this.componen(item)}
      />
    }
    if(this.state.monthList){
      month=<FlatList
      data={this.state.monthList}
      refreshControl={<RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this,1)}
        />}
      keyExtractor={this._keyExtractor}
      initialNumToRender={5}
      getItemLayout={(data,index)=>(
        {length:150,offset:150*index,index}
      )}
      renderItem={({item}) => this.componen(item)}
      />
    }
    if(this.state.totalList){
      total=<FlatList
      data={this.state.totalList}
      refreshControl={<RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this,2)}
        />}
      keyExtractor={this._keyExtractor}
      initialNumToRender={5}
      getItemLayout={(data,index)=>(
        {length:150,offset:150*index,index}
      )}
      renderItem={({item}) => this.componen(item)}
    />
    }
    if(this.state.isLoading){
      Loading=<View style={{position:'absolute',width:width,height:height,justifyContent:'center',alignItems:'center'}}>
        <View style={{width:100,height:100,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color='#fff' />
        </View>
      </View>
    }else{
      Loading=null
    }
    if(this.props.navigation.state.params.monthId&&this.props.navigation.state.params.totalId){
      content=<ViewPager ref={viewPager=>{this.viewPager=viewPager;}} style={{width:width,height:height-100}} onPageSelected={this.onPageSelected.bind(this)} >
      <View style={{padding:10}}>
         {list}
      </View>
      <View style={{padding:10}}>
         {month}
      </View>
      <View style={{padding:10}}>
         {total}
      </View>
    </ViewPager>
      nav=<View style={{flexDirection:'row', backgroundColor:'#ffffff',position:'relative'}}>
        <View style={{flex:1,height:40}}>
          <TouchableWithoutFeedback onPress={()=>this.navSel(0)}>
            <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(0)}}>周榜</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex:1,height:40,}}>
          <TouchableWithoutFeedback onPress={()=>this.navSel(1)}>
            <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(1)}}>月榜</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex:1,height:40,}}>
          <TouchableWithoutFeedback onPress={()=>this.navSel(2)}>
            <Text style={{textAlign:'center',lineHeight:40,color:this.navColor(2)}}>总榜</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{position:'absolute', bottom:0,left:this.navPosition(), width:width/3,height:2,backgroundColor:'red'}}></View>
      </View>
    }else{
      content=<View style={{padding:10}}>
          {list}
        </View>
    }
    return (
      <View style={{ flex: 1,alignItems:'center',backgroundColor:'#fafafa' }}>
       <HeadComp navigation={this.props.navigation} showBack={true} name={this.props.navigation.state.params.title} />
       {nav}
       {Loading}
       {content}
      </View>
    )
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
