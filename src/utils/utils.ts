import { defaultAbiCoder } from 'ethers/lib/utils'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
// Copy to clipboard
export const copy = async (v: string) => {
  try {
      await toClipboard(v)
      return Promise.resolve(v)
  } catch (err) {
    return Promise.reject(err)
  }
}

//Gets the query parameter for the URL
export const getQuery = () => {
  const hash = location.hash
  const strarr = hash.split('?')
  const str = strarr.length ? strarr[1] : null
  console.log('hash-----------', hash.split('?'))
  console.log('search---', location.search)
  if (!str) {
    return {}
  }
  let arr = str.split("&"); 
  let obj: any = {};
  for (let i of arr) {
    obj[i.split("=")[0]] = i.split("=")[1];
  }
  console.log('query-------', obj)
  return obj
}



export function toHex(str: string) {
  if (str === '') return ''
  var hexCharCode = []
  for (var i = 0; i < str.length; i++) {
      hexCharCode.push(str.charCodeAt(i).toString(16))
  }
  return hexCharCode.join('')
}



//Generate a globally unique identifier
export function guid() {
  function S4() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


//Download the base64 image
export const downloadBase64Img = (fileName: string = 'qrcode') => {
  let aLink = document.createElement('a')
  const canvasData = document.getElementsByTagName('canvas')
  let evt = document.createEvent("HTMLEvents")
   // InitEvent without the last two parameters will report an error under FF event type, whether it bubbles, and whether it blocks the default behavior of the browser
  evt.initEvent("click", true, true)
  aLink.download = fileName + new Date().getTime()
  aLink.href = canvasData[0].toDataURL("image/png");
  aLink.dispatchEvent(evt);
  aLink.click()
}


// An array of random sequence
export const randArr = (arr: Array<any>) => {
  var res = [];
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    var index = Math.floor(Math.random() * arr.length);
    res.push(arr[index]);
    arr.splice(index, 1);
  }
  return res;
}
