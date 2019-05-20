
import {HEIGHT, WIDTH} from "./DimensionsUtil";
import {Platform} from 'react-native';

export const contentFormat = (arr, fontSize) => {
  let fontCount = parseInt((WIDTH-20) / (fontSize));
  let lines;
  if (Platform.OS === 'ios') {
      lines = parseInt(HEIGHT / fontSize / 1.4) - 6;
      if(fontSize>24){
          lines++
      }else if(fontSize>32){
          lines=lines+2
      }
  } else {
      lines = parseInt(HEIGHT / fontSize / 1.9) - 3;
      if(fontSize<24){
          lines--
      }
  }
  let array = [];
  let str = '';
  let count = 0;
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
      let content = '\u3000\u3000' + arr[i];
      let length = content.length;
      let start = 0, end = 0;
      while (start < length) {
          if (count > lines) {
              array[index] = str;
              str = '';
              count = 0;
              index++
          }
          let c = optimizeText(content.substring(start, content.length - 1), fontCount);
          end = start + c;
          str = str + content.substring(start, end) + '\n';
          start = end;
          count++;
      }
      if (i + 1 === arr.length) {
          array[index] = str;
      }
  }
  // console.log('array',array);
  return array
};
const o = '`1234567890-=~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnmERTYUIPASFHJKLZXCVBN[]{}|;,./<>?"“”‘’';
export function optimizeText(text, fontCount) {
  let count = fontCount;
  let index = 0;
  let sum = 0;
  for (; index < count; index++) {
      let c = text.charAt(index);
      if (o.indexOf(c) !== -1) {
          sum++
      }
      if (sum === 2) {
          sum = 0;
          count++
      }
  }

  return count
}
