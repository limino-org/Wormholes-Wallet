<template>
  <van-sticky>
    <NavHeader :hasRight="false">
      <template v-slot:left>
       <span class="back hover f-12" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
      <template v-slot:title>
        <div class="flex center title">{{t("createAccountpage.mnemonicBtn")}}</div>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="mnemonic-page">
    <div class="title-w">
      <!-- <img class="iconele flex center" src="@/assets/token/logowallet.png" /> -->
      <WormTransition size="small" >
        <template v-slot:icon>
          <img class="iconele flex center" src="@/assets/token/logowallet.png" />
        </template>
      </WormTransition>

      
    <div class="tit-big f-24  text-center mt-10">{{ t("createAccountpage.mneTit") }}</div>
    <div class="tit-small text-center f-12 mt-16 lh-16">{{ t("createAccountpage.iptMne") }}</div>
    </div>

    <div class="flex between con f-12 center-v mb-12">
      <span>{{ t("createAccountpage.recoMne") }}</span>
      <span>
        <i :class="`iconfont hover ${mask ? 'icon-yanjing1' : 'icon-yanjing'} `" @click="handleMask"></i>
      </span>
    </div>
    <div class="phrase-box mt-12 van-hairline--surround flex">
      <div :class="`ipt flex center-v right ${item.validator ? 'err' : ''}`" v-for="(item, idx) in list" :key="idx">
        <div class="idx text-center f-12" v-if="!item.validator">{{ idx + 1 }}</div>
        <div class="idx text-center f-12" @click="clear(idx)" v-else><van-icon name="cross" /></div>
        <input :type="`${mask ? 'password' : 'text'}`" @blur="handleBlur(item.value,idx)" @focus="handleFocus(idx)" @input="search" v-model="item.value" />
      </div>
    </div>
    <div class="warning f-12" v-show="!searchList.length && isSearch">{{ t("createAccountpage.mneWarn") }}</div>
    <div class="phrase-search-list flex">
      <div v-for="item in searchList" :key="item" class="card hover" @click="handleSelect(item)">{{ item }}</div>
    </div>


    <div class="btn-box">
      <div class="container">
        <van-button  type="primary" block @click="next">{{t('createAccountpage.next')}}</van-button>
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import Vue, { nextTick } from 'vue'
import { useStore } from 'vuex'
import { Icon, Toast, Button, Sticky, Field, Form, CellGroup, Switch, Checkbox, CheckboxGroup, } from 'vant'
import { ref, Ref, computed, toRaw, SetupContext, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WormTransition from '@/components/wromTransition/index.vue'
import NavHeader from '@/components/navHeader/index.vue'
import {ethers} from 'ethers'
// Loading the dictionary
const mneList = require('@/assets/json/mnemonic.json')
import { useI18n } from 'vue-i18n'
import Privacypolicy from '@/components/privacypolicy/index.vue'
import { useToast } from '@/plugins/toast'
export default {
  name: 'loginAccount-export-mnemonic',
  components: {
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Switch.name]: Switch,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    WormTransition,
    Privacypolicy,
    NavHeader
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const { commit, dispatch } = store
    const mask = ref(true)
    const handleMask = () => {
      mask.value ? (mask.value = false) : (mask.value = true)
    }
    const list = ref([
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false },
      { value: '', validator: false }
    ])

    // Fuzzy query data
    const searchList = ref([])
    // The input component subscript of the current query
    const iptIdx = ref(0)
    const handleBlur = (val:string,idx:number) => {
      const mne = mneList.find((item: any) => item == val.trim())
      if(!mne) {
        list.value[idx].validator = true
      } else {
        list.value[idx].validator = false

      }
      isSearch.value = false
    }
    // Whether the query is in the state
    const isSearch = ref(false)
    const search = (e: any) => {
      if(e.target.value) {
        const newlist = e.target.value.split(' ')
        if(newlist.length == 12) {
          newlist.forEach((item: string,idx: number) => {
            list.value[idx].value = item
            handleBlur(item,idx)
          })
          return
        }
      }
      if (e.target.value) {
        isSearch.value = true
        searchList.value = mneList.filter((item: any) => item.startsWith(e.target.value))
      } else {
        isSearch.value = false
        searchList.value = []
      }
    }
    const handleFocus = (i: number) => {
      iptIdx.value = i
      search({ target: { value: list.value[i].value } })
    }

    const handleSelect = (str: string) => {
      list.value[iptIdx.value].value = str
      searchList.value = []
      handleBlur(str,iptIdx.value)
    }

    const {$wtoast} = useToast()

    const next = () => {
      const mnemonic = list.value.map(item => item.value.trim()).join(' ')
      const check = list.value.find(item => item.validator)
      const len = list.value.filter(item => item.value.trim()).length
      if (check || !mnemonic || len != 12) {
        Toast(t('createAccountpage.memErr'))
        return
      }
      try {
        ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0")
        console.warn('to mnemonic', mnemonic)
        router.push({ name: "mnemonic-import", state: { params: {mnemonic} } })
      }catch(err){
        console.error(err.toString())
        $wtoast.warn(t('importByMnemonic.errorMonic'))
      }
    }

    const clear = (idx: number) => {
      list.value[idx].value = '';
      list.value[idx].validator = false;
    }
    const back = () => router.back()
    return {
      t,
      back,
      mask,
      handleMask,
      list,
      search,
      searchList,
      isSearch,
      iptIdx,
      handleFocus,
      handleSelect,
      handleBlur,
      next,

      clear
    }
  }
}
</script>
<style lang="scss" scoped>
  .title-w {
    .tit-big {
      font-weight: bold;
    }
  }
  .iconele {
    width: 20px;
  }
.icon-yanjing1 {
  color: #9F54BA;
}
.logo {
  width: 20px !important;
}
.mnemonic-page {
  padding-bottom: 100px;
}
.title {
  font-weight: 600;
  font-size: 16px;
}
.tit-small {
  line-height: 15px;
  color: #848484;
  margin-bottom: 42px;
}
.con {
  padding: 0 27.5px;
}
.phrase-box {
  padding: 15px 15px 5px;
  width: 320px;
  margin: 0 auto;
  flex-wrap: wrap;
  &::after {
    border-radius: 8px;
  }
  .ipt {
    width: 89px;
    height: 25px;
    background: #F8F3F9;
    border-radius: 25px;
    border: 1PX solid #9F54BA;
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
    transition: ease .3s;
    &.err {
        border: 1PX solid #d73a49;
        .idx {
          background: #d73a49;
        }
        input {
          color: #d73a49;
        }
      }
    &:nth-of-type(3n + 0) {
      margin-right: 0;
    }
    .idx {
      width: 24px;
      line-height: 24px;
      height: 24px;
      background: #9F54BA;
      border-radius: 12px;
      position: absolute;
      left: -0.5px;
      color: #fff;
      top: -0.5px;
      bottom: 0;

    }
    input {
      width: 65px;
      border: none;
      text-align: center;
      color: #9F54BA;
      border-radius: 25px;
      font-size: 12px;
      margin-right: 2px;
    }
  }
}
.phrase-search-list {
  margin-top: 15px;
  padding: 27.5px;
  flex-wrap: wrap;
  .card {
    line-height: 25px;
    background: #F8F3F9;
    border-radius: 12.5px;
    padding: 0 13px;
    margin-right: 10px;
    margin-bottom: 10px;
    color: #9F54BA;
  }
}
.warning {
  color: #d73a49;
  padding: 0 27.5px;
  line-height: 14px;
  margin-top: 12px;
}
.link {
  color: #9F54BA;
}
:deep() {
  .van-checkbox__icon {
    font-size: 14px;
  }
}
.btn-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  .container {
    padding: 0 27.5px;
  }
}
</style>