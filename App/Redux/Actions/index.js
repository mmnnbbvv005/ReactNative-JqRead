import * as types from './../ActionTypes';

export function setMyBooks(res) {
    var myBooks=formatArr(res)
    return {
        type: types.ADD_BOOKS,
        myBooks  // 键值相等可以直接这么写
    }
}
export function addFontSize() {
  return {
      type: types.ADD_FONTSIZE
  }
}
export function minusFontSize() {
  return {
      type: types.MINUS_FONTSIZE
  }
}

export function setBgColor(bgColor) {
  return {
      type: types.SET_BGCOLOR,
      bgColor
  }
}

function formatArr(data){
  var arr=[]
  for (const key in data) {
    arr.push(data[key])
  }
  return arr
}
