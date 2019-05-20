import React from 'react';
import { View,Text,ScrollView,StyleSheet,Image,TouchableWithoutFeedback,FlatList } from 'react-native';
import HeadComp from '../../components/Header/index'


export default class BookDetailScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      cataList:[],
      reversal:false
    }
  };
  GetCata(id){
    this.setState({
      isLoading:true,
    })
    fetch('https://api.zhuishushenqi.com/atoc/'+id+'?view=chapters',{
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
          cataList:responseJson.chapters
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  componentDidMount(){
    this.GetCata(this.props.navigation.state.params.atoc)
  }

  _reversal(){
    if(this.state.reversal){
      this._flatList.scrollToIndex({index :0})
    }else{
      this._flatList.scrollToEnd()
    }

    this.setState(previousState=>{
      return {
        reversal:!previousState.reversal
      }
    })
  }

  render() {
    var content=null
    if(this.state.cataList.length>0){
      content=
      <FlatList
        data={this.state.cataList}
        ref={(ref)=>this._flatList=ref}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={()=><View style={{width:'100%',height:1,backgroundColor:'#cccccc'}}></View>}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => (
          {length: 51, offset: 51 * index, index}
        )}
        initialNumToRender={15}
        renderItem={({item,index}) => <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('ReadScreen',{atoc:this.props.navigation.state.params.atoc, id:this.props.navigation.state.params.id, chapter:index,page:0,title:this.props.navigation.state.params.title,img:this.props.navigation.state.params.img})}>
        <View  style={styles.list}>
          <Text>{item.title}</Text>
        </View>
        </TouchableWithoutFeedback>}
      />
    }
    return (
      <View style={{ flex: 1 ,backgroundColor:'#f3f3f3' }}>
        <HeadComp navigation={this.props.navigation} showBack={true} name={this.props.navigation.state.params.title} />
        <View style={styles.title}>
          <Text style={{fontSize:20}}>目录</Text>
          <TouchableWithoutFeedback onPress={()=>this._reversal()}>
            <Text style={{fontSize:20}}>{this.state.reversal?'顶部':'底部'}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{padding:10,flexGrow:1}}>
          <View style={styles.content}>
           {content}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content:{
    flex:1,
    backgroundColor:'#ffffff'
  },
  title:{
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingHorizontal:20,
    backgroundColor:'#ffffff',
    height:40,
    alignItems: 'center',
  },
  list:{
    paddingHorizontal:10,
    fontSize:18,
    height:50,
    justifyContent: 'center',
  }
});
