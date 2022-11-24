
import localforage from 'localforage';
import store from '@/store'


import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/account/home.vue'
import { useLogin } from '@/components/navHeader/hooks/login';
import { getQuery } from '@/utils/utils'
const isProduct = process.env.NODE_ENV == 'production'
import transferAccount from '@/views/transferAccounts/route'
import receive from '@/views/receive/route'
import tokens from '@/views/tokens/route'
import receiveAward from '@/views/receiveAward/route'
import contacts from '@/views/contacts/route'
import connectWallet from '@/views/connectWallet/route'
import { pwdKey } from '@/utils/jsCookie';
import doc from '@/views/doc/index'
import mnemonic from '@/views/mnemonic/route'
import { debug } from 'console';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    redirect: { name: 'wallet' },
    children: [
      {
        path: 'wallet',
        name: 'wallet',
        component: () => import('@/views/account/wallet/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/transactionList',
        name: 'transactionList',
        component: () => import('@/views/account/transactionList/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/guidance',
        name: 'guidance',
        component: () => import('@/views/guidance/index.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/step',
        name: 'step',
        component: () => import('@/views/guidance/step.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: "/create-step",
        name: "create-step",
        component: () => import("@/views/guidance/createing.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: '/import',
        name: 'import',
        component: () => import('@/views/account/import/index.vue'),
        meta: {
          auth: true
        }
      },

      {
        path: "/export-mnemonic",
        name: "export-mnemonic",
        component: () => import("@/views/account/creatwallet/newwallet/mnemonic.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: "/import-mnemonic",
        name: "mnemonic-import",
        component: () => import("@/views/account/creatwallet/newwallet/mnemonic-import.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: '/newwallet',
        name: 'newwallet',
        component: () => import('@/views/account/creatwallet/newwallet/index1.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/startpage',
        name: 'startpage',
        component: () => import('@/views/account/creatwallet/newwallet/startpage.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/bourse',
        name: 'bourse',
        component: () => import('@/views/account/bourse/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/exchange-management',
        name: 'exchange-management',
        component: () => import('@/views/account/bourse/exchange-management.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/preposition-bourse',
        name: 'prepositionBourse',
        component: () => import('@/views/account/bourse/perosition-bourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/withpassword',
        name: 'withpassword',
        component: () => import('@/views/account/loginwithpassword/index.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/inputpage',
        name: 'inputpage',
        component: () => import('@/views/account/privatekeyexport/inputpage.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/successpage',
        name: 'successpage',
        component: () => import('@/views/account/privatekeyexport/successpage.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/createsuccessexchange',
        name: 'createsuccessexchange',
        component: () => import('@/views/account/createsuccess/index.vue'),
        meta: {
          auth: true
        }

      },
      {
        name:'sendContractTransaction',
        path:'/sendContractTransaction',
        component: () => import('@/views/sendContractTransaction/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/currency',
        name: 'currency',
        redirect: {
          name: 'currencyHome'
        },
        component: () => import('@/views/currency/index.vue'),
        children: [
          {
            path: '/currency/home',
            name: 'currencyHome',
            component: () => import('@/views/currency/home/index.vue'),
            meta: {
              auth: true
            }
          },
        ]
      },
      {
        path: '/sign',
        name: 'sign',
        component: () => import('@/views/sign/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/sendOpenExchangeTransaction',
        name: "sendOpenExchangeTransaction",
        component: () => import('@/views/sendOpenExchangeTransaction/index.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: '/exchangeSign',
        name: 'exchangeSign',
        component: () => import('@/views/exchangeSign/index.vue'),
        meta: {
          auth: true
        }
      },

      {
        path: '/sendTransaction',
        name: 'sendTransaction',
        component: () => import('@/views/exchangeTransaction/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/index.vue'),
        redirect: { name: 'settingsHome' },
        children: [
          {
            path: '/settings/index',
            name: 'settingsHome',
            component: () => import('@/views/settings/home/index.vue'),
            meta: {
              auth: true
            }
          },
          {
            path: '/settings/networkList',
            name: 'networkList',
            component: () => import('@/views/settings/networkList/index.vue'),
            meta: {
              auth: true
            }
          },
          {
            path: '/settings/addNetwork',
            name: 'addNetwork',
            component: () => import('@/views/settings/addNetwork/index.vue'),
            meta: {
              auth: true
            }

          },

          {
            path: '/settings/language',
            name: 'language',
            component: () => import('@/views/settings/language/index.vue'),
            meta: {
              auth: true
            }
          }

        ]
      },
      {
        path: '/miners-pledge',
        name: 'minersPledge',
        component: () => import('@/views/account/miners/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/miners-dealData',
        name: 'minersDeal',
        component: () => import('@/views/account/miners/deal.vue'),
        meta: {
          auth: true
        }
      },
      transferAccount,
      receive,
      tokens,
      receiveAward,
      contacts,
      connectWallet,
      mnemonic,
      doc
    ]
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach(async (to, form, next) => {

  // @ts-ignore
  await store.restored;
  const localPwd = localStorage.getItem(pwdKey)
  // @ts-ignore
  if (!store.state.system.movePwd && localPwd) {
    const tokenObj = localPwd ? JSON.parse(localPwd) : null
    if (tokenObj) {
      store.commit('system/UPDATE_WALLET_TOKEN', tokenObj)
      store.commit('system/UPDATE_MOVEPWD', true)
      localStorage.removeItem(pwdKey)
    }
  }
  console.log(to)
  const { name, meta } = to
  const { auth } = meta
  const { authentication, hasAccount } = useLogin()
  const hasAccountFlag = await hasAccount()
  const authFlag = authentication()
  const query = getQuery()
  console.log('---------------------', auth, name, query)
  if (!auth && (name == 'termsOfUse' || name == 'privacyNotice' || name == 'inputpage')) {
    next()
    return
  }
  
  // if(!auth && name == 'connectWallet' && !authFlag) {
  //   // @ts-ignore
  //   router.replace({name:"withpassword",query: {backUrl:'connectWallet',loginParams: {...query}}})
  //   return
  // }
  if (auth) {
    if (hasAccountFlag && authFlag) {
      next()
      return
    } else {
      next({
        name: 'withpassword',
        query
      })
      return
    }
  } else {
    if (!hasAccountFlag && name == 'withpassword') {
      next({
        name: "guidance"
      })
      return
    }
    // Having an account is not a login page without a login password
    if (hasAccountFlag && name !== 'withpassword' && !authFlag && name != 'sign') {
      next({ name: 'withpassword', query })
      return
    } else {
      if (name == 'sign' || name == 'minersPledge' || name === 'minersDeal' || name == 'send' || name == 'receive-award-home') {
        next()
        return
      }

      const arr = ['withpassword', 'guidance']
      // There's a login password. There's an account
      // @ts-ignore
      if (hasAccountFlag && authFlag && arr.includes(name?.toString()) && name != 'wallet') {
        next({ name: 'wallet' })
        return
      } else {
        next()
        return
      }
    }
    next()
  }
})



export default router
