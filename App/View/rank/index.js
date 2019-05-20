import React from 'react';
import { View,Text,StyleSheet,Image,TouchableWithoutFeedback,Dimensions } from 'react-native';
import HeadComp from '../../components/Header/index'
let width=Dimensions.get('window').width,height=Dimensions.get('window').height
export default class RankScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      rank:{}
    }
  }
  componentDidMount(){
    return fetch('https://api.zhuishushenqi.com/ranking/gender',{
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
          rank: responseJson,
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    let list=[]
    if(this.state.rank['male']){
      let male=this.state.rank['male']
      male.forEach((i,index) => {
        if(!i.collapse){
          list.push(
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('RankListScreen',{title:i.title,id:i._id,monthId:i.monthRank,totalId:i.totalRank})}  key={index}>
              <View style={styles.ranklist}>
                <Image  style={{width:40,height:40}} source={{uri:'http://statics.zhuishushenqi.com'+i.cover}} />
                <View style={styles.empt}></View>
                <Text style={{color:'#000',marginLeft:width*0.3,fontSize:16,}}>
                  {i.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )
        }
      });
    }
    return (
      <View style={{ flex: 1,alignItems:'center',backgroundColor:'#fafafa' }}>
        <HeadComp name='排行榜' right="search" navigation={this.props.navigation}/>
        <View style={{paddingVertical: 10,}}>
          {list}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ranklist:{
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    width:width*0.8,
    height:60,
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  empt:{
    position:'absolute',
    top: -50,
    right:0,
    width:width*0.5,
    height:200,
    backgroundColor:'#rgb(217, 245, 242)',
    transform:[{"rotate":"20deg"}]
  }
});
