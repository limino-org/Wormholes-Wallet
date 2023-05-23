<template>
  <div class="bourse">
    <NavHeader :title="t('createExchange.headerTitle')">
      <template v-slot:left>
        <span class="back" @click="back">{{t('common.back')}}</span>
      </template>
    </NavHeader>
    <div class="bourse-img">
      <img
        class="exchange-welcome-icon"
        src="@/assets/exchange/SketchPng6487f59e1a3e4adec886c6b63f8c41c4aa0d61ebfe43fcaad735b3ff5ca97e8d.png"
      />
      <div class="d1">{{t('bourse.congraTit')}}</div>
      <div class="d2">{{t('bourse.openSuccess')}}</div>
    </div>
    <div class="bourse-container">
      <div class="bourse-container-w">
        <div class="da hover"  @click="toGoCMS">
          <div class="da-c">
            <i class="iconfont icon-jiaoyisuo label-icon"></i>
            <span>{{t('bourse.wormExchange')}}</span>
            <i class="iconfont icon-youjiantou1"></i>
          </div>
          <div>
            <div class="right" @click.stop="toCopyCMS">
              <i class="iconfont icon-fuzhi1"></i>
            </div>
          </div>
        </div>
        <div class="da hover" @click="toGoAmount">
          <div class="da-c" >
            <i class="iconfont icon-code label-icon"></i>
            <span>{{t('bourse.wormConsole')}}</span>
            <i class="iconfont icon-youjiantou1"></i>
          </div>
          <div>
            <div class="right" @click.stop="toCopyAmount">
              <i class="iconfont icon-fuzhi1"></i>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="btns-footer">
      <div class="bourse-container-error">
        <van-icon name="warning" color="#9F54BA" />
        <span>{{t('bourse.tip11')}}</span>
      </div>
      <div class="pl-28 pr-28">
        <van-button plain block @click="toSet" type="primary"
        >{{t('bourse.exchangeSetting')}}</van-button
      >
      </div>
    </div>
    <SwitchNetwork
      v-model:show="showModalNetwork"
      @close="showModalNetwork = false"
    />

    <div v-if="showModal" class="custom-popover" @click="showModal = false">
      <div class="custom-popover-header">
        <div class="footer-text1">
          <div>
            {{t('bourse.visiteType')}}
          </div>
        </div>
      </div>
      <div class="custom-popover-container">
        <!-- <img src="@/assets/exchange/exchangebg1.png" alt=""> -->
        <div class="c-row"></div>
        <div class="box"></div>
                <div class="c-row"></div>
      </div>
      <div class="custom-popover-footer">
        <div class="footer-text">
          <div>
            {{t('bourse.copyLink')}} <br /> {{t('bourse.whoWillVisite')}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import dialogWarning from "@/components/dialogWarning/message.vue";
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  toRaw,
  onMounted,
  ComputedRef,
  nextTick,
  onBeforeMount,
  inject
} from "vue";
import useClipboard from 'vue-clipboard3'
import { useRouter, useRoute } from "vue-router";
import { useStore, mapState } from "vuex";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import {
  Dialog,
  Form,
  Field,
  CellGroup,
  Button,
  Popup,
  Circle,
  Icon,
  Toast,
  Slider,
  Checkbox,
} from "vant";
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { useToast } from '@/plugins/toast';
import NavHeader from '@/components/navHeader/index.vue'
import { VUE_APP_EXCHANGESMANAGEMENT_URL, VUE_APP_EXCHANGES_URL } from '@/enum/env';
export default defineComponent({
  components: {
    SwitchNetwork,
    [Icon.name]: Icon,
    [Button.name]: Button,
    NavHeader
  },
  setup(props: any, context: SetupContext) {
    const router = useRouter();
    const appProvide = inject('appProvide')
    //  const isWarning = ref(false);
    const {$wtoast} = useToast()
    const store = useStore();
    const { dispatch, commit } = store
    const networkTypeValue = computed(() => store.state.account.networkType);
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();
    console.warn('VUE_APP_EXCHANGES_URL', VUE_APP_EXCHANGES_URL)
    console.warn('VUE_APP_EXCHANGESMANAGEMENT_URL', VUE_APP_EXCHANGESMANAGEMENT_URL)
    const goHome = () => {
      router.push({
        path: '/wallet'
      });
    }
    const back = () => {
      router.replace({name:'wallet'})
    }
    const { t } = useI18n();
    const { toClipboard } = useClipboard()
    const exchangeUrl = computed(() => {
      const add = store.state.account.accountInfo.address
      return `${VUE_APP_EXCHANGES_URL}/c${add.toLowerCase()}/#/`
    })
    const adminUrl = computed(() => {
      const add = store.state.account.accountInfo.address
      return `${VUE_APP_EXCHANGESMANAGEMENT_URL}?address=${add.toLowerCase()}&exchangeAddress=${add.toLowerCase()}`
    })
    const toGoCMS = () => {
      window.open(`${exchangeUrl.value}`)
    }
    nextTick(() => {
      if (!store.state.account.exchangeGuidance) {
        showModal.value = true
        commit("account/UPDATE_EXCHANGEGUIDANCE", true)
      }
    })
    const showModal = ref(false)
    const toCopyCMS = async () => {
      try {
        await toClipboard(`${exchangeUrl.value}`)
        $wtoast.success(t('copy.copy'))
      } catch (e) {
        console.error(e)
      }
    }
    const toGoAmount = () => {
      window.open(`${adminUrl.value}`)
    }
    const toCopyAmount = async () => {
      try {
        await toClipboard(`${adminUrl.value}`)
        $wtoast.success(t('copy.copy'))
      } catch (e) {
        console.error(e)
      }
    }
    const toSet = () => {
      router.push({name:"bourse"})
    }
    return {
      toCopyAmount,
      toCopyCMS,
      toGoAmount,
      showModal,
      toGoCMS,
      goHome,
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
      networkTypeValue,
      appProvide,
      toSet,
      back,
      t
    }
  }
})
</script>

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
      border-radius: 4px;
      .label-icon {
        color: #000000;
      }
      .da {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:first-child {
          border-bottom: 1px solid #E4E7E8;
        }
        &:hover {
          .da-c {
            color:#9F54BA;
            i {
            color:#9F54BA;
            }
          }
        }
      }
    }
    .da-c {
      display: flex;
      align-items: center;
      span {
        width: 170px;
        padding: 0 20px 0 8px;
      }
      i {
        font-size: 20px;
        color: #9F54BA;
      }
    }
    .da-img {
      width: 20px;
      height: 20px;
      margin-top: -4px;
    }
    .right {
      padding-left: 15px;
      // border-left: 1px solid #E4E7E8;
      position: relative;
      &:after {
        content: "";
        width: 1px;
        background: #E4E7E8;
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
      }
      i {
        font-size: 16px;
        color: #9a9a9a;
      }
      &:hover {
        i {
        color: #9F54BA;       
        
        }
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
      background: #F8F3F9;
      border-radius: 7.5px;
      box-sizing: border-box;
    }
    .active {
      border: 1px solid #9F54BA;
      span {
        color: #9F54BA;
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
    background: #F8F3F9;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    span {
      margin-left: 10px;
      font-size: 12px;
    }
    i {
      font-size: 18px;
    }
  }
  .t1 {
    font-size: 14px;
    color: #9F54BA;
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
      color: #9F54BA;
      text-decoration: underline;
    }
    .icon-yanjing {
      color: #9F54BA;
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
      padding: 0 10px;
      transition: ease 0.3s;
      font-size: 12px;
      &:hover {
        border: 1px solid #9F54BA;
      }
    }
    .error-field {
      :deep(.van-field__body) {
      border: 1px solid #D73A49 !important;
      }
    }
    .success-field {
      :deep(.van-field__body) {
      border: 1px solid #9F54BA !important;
      }
    }
    .tool {
      color: #9F54BA;
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
  background-color: #F8F3F9;
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
.bourse-container-error,
.bourse-container-warning {
  margin-top: 160px;
  height: 40px;
  background: #fbf2f3;
  border-radius: 7.5px;
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
</style>

<style lang="scss" scoped>
.custom-popover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    z-index: 10;
  }
  .custom-popover-header {
    height: 202px;
background-color: rgba(0, 0, 0, .7);
     .footer-text1 {
        position: absolute;
        font-size: 12px;
        color: #fff;
        top: 130px;
        left: 15px;
        div {
          &:before {
            content: "";
            position: absolute;
            top: 54px;
            left: 85px;
            width: 74px;
            display: inline-block;
            z-index: 999999;
            transform: rotate(90deg);
            border-top: 1px dotted #9F54BA;
          }
          &:after {
          content: "";
          position: absolute;
          top: 14px;
          left: 120.5px;
          width: 4px;
          height: 4px;
          background-color: #9F54BA;
          border-radius: 50%;
          display: inline-block;
          z-index: 999999;
        }
        }
      }
  }
  .custom-popover-container {
    padding-left: 15px;
    padding-right: 15px;
    img {
      width: 100%;
    }
    height: 170px;
    & .c-row {
      width: 15px;
                  background-color: rgba(0, 0, 0, .7);

    }
    & .box {
      width: 100%;
      height: 160px;
          position: relative;
      border-radius: 4px;
      overflow: hidden;
          &::after {
      content: '';
      display: block;
      width: 25px;
      height: 130px;
      border: 1px dotted #9F54BA;
      border-radius: 5px;
      position: absolute;
      right: 13px;
      top: 18px;
    }
              &::before {
      content: '';
      display: block;
      width:230px;
      height: 130px;
      border: 1px dotted #9F54BA;
      border-radius: 5px;
      position: absolute;
      left: 10px;
      top: 20px;
    }
    }

  }
  .custom-popover-footer {
    position: relative;
    height: calc(100% - 372px);
    z-index: 11;
    background-color: rgba(0, 0, 0, .7);

  }
  .footer-btns {
    position: absolute;
    bottom: 30px;
    left: 50%;
    width: 100%;
    div {
      display: inline-block;
      transform: translateX(-50%);
      span {
      display: inline-block;
      width: 100px;
      height: 45px;
      font-size: 12px;
      border-radius: 50px;
      text-align: center;
      line-height: 45px;
      color: #fff;
      box-sizing: border-box;
      &:first-child {
        border: 1px solid #fff;
        margin-right: 40px;
      }
      &:last-child {
        background-color: #9F54BA;
      }
    }
    }
  }
  .footer-text {
    position: absolute;
    font-size: 12px;
    color: #fff;
    top: 63px;
    right: 15px;
    div {
      &:before {
        content: "";
        position: absolute;
        top: -44px;
        left: 85px;
        width: 76px;
        display: inline-block;
        z-index: 999999;
        transform: rotate(90deg);
        border-top: 1px dotted #9F54BA;
      }
      &:after {
      content: "";
      position: absolute;
      top: -8px;
      left: 121.5px;
      width: 4px;
      height: 4px;
      background-color: #9F54BA;
      border-radius: 50%;
      display: inline-block;
      z-index: 999999;
    }
    }
  }
.dialog-box {
  // max-width: 340px;
  padding-bottom: 25px;
  position: relative;
  .serial-number {
    display: flex;
    justify-content: flex-end;
    text-indent: 10px;
    padding-bottom: 14px;
    padding-right: 14px;
    font-size: 12px;
    .left {
      color: #9F54BA;
    }
  }
  .tip2 {
    position: absolute;
    bottom: -100px;
    color: #fff;
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
  }
  .small-tit {
    text-align: center;
    margin-bottom: 50px;
    font-size: 12px;
    color: #848484;
  }
  :deep {
    button {
      min-width: 100px;
    }
  }
  :deep(.van-popover__wrapper) {
    height: 0;
  }
}
</style>