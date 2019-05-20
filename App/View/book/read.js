import React from 'react';
import { View,Text,FlatList,BackHandler,ScrollView,Dimensions,Alert,ToastAndroid,StyleSheet,Modal,TouchableWithoutFeedback } from 'react-native';
import ReadHead from '../../components/Read/Head'
import ReadFooter from '../../components/Read/footer'
import ReadOption from '../../components/Read/option'
import {contentFormat} from '../../utils/formart'
import {connect} from 'react-redux';
import {setMyBooks,addFontSize,minusFontSize,setBgColor} from '../../Redux/Actions/index'
import AsyncStorage from '@react-native-community/async-storage';

let width=Dimensions.get('window').width,height=Dimensions.get('window').height

class ReadScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      chapters:[],
      TXT:[],
      length:0,
      nowChapter:0,
      scrollIndex:0,
      page:0,
      headVisible:false,
      cateVisible:false,
      myBooks:null,
      light:true
    }
  };

  GetTXT(link,action){ //获取章节内容
    this.setState({
      isLoading:true
    })
    fetch('https://chapter2.zhuishushenqi.com/chapter/'+encodeURIComponent(link),{
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var text=contentFormat(responseJson.chapter.body.split(/\n/g),this.props.mybooks.fontSize)
        var obj={text:text,title:this.state.chapters[this.state.nowChapter].title,chapter:this.state.nowChapter}
        var page=0
        var arr=this.state.TXT
        if(action==='start'){
          page=this.props.navigation.state.params.page
        }
        if(this.state.TXT){
          this.setState(previousState=>{
            if(action==='prev'){
              arr.unshift(obj)
            }else if(action==='next'){
              arr.push(obj)
            }else{
              arr=[obj]
            }
            return {
              isLoading: false,
              length:previousState.length+text.length,
              chapter:this.state.nowChapter,
              scrollIndex:page,
              TXT:arr
            }
          },()=>{
              if(action==='prev'){
                this.SaveProgres(text.length-1)
                this.setState({
                  scrollIndex:text.length-1
                })
              }else if(action==='next'){
                this.SaveProgres(0)
                this.setState({
                  scrollIndex:(this.state.length-text.length)-1
                })
              }
          })
        }
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  GetChapter(id,chapter){ // 获取章节列表
    this.setState({
      isLoading:true
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
          chapters:responseJson.chapters
        })
        this.GetTXT(responseJson.chapters[chapter].link,'start')
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.setState({
      nowChapter:this.props.navigation.state.params.chapter,
      page:this.props.navigation.state.params.page
    })
    this.GetChapter(this.props.navigation.state.params.atoc,this.props.navigation.state.params.chapter)
    AsyncStorage.getItem('myBooks',(error,result)=>{
      if (error) return
      if(result){
        var res=JSON.parse(result)
        this.setState({
          myBooks:res
        })
      }
    })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if(this.state.myBooks[this.props.navigation.state.params.id]){
      this.props.navigation.goBack()
    }else{
      this.goBack(); // works best when the goBack is async
    }
    return true;
  }

  _changeLight(){
    this.setState(previousState=>{
      return {
        light:!previousState.light
      }
    })
  }

  _openOption(){
    this._readHead.closeHead()
    this._readFooter.closeFooter()
    this._readOption.openOption()
  }

  _openCate(){
    this._readHead.closeHead()
    this._readFooter.closeFooter()
    this.setState({
      cateVisible:true,
      headVisible:false
    })
  }
  _closeCate(){
    this.setState({
      cateVisible:false
    })
  }
  goBack(){
    Alert.alert('加入书架','需要将本书加入您的书架么',
    [
      {text:'确定',onPress:()=>{
        var data=this.props.navigation.state.params
        var books=this.props.mybooks.myBooks
        var res=this.state.myBooks
        data.chapter=this.state.nowChapter
        data.page=this.state.page
        books.push(data)
        this.props.dispatch(setMyBooks(books))
        res[data.id]=data
        AsyncStorage.setItem('myBooks',JSON.stringify(res))
        ToastAndroid.showWithGravity('已加入书架',ToastAndroid.SHORT,ToastAndroid.CENTER)
        this.props.navigation.goBack()
      }},
      {text:'取消',onPress:()=>{ this.props.navigation.goBack()}}
    ])
  }

  _Layout(){
    this._flatList.scrollTo({x:this.state.scrollIndex*width,animated:false})
  }

  _onResponderRelease(e,val,index){ //触摸事件处理
    if(e.nativeEvent.pageX<width/3){
      this.scrollBeg()
      if(this.state.scrollIndex===0){
        this._PrevChpter()
      }else{
        this.setState(previousState=>{
          return {
            scrollIndex:previousState.scrollIndex-1,
            nowChapter:val.chapter
          }
        },()=>{
          this._flatList.scrollTo({x:this.state.scrollIndex*width})
          if(index!==0){
            this.SaveProgres(index-1)
          }
        })
      }
    }else if(e.nativeEvent.pageX>width/3*2){
      this.scrollBeg()
      if(this.state.scrollIndex===this.state.length-2){
        this._NextChpter()
      }else{
        this.setState(previousState=>{
          return {
            scrollIndex:previousState.scrollIndex+1,
            nowChapter:val.chapter
          }
        },()=>{
          this._flatList.scrollTo({x:this.state.scrollIndex*width})
          this.SaveProgres(index+1)
        })
      }
    }else{
      if(this.state.headVisible){
        this._readHead.closeHead()
        this._readFooter.closeFooter()
      }else{
        this._readHead.openHead()
        this._readFooter.openFooter()
      }
      this._readOption.closeOption()
      this.setState(previousState=>{
        return {
          headVisible:!previousState.headVisible
        }
      })
    }
  }
  momentEnd(e){ //滑动动画结束
    var offsetX=e.nativeEvent.contentOffset.x/width
    if(offsetX>this.state.page){
      this.setState(previousState=>{
        return {
          scrollIndex:offsetX,
          page:previousState.page+1
        }
      },()=>{
        this.SaveProgres(this.state.page)
      })
    }else if(offsetX/width<this.state.page){
      this.setState(previousState=>{
        return {
          scrollIndex:offsetX,
          page:previousState.page-1
        }
      },()=>{
        this.SaveProgres(this.state.page)
      })
    }
  }

  scrollEnd(e){ //滑动结束
    if(e.nativeEvent.contentOffset.x>=(this.state.length-2)*width){
      this._NextChpter()
    }else if(e.nativeEvent.contentOffset.x===0){
      this._PrevChpter()
    }
  }
  scrollBeg(){
    if(this.state.headVisible){
      this._readHead.closeHead()
      this._readFooter.closeFooter()
      this.setState({
        headVisible:false
      })
    }

  }
  _NextChpter(){ //下一章
    var num=0
    if(this.state.nowChapter!==this.state.chapters.length-1){
      this.setState(previousState=>{
        console.log(previousState.nowChapter)
        num=previousState.nowChapter+1
        return {
          nowChapter:previousState.nowChapter+1
        }
      },()=>{
        console.log(num)
        this.GetTXT(this.state.chapters[num].link,'next')
      })
    }
  }

  _PrevChpter(){ //上一章
    var num=0
    if(this.state.nowChapter!==0){
      this.setState(previousState=>{
        num=previousState.nowChapter-1
        return {
          nowChapter:previousState.nowChapter-1
        }
      },()=>{
        this.GetTXT(this.state.chapters[num].link,'prev')
      })
    }
  }

  SaveProgres(page){
    var books=this.props.mybooks.myBooks
    var res=this.state.myBooks
    this.setState({
      page:page
    })
    books.forEach(i => {
      if(i.id===this.props.navigation.state.params.id){
        i.chapter=this.state.nowChapter,
        i.page=page
        this.props.dispatch(setMyBooks(books))
        if(res[i.id]){
          res[i.id].chapter=this.state.nowChapter,
          res[i.id].page=page
          AsyncStorage.setItem('myBooks',JSON.stringify(res))
        }
      }
    })
  }

  _selChapter(link,index){
    this.setState({
      nowChapter:index,
      page:0
    },()=>{
      this.GetTXT(link)
    })
  }

  minusFont(){
    this.props.dispatch(minusFontSize())
    this.GetTXT(this.state.chapters[this.state.nowChapter].link)
  }
  addFont(){
    this.props.dispatch(addFontSize())
    this.GetTXT(this.state.chapters[this.state.nowChapter].link)
  }
  _changeBg(val){
    console.log(val,this.props.mybooks.bgColor)
    this.props.dispatch(setBgColor(val))
  }

  render() {
    var content=[]
    if(this.state.TXT&&this.state.TXT.length>0){
      this.state.TXT.forEach((val,i) => {
        content.push(
          <FlatList
            key={i}
            data={val.text}
            extraData={this.state.light}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index}) =>
            <View style={{alignItems:'center'}} onStartShouldSetResponderCapture={()=>{return true}} onResponderRelease={(e)=>this._onResponderRelease(e,val,index)}>
              <Text style={[{fontSize:20,marginLeft:15},this.state.light?styles.lightText:styles.darkText]}>{val.title}</Text>
              <Text style={[{width:width,height:height,paddingHorizontal:10,fontSize:this.props.mybooks.fontSize, lineHeight:this.props.mybooks.fontSize*1.9,},this.state.light?styles.lightText:styles.darkText]}>{item}</Text>
              <Text style={[{position:'absolute',zIndex: 10,bottom:10,right:25,fontSize:20},this.state.light?styles.lightText:styles.darkText]}>{index+1}/{val.text.length}</Text>
            </View>}
          />
       )
      });
    }
    return (
      <View style={{ flex: 1,backgroundColor:this.state.light?this.props.mybooks.bgColor:'#000000'}} >
        <ReadHead onBack={this.handleBackPress} ref={(ref)=>this._readHead = ref}/>
        <ScrollView
          ref={(flatList)=>this._flatList = flatList}
          pagingEnabled={true}
          horizontal={true}
          onContentSizeChange={()=>this._Layout()}
          onScrollEndDrag={(e)=>this.scrollEnd(e)}
          onScrollBeginDrag={()=>this.scrollBeg()}
          onMomentumScrollEnd={(e)=>this.momentEnd(e)}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
            {content}
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={false}
          transparent={true}
          visible={this.state.cateVisible}
          onRequestClose={() => {
            this.setState({
              cateVisible:false
            })
          }}
        >
          <View style={styles.modal}>
            <TouchableWithoutFeedback onPress={()=>this._closeCate()}>
              <View style={{flex:1}}></View>
            </TouchableWithoutFeedback>
            <View style={styles.cate}>
              <View style={{height:40,justifyContent:'center',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                <Text style={{fontSize:18}}>目录</Text>
              </View>
              <FlatList
                data={this.state.chapters}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item,index}) =>
                  <TouchableWithoutFeedback onPress={()=>this._selChapter(item.link,index)}>
                    <View style={{paddingVertical:10,paddingHorizontal:10,borderBottomColor:'#cccccc',borderBottomWidth:1}}>
                      <Text style={{fontSize:16}}>{item.title}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                }
              />
            </View>
          </View>
        </Modal>
        <ReadFooter ref={(ref)=>this._readFooter = ref} light={this.state.light} changeLight={()=>this._changeLight.bind(this)} openOption={()=>this._openOption.bind(this)} openCate={()=>this._openCate.bind(this)}/>
        <ReadOption ref={(ref)=>this._readOption = ref} minus={()=>this.minusFont()} add={()=>this.addFont()} changeBg={this._changeBg.bind(this)} />
      </View>
    );
  }
}

const styles=StyleSheet.create({
  lightText:{
    color:'#767676'
  },
  darkText:{
    color:'#eeeeee'
  },
  modal:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  cate:{
    position:'absolute',
    top:100,
    left:40,
    width:400,
    height:600,
    backgroundColor:'#ffffff'
  }
})

function mapStateToProps(state){
  const {mybooks} = state;
  return {
    mybooks
  }
}

export default connect(mapStateToProps)(ReadScreen)
