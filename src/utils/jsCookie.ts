//@ts-nocheck
import Cookies from 'js-cookie'

import { encrypt,decrypt } from '@/utils/cryptoJS.js'
import { passwordExpires } from '@/enum/time'
import store from '@/store/index'
export const pwdKey = 'password'
// const pwdKey = 'wallet-token'
const handleGetPwd = (str: string,time: number | string) => {
  return decrypt(str,time)
}

const handleSetPwd = (msg: string,time: number | string) => {
  return encrypt(msg,time)
}

/*
 * get pwd
 * */
export function getCookies(key: string = pwdKey):WalletToken | null {
  let val = store.state.system.wallet_token
  const value = Cookies.get(pwdKey)
  if(value){
    const {time} = val
    return handleGetPwd(value, time)
  }
  return ''
}
/*
 * set pwd
 * */
export function setCookies(key: string = pwdKey, value: any, expiresTime?: number) {
  let seconds = expiresTime || passwordExpires;
  const time = new Date().getTime()
  const pwd = handleSetPwd(value,time)
  const pwdObj = {
    value: '',
    time,
    seconds
  }
  let expires = new Date(new Date() * 1 + seconds * 1000)
  Cookies.set(key, pwd, { expires: expires });
  store.commit('system/UPDATE_WALLET_TOKEN',pwdObj)
  return value
 
}
/*
 * logout
 * */
export function loginOut() {
  // localStorage.removeItem('login');
  const pwd = getPwd() 
  const {seconds,time, value} = pwd
  store.commit('system/UPDATE_WALLET_TOKEN',{
    time,
    seconds,
    value:''
  })
  Cookies.set(pwdKey, '')
}


/**
 * hasLogin
 */
export function hasLogin() {
  const pwd = Cookies.get(pwdKey)
  return pwd ? true : false
}

export function getPwd(){
  const p = store.state.system.wallet_token
  return p || ''
}