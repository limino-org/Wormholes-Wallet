<template>
  <div class="bourse">
       <NavHeader :title="`${toName ? t('restWallet.restWallet') : t('setting.safety')}`">
      <template v-slot:left>
        <span class="back" @click="appProvide.back">{{t('common.back')}}</span>
      </template>
    </NavHeader>
  <div class="input-header">
    <WormTransition size="small">
      <template v-slot:icon>
        <img class="wormicon" src="@/assets/token/logowallet.png" alt="" >
      </template>
    </WormTransition>
    <div class="c1">{{t('loginwithpassword.confirmPwd')}}</div>
    <div class="c2">{{t('loginwithpassword.enterPwd')}}</div>
  </div>
      <div class="create-new-password">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <div class="text-bold f-12 mt-10 mb-10 lh-16 flex between">
            <span>{{ t("createAccountpage.password") }}</span>
            <span>
              <i
                @click="toggleMask"
                :class="`iconfont hover ${
                  switchPassType ? 'icon-yanjing' : 'icon-yanjing1'
                }`"
              ></i>
            </span>
          </div>
          <div calss="error-field">
            <van-field
              v-model="password"
              name="password"
              :class="isError ? 'error' : ''"
              :type="`${switchPassType ? 'text' : 'password'}`"
              @click-right-icon="switchPassType = !switchPassType"
              :placeholder=" isError ? t('loginwithpassword.wrong_password') :  $t('exportprivatekey.password')"
              :rules="[{ validator: asyncPwd },]"
            />
          </div>
        </van-cell-group>
        <div class="btn-groups">
          <div class="container pl-28 pr-28">
                      <van-button
            :loading="accountLoading"
            round
            block
            type="primary"
            native-type="submit"
          >{{t('wallet.next')}}</van-button>
        </div>
          </div>

      </van-form>
    </div>
    <SwitchNetwork
      v-model:show="showModalNetwork"
      @close="showModalNetwork = false"
    />
  </div>
  
</template>

<script lang="ts">
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { CreateWalletByJsonParams, CreateWalletByMnemonicParams,createWalletByJson } from '@/utils/ether'
import { setCookies, getCookies } from '@/utils/jsCookie'
import { ref, Ref, computed, toRaw, SetupContext, onMounted, inject } from 'vue'
import { Icon, NavBar, Form, Field, CellGroup, Button, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useI18n } from 'vue-i18n'
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import NavHeader from '@/components/navHeader/index.vue'
import { useToast } from '@/plugins/toast';
import WormTransition from '@/components/wromTransition/index.vue'
export default {
  components: {
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    SwitchNetwork,
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    WormTransition,
    NavHeader
  },
  setup() {
    const{t}=useI18n()
    const switchPassType = ref(false)
    const router = useRouter()
    const store = useStore()
    const route: any = useRoute()
    const { dispatch, commit, state } = store
    const { $toast } = useToast()
    const onClickLeft = () => history.back()
    const appProvide = inject('appProvide')
    const empty = () => {
      password.value = ''
    }
     const toggleMask = () => {
      switchPassType.value ? (switchPassType.value = false) : (switchPassType.value = true)
    }
    const isError = ref(false)
    const password: Ref<string> = ref('')
    const accountLoading: Ref<boolean> = ref(false)

    const asyncPwd = async(val: string) => {
      isError.value = false
      if(!val){
        isError.value = true
        return t('exportprivatekey.inputpassword')
      }
      const accountInfo = store.state.account.accountInfo
      const { keyStore } = accountInfo
      const data: CreateWalletByJsonParams = {
        password: password.value,
        json: keyStore
      }
      try {
         await createWalletByJson(data)
         return true
      }catch(err){
        isError.value = true
        return t('wallet.wrongpassword')
      }
    }
    const onSubmit = async (value: object) => {
      accountLoading.value = true
      const accountInfo = store.state.account.accountInfo
      const { keyStore } = accountInfo
      const data: CreateWalletByJsonParams = {
        password: password.value,
        json: keyStore
      }
      try {
        await createWalletByJson(data)
        isError.value = false
        router.replace({ name: route.query.toName ? route.query.toName :'successpage',query:{clearCache: 'true'} })
      }catch(err){
        isError.value = true
        $toast.warn(err)
      } finally {
        password.value = ''
        accountLoading.value = false
      }
    }

    
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();
     const networkTypeValue = computed(() => store.state.account.networkType);
    const goHome = () => {
      router.back()
    }
    return {
      t,
      goHome,
      password,
      networkTypeValue,
      accountLoading,
      toggleMask,
      switchPassType,
      empty,
      onSubmit,
      onClickLeft,
      netWorkList,
      currentNetwork,
      asyncPwd,
      isError,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
      appProvide,
      toName: route.query.toName
      // asynpwd,
    }
  }
}
</script>

<style lang="scss" scoped>
.error {
  :deep(.van-field__body) {
    border: 1px solid #d73a49 !important;
    background: #fbf2f3;
  }
}

.content {
  .title {
    margin: 17px 22px;
    font-size: 12px;
  }
  .userwarning {
    height: 70px;
    background-color: #fbf2f3;
    padding: 0 15px 0 0;
    line-height: 12px;
    font-size: 12px;
    display: flex;
    // justify-content: space-evenly;
    align-items: center;

    .warning-icon {
      margin-left: 22px;
    }
    .user-title {
      margin-left: 9px;
    }
  }

  .form-button {
    display: flex;
    margin: 50px 16px;
    button:nth-of-type(1){
      margin-right: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.error-field {
  background-color: #000 !important;
}
:deep(.error-field) {
  background-color: #000 !important;
}
.create-new-password {
  .rember_me{
      // background-color:red;
      width:100%;
      height:50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .rember_me_left{
        margin-left: 20px;
        color:#000;
        font-size:14px;
      }
      .rember_me_right{
        margin-right:10px;
      }
  }
  
  .tit-small {
    color: #bbc0c5;
  }
  .right {
    color: #037cd6;
    text-decoration: underline;
  }

  .icon-yanjing {
    color: #037dd6;
  }
  :deep(.van-field__label) {
    display: none;
  }
  :deep(.van-field__error-message) {
    margin-bottom: 12px;
  }
  :deep(.van-cell:after) {
    display: none;
  }
  :deep(.van-cell) {
    padding: 0;
  }
  :deep(.van-field__body) {
    margin-bottom: 10px;
    &:hover {
      border: 1px solid #1989fa;
    }
  }
}
.input-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  img {
    width: 19px;

  }
  .c1 {
    font-size: 24px;
    margin-bottom: 15px;
    margin-top: 10px;
    line-height: 30px;
    font-weight: 600;
  }
  .c2 {
    font-size: 12px;
    line-height: 15px;
    color: #848484;
  }
}

</style>
<style  lang="scss" scoped>
.bourse {
  height: 100%;
  .bourse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 16px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 2px rgb(135 134 134 / 10%);
  }

  .bourse-container {
    padding: 23px 15px 25px 15px;
    font-size: 14px;
    .bourse-container-w {
      height: 160px;
      border: 1px solid #E4E7E8;
      padding: 0 17.5px;
      .da {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:first-child {
          border-bottom: 1px solid #E4E7E8;
        }
      }
    }
    .da-c {
      display: flex;
      align-items: center;
      span {
        margin: 0 35.5px 0 10px;
      }
    }
    .da-img {
      width: 20px;
      height: 20px;
      margin-top: -4px;
    }
    .right {
      padding-left: 15px;
      border-left: 1px solid #E4E7E8;
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
  .bourse-container-meaning {
    margin-top: 15px;
    padding-top: 15px;
  }
  .bourse-container-pull {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .hundred {
      color: #3aae55;
      font-size: 18px;
      line-height: 30px;
    }
  }
  .bourse-container-slider {
    margin: 33.5px 0;
  }
  .bourse-container-server {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    div {
      width: 310px;
      height: 85px;
      display: flex;
      margin-left:15px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #f4faff;
      border-radius: 7.5px;
      box-sizing: border-box;
    }
    .active {
      border: 1px solid #037cd6;
      span {
        color: #037cd6;
      }
    }
    .t1 {
      font-size: 12px;
      color: #848484;
      line-height: 20px;
    }
    .t2 {
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
    }
  }
  .bourse-container-server-b {
    div {
      background-color: #f1f3f4 !important;
    }
    .active-d {
      border: 1px solid #000;
    }
  }
  .bourse-container-btns {
    width: calc(100% - 30px);
    position: absolute;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .b1 {
      width: 160px;
    }
  }
  .bourse-container-error {
    margin: 0 15px 25px 15px;
    height: 56.5px;
    background: #F4FAFF;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    span {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .t1 {
    font-size: 14px;
    color: #037cd6;
  }
  .t3 {
    font-size: 18px;
    font-weight: bold;
    line-height: 40px;
  }
  .t2 {
    font-size: 16px;
  }

  .right-img {
    width: 18px;
    height: 18px;
    margin-top: -2px;
  }
  .create-new-password {
    margin-top: 13.5px;
    .tit-small {
      color: #848484;
    }
    .right {
      color: #037cd6;
      text-decoration: underline;
    }
    .icon-yanjing {
      color: #037dd6;
    }
    :deep(.van-field__label) {
      display: none;
    }
    :deep(.van-field__error-message) {
      margin-bottom: 0px;
    }
    :deep(.van-cell:after) {
      display: none;
    }
    :deep(.van-cell) {
      padding: 0;
    }
    :deep(.van-field__body) {
      margin-bottom: 10px;
      &:hover {
        border: 1px solid #1989fa;
      }
    }
    .error-field {
      :deep(.van-field__body) {
      border: 1px solid #D73A49 !important;
      }
    }
    .success-field {
      :deep(.van-field__body) {
      border: 1px solid #1989fa !important;
      }
    }
    .tool {
      color: #037cd6;
    }
    .pointer {
      cursor: pointer;
    }
    .check-box {
      margin-top: 30px;
    }
  }
}
.bt {
  border-top: 1px solid #e4e7e8;
}
.bourse-img {
  height: 135px;
  background-color: #F4FAFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .exchange-welcome-icon {
    height: 35px;
    width: 35px;
  }
  .d1 {
    margin: 10px 0;
    font-size: 15px;
  }
  .d2 {
    font-size: 12px;
    color: #848484;
  }
}

.error-field {
  :deep(.van-field__body) {
  border: 1px solid #D73A49 !important;
  }
}

.bourse-container-error,
.bourse-container-warning {
  height: 72px;
  background: #fbf2f3;
  border-radius: 7.5px;
  margin-top: 15px !important;
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 36.5px;
  span {
    margin-left: 10px;
    font-size: 12px;
  }
}
.btns-footer {
  position: fixed;
  bottom: 25px;
  width: 100%;
  max-width: 750px;
}
.right-img-copy {
  width: 15px;
  height: 15px;
}


</style>