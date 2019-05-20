import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
import { createAppContainer, createMaterialTopTabNavigator,createDrawerNavigator,createStackNavigator } from 'react-navigation';

//首页
import HomeScreen from './App/View/home/index'
//排行榜
import RankScreen from './App/View/rank/index'
//排行榜
import RankListScreen from './App/View/rank/list'
//搜索页
import SearchScreen from './App/View/search/index'
//分类
import ClassifyScreen from './App/View/classify/index'
//分类列表
import ClassifyDetailScreen from './App/View/classify/detail'
//反馈
import FeedBackScreen from './App/View/feedback/index'
//书籍详情
import BookDetailScreen from './App/View/book/detail'
//相关推荐
import RecommendScreen from './App/View/book/recommend'
//书籍目录
import CataScreen from './App/View/book/cata'
//阅读页
import ReadScreen from './App/View/book/read'

const AppNavigator = createMaterialTopTabNavigator({
  Home:{
    screen:HomeScreen,
    navigationOptions:{
      tabBarLabel:'首页',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='md-home' color={tintColor} size={24} />
      )
    }
  },
  RankScreen:{
    screen:RankScreen,
    navigationOptions:{
      tabBarLabel:'排行榜',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='md-stats' color={tintColor} size={24} />
      )
    }
  },
  SearchScreen:{
    screen:SearchScreen,
    navigationOptions:{
      tabBarLabel:'搜索',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='md-search' color={tintColor} size={24} />
      )
    }
  },
  ClassifyScreen:{
    screen:ClassifyScreen,
    navigationOptions:{
      tabBarLabel:'分类',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='md-list' color={tintColor} size={24} />
      )
    }
  }
},{
  initialRouteName:'Home',
  tabBarPosition:'bottom',
  tabBarOptions:{
    showIcon:true,
    activeTintColor:'#eb2d4a',
    inactiveTintColor:'#9a9a9a',
    tabStyle: {
      height: 50,
      lineHeight:30,
    },
    labelStyle: {
      fontSize: 14,
      marginTop:0,
      marginBottom:0
    },
    style:{
      backgroundColor:'#ffffff'
    },
    indicatorStyle:{
      backgroundColor:'#eb2d4a'
    }
  }
});

const MyDrawerNavigator = createDrawerNavigator({
  '首页': {
    screen: AppNavigator
  },
  '关于': {
    screen: FeedBackScreen
  },
},{
  drawerWidth:200
});

const StackNavi=createStackNavigator({
  Home:{
    screen:MyDrawerNavigator,
    navigationOptions:{
      header:null
    }
  },
  RankListScreen:{
    screen:RankListScreen,
    navigationOptions:{
      header:null
    }
  },
  BookDetailScreen:{
    screen:BookDetailScreen,
    navigationOptions:{
      header:null
    }
  },
  RecommendScreen:{
    screen:RecommendScreen,
    navigationOptions:{
      header:null
    }
  },
  CataScreen:{
    screen:CataScreen,
    navigationOptions:{
      header:null
    }
  },
  ClassifyDetailScreen:{
    screen:ClassifyDetailScreen,
    navigationOptions:{
      header:null
    }
  },
  ReadScreen:{
    screen:ReadScreen,
    navigationOptions:{
      header:null
    }
  }
})

export default createAppContainer(StackNavi);
