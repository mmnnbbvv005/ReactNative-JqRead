import React from 'react';
import { View,Text,StyleSheet,FlatList,Image,TouchableOpacity,TouchableWithoutFeedback,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeadComp from '../../components/Header/index'
import {connect} from 'react-redux';
import {setMyBooks} from '../../Redux/Actions/index'
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; //引入图标
let width=Dimensions.get('window').width,height=Dimensions.get('window').height
class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      edit:true,
      allSel:false
    }
  };
  componentDidMount(){
    this.GetMyBooks()
    // AsyncStorage.removeItem('myBooks')
  }

  GetMyBooks(){
    AsyncStorage.getItem('myBooks',(error,result)=>{
      if (error) {
          return
      }
      if(result){
        var res=JSON.parse(result)
        this.props.dispatch(setMyBooks(res))
      }
    })
  }

  _changeEdit(){
    this.setState(previousState=>{
      return {
        edit:!previousState.edit
      }
    })
    if(!this.state.edit){
      var list=this.props.mybooks.myBooks
      list.forEach(i => {
        i.sel=false
      });
      this.props.dispatch(setMyBooks(list))
    }
  }

  sel(item,index){
    var flag=true
    var list=this.props.mybooks.myBooks
    list[index].sel=!list[index].sel
    this.props.dispatch(setMyBooks(list))
    list.forEach(i => {
      if(!i.sel){
        flag=false
      }
    });
    if(flag){
      this.setState({
        allSel:true
      })
    }else{
      this.setState({
        allSel:false
      })
    }

  }
  allSel(){
    this.setState(pev=>{
      return {
        allSel:!pev.allSel
      }
    },()=>{
      var list=this.props.mybooks.myBooks
      list.forEach(i => {
        i.sel=this.state.allSel
      });
    this.props.dispatch(setMyBooks(list))
    })
  }

  del(){
    var list=this.props.mybooks.myBooks
    AsyncStorage.getItem('myBooks',(error,result)=>{
      if (error) {
          return
      }
      if(result){
        var obj=JSON.parse(result)
        var arr=list.filter((i)=>{
          delete obj[i.id]
          return !i.sel
        })
        this.props.dispatch(setMyBooks(obj))
        AsyncStorage.setItem('myBooks',JSON.stringify(obj))
      }
    })
  }

  _emptyComponent(){
    return <View style={styles.empty}>
      <MaterialIcon  name='book-plus' color='#eb2d4a' size={80} />
      <Text style={{fontSize:18,marginVertical:15}}>书架是空的呦，赶快去添加书籍吧</Text>
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('ClassifyScreen')}>
        <Text style={styles.addBook}>添加书籍</Text>
      </TouchableOpacity>
    </View>
  }

  render() {
    const {dispatch,mybooks} = this.props;
    var {myBooks}= mybooks
    var content=null,footer=null
    if(this.state.edit){
      content=<FlatList
        data={myBooks}
        numColumns={3}
        ListEmptyComponent={this._emptyComponent()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item,index}) =><TouchableOpacity onPress={()=>this.props.navigation.navigate('ReadScreen',{atoc:item.atoc,chapter:item.chapter,page:item.page,id:item.id})}>
        <View style={styles.list}>
          <Image style={{width:width*0.22,height:150,borderRadius:5}} source={{uri:item.img}} />
          <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize:16,marginTop:10,width:100}}>{item.title}</Text>
        </View>
      </TouchableOpacity> }
      />
    }else{
      content=<FlatList
        data={myBooks}
        extraData={this.state.edit}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item,index}) =><TouchableWithoutFeedback onPress={this.sel.bind(this,item,index)}>
        <View style={styles.list}>
          <View style={styles.selFrame}>
            <Icon name='ios-checkmark-circle-outline' color={item.sel?'#eb2d4a':'#f0f0f0'} size={30}/>
          </View>
          <Image style={{width:width*0.2,height:150,borderRadius:5}} source={{uri:item.img}} />
          <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize:16,marginTop:10,width:100}}>{item.title}</Text>
        </View>
      </TouchableWithoutFeedback> }
      />

      footer=<View style={styles.footer}>
              <TouchableOpacity onPress={()=>this.allSel()}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={styles.yuan}>{this.state.allSel?<Icon name='md-checkmark' color='#000000' size={18}/>:null}</View>
                  <Text style={styles.footerText}>全选</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.del()}>
                <Text style={[styles.footerText,styles.del]}>删除</Text>
              </TouchableOpacity>
            </View>
      }
    return (
      <View style={{ flex: 1 }}>
        <HeadComp name='书架' right="edit" edit={this.state.edit} showMine={true} navigation={this.props.navigation} changeEdit={this._changeEdit.bind(this)} />
        <View style={styles.content}>
          {content}
        </View>
        {footer}
      </View>
    );
  }
}

const styles=StyleSheet.create({
  content:{
    flex:1
  },
  list:{
    marginLeft: width*0.08,
    marginVertical: 10,
  },
  selFrame:{
    position:'absolute',
    zIndex:10,
    left:0,
    top: 0,
    width:100,
    height:150,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer:{
    backgroundColor:'#ffffff',
    height:50,
    elevation:5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 20,
  },
  yuan:{
    width:30,
    height:30,
    borderRadius:15,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText:{
    fontSize:18,
  },
  del:{
    backgroundColor:'#fe5f01',
    borderRadius:20,
    width:80,
    height:40,
    lineHeight:40,
    textAlign:'center',
    color:'#ffffff',
  },
  empty:{
    alignItems:'center',
    justifyContent:'center',
    height:500
  },
  addBook:{
    backgroundColor:'#fe5f01',
    fontSize:18,
    width:100,
    height:40,
    textAlign:'center',
    lineHeight:40,
    borderRadius:10,
    color:'#ffffff'
  }
})

function mapStateToProps(state){
  const {mybooks} = state;
  return {
    mybooks
  }
}

export default connect(mapStateToProps)(HomeScreen)
