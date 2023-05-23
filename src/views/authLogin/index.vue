<template>
  <div>
    <van-sticky>
      <NavHeader :hasRight="false" title="Login" :hasLeft="false">
      </NavHeader>
    </van-sticky>
    <div class="content page-container">
      <div class="notice">{{t('loginwithpassword.welcome')}}</div>
      <div class="create-new-password">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="password"
              type="password"
              name="pwd"
              :label="$t('loginwithpassword.input')"
              :placeholder="$t('loginwithpassword.pleaseinput')"
              :rules="[{ required: true, message: t('loginwithpassword.pleaseinput') }]"
            />
          </van-cell-group>
              <van-sticky position="bottom" offset-bottom="30px">

          <div  class="flex center btn-groups">
            <van-button :loading="accountLoading" round block type="primary" native-type="submit">Login</van-button>
          </div>
              </van-sticky>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { NavBar, Form, Field, CellGroup, Button, Sticky, Icon, Toast } from 'vant'
import { Ref, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import NavHeader from '@/components/navHeader/index.vue'
import { CreateWalletByJsonParams, CreateWalletByMnemonicParams } from '@/utils/ether'
import { passwordExpires } from '@/enum/password'
import { useI18n } from 'vue-i18n'
import { getWallet } from '@/store/modules/account'

export default {
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    NavHeader
  },
  setup() {
    const {t}=useI18n()
    const router = useRouter()
    const store = useStore()
    const route = useRoute()
    const { dispatch, commit, state } = store
    const onClickLeft = () => {
      router.go(-1)
    }
    const password: Ref<string> = ref('')
    const accountLoading: Ref<boolean> = ref(false)
    const onSubmit = async (value: object) => {
      accountLoading.value = true
      const accountInfo = store.state.account.accountInfo
      const { keyStore } = accountInfo
      const data: CreateWalletByJsonParams = {
        password: password.value,
        json: keyStore
      }
      try {
        await dispatch('account/createWalletByJson', data)
        const wallet = await getWallet()
        console.log('wallet.provider', wallet.provider)
        const { address } = wallet
        const blockNumber = await wallet.provider.getBlockNumber()
        const newdata = {
            address,
            blockNumber
        }
        console.log('newdata', newdata)
        window.parent.postMessage({type:'wallet-authLogin-callback', data: newdata }, '*')
        router.replace({name: 'wallet'})

      } finally {
        accountLoading.value = false
      }
    }

    return {
      t,
      password,
      router,
      onClickLeft,
      onSubmit,
      accountLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  padding-top: 50px;
  .btn-groups {
    margin: 30px 15px 0;
  }
  .eventname {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
  }
  .notice {
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }
}
.tit {
  font-size: 16px;
}
.back-icon {
  color: #9F54BA;
  font-size: 22px;
  margin-left: -6px;
}
</style>