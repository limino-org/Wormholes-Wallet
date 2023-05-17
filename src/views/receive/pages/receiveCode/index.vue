<template>
  <van-sticky>
    <NavHeader title="Close" :hasRight="false" :hasLeft="true" :backReplaceName="replaceBackUrl" cancelRouteName="wallet">
      <template v-slot:left>
       <span class="back hover f-12" @click="appProvide.back">{{t('createAccountpage.back')}}</span>
      </template>
      <template v-slot:title>
        <div class="flex center title">{{t('receive.receive')}}</div>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="text-center lh-16 f-12 tit mt-30">{{t('receive.transfer')}}</div>
  <div class="text-center lh-24 flex center" v-show="amount > 0">
    <span class="f-18">{{amount}} {{chooseToken.name}}</span>
  </div>
  <div class="flex center">
    <div class="code-box flex center mt-16">
      <qrcode-vue :value="code" class="code" :size="300" level="L" ref="coderef"></qrcode-vue>
    </div>
  </div>
  <div class="load-btn pl-8 pr-4 lh-30 hover f-12 van-ellipsis">{{ tokenContractAddress || address }}</div>

  <div class="flex between btn-group">
    <div class="btn-box">
      <div class="flex center">
        <div class="btn flex center" @click="toCopy">
          <i class="iconfont icon-fuzhi2"></i>
        </div>
      </div>
      <div class="text-center text text-bold mt-4">{{t('receive.copy')}}</div>
    </div>
    <div class="btn-box">
      <div class="flex center" @click="handleSetAmount">
        <div class="btn flex center">
          <i class="iconfont icon-meiyuan"></i>
        </div>
      </div>
      <div class="text-center text text-bold mt-4">{{t('receive.amount')}}</div>
    </div>
  </div>
  <!-- Set amount Popup -->
  <CustomExchangeModal v-model="setAmountModal" :defaultAmount="amount" :hasTransferToken="true" @handleConfirm="handleConfirm" />
</template>
<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import { setCookies, getCookies } from '@/utils/jsCookie'
import { ref, Ref, computed, toRaw, SetupContext, onMounted, onActivated, getCurrentInstance, ComponentInternalInstance,inject  } from 'vue'
import { Icon, NavBar, Form, Field, CellGroup, Button, Toast,Sticky } from 'vant'
import useClipboard from 'vue-clipboard3'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomExchangeModal from '@/components/customExchangeModal/index.vue'
import { useI18n } from 'vue-i18n'
import NavHeader from '@/components/navHeader/index.vue'

export default {
  name: 'receive-code',
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    CustomExchangeModal,
    QrcodeVue,
    NavHeader
  },
  setup() {
    const { query } = useRoute()
    const { state } = useStore()
    const { tokenContractAddress } = query
    const { address } = state.account.accountInfo
    const amount: Ref<any> = ref(null)
    const { t } = useI18n()
    const code = ref('')
    const { toClipboard } = useClipboard()
    const appProvide = inject('appProvide')
    // const { $wtoast } = useToast()
    const toCopy = async () => {
      try {
        await toClipboard(address)
        // $wtoast.success(t('copy.title'))
      } catch (e) {
        console.error(e)
      }
    }

    onActivated(() => {
      const { query } = useRoute()
      const { tokenContractAddress } = query
      const { address } = state.account.accountInfo
      code.value = JSON.stringify({ data: { address, tokenContractAddress, value: amount.value }, type: 'receive' })
    })
    // Set Amount Modal
    const setAmountModal = ref(false)
    const handleSetAmount = () => {
      setAmountModal.value = true
    }

    // Set Amount Acknowledge events
    const handleConfirm = (v: number) => {
      amount.value = v
      code.value = JSON.stringify({ data: { address, tokenContractAddress, value: amount.value }, type: 'receive' })
    }

    // Currently selected token
    const chooseToken = computed(() => {
      const token = state.transfer.chooseToken
      const name = state.account.currentNetwork.currencySymbol
      return token
        ? token
        : {
            name
          }
    })
    return {
      code,
      t,
      toCopy,
      chooseToken,
      address,
      tokenContractAddress,
      amount,
      handleSetAmount,
      setAmountModal,
      handleConfirm,
      appProvide
    }
  }
}
</script>
<style lang="scss" scoped>
.tit {
  line-height: 31px;
}
.meiyuan {
  color: #848484;
}
.code {
  width: 214px !important;
  height: 214px !important;
}
.code-box {
  width: 236px;
  height: 236px;
  border: 7px solid #000;
  padding: 1px;
}
.load-btn {
  width: 250px;
  background: #f1f3f4;
  box-sizing: border-box;
  border-radius: 30px;
  margin: 15px auto 0;
  color: #037cd6;
  i {
    font-size: 12px;
  }
  &:hover {
    background: #dcecf9;
  }
}
.btn-group {
  width: 180px;
  margin: 25px auto 20px;
}
.btn-box {
  .btn {
    width: 34px;
    height: 34px;
    box-sizing: border-box;
    border-radius: 17px;
    border: 1PX solid #037cd6;
    cursor: pointer;
    &:hover {
      background: #037cd6;
      i {
        color: #fff;
      }
    }
    i {
      font-size: 18px;
      color: #037cd6;
    }
  }
  .text {
    color: #037cd6;
    font-size: 12px;
  }
}
</style>