

// @ts-nocheck
import 'babel-polyfill';
import { encode, decode } from 'js-base64';
window.encode = encode
window.decode = decode
import 'vant/lib/index.css'
// fix iOS String.prototype.normalize 
import '@/utils/unorm.js'
import '@/utils/ether'
// import VConsole from 'vconsole'

// if(process.env.VUE_APP_NODE_ENV != 'production') {
//   new VConsole()
// }
import { createApp } from 'vue'
import i18n from '@/language/index'
import App from './App.vue'
import router from './router'
import store from './store'

import './styles/index.scss'
import '@/utils/web3.ts'
import '@/assets/icon/iconfont.css'
import 'element-plus/dist/index.css'
import NoData from '@/components/noData/index.vue'
import TradeConfirm from '@/plugins/tradeConfirmationsModal/tradeConfirm'
import Toast from '@/plugins/toast/toast'
import Dialog from './plugins/dialog/dialog'
import CancelBtn from '@/components/cancelBtn/index.vue'
import VueCookies from 'vue-cookies'
import '@/assets/font/KenneyPixel.css'
import { isProduct } from './http/modules/common';
const app = createApp(App)
app.component('no-data',NoData)
app.component('cancel-btn',CancelBtn)
app.use(store)
// app.use(VueCookies)
// app.config.globalProperties.$cookies = VueCookies;
app.provide('$cookies', VueCookies);
app.use(router)
app.use(i18n)
app.use(TradeConfirm)
app.use(Toast)
app.use(Dialog)

app.mount('#app')




