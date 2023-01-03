<template>
  <div v-if="show" class="dialog-warning-dark">
    <div v-if="show" class="dialog-warning">
      <div class="dialog-warning-header">{{t('minerspledge.stacking')}}</div>
      <div
        style="
          color: #8f8f8f;
          padding-left: 15px;
          margin-top: 20px;
          margin-bottom: 20px;
        "
      >
        {{t('minerspledge.select')}}
      </div>
      <van-cell-group :border="false">
        <van-cell title="S-NFT" @click="select = 0" class="hover">
          <template #icon>
            <img
              src="@/assets/token/yuan-active.png"
              v-if="select === 0"
              alt=""
              class="no_checkbox"
            />
            <img
              src="@/assets/token/yuan.png"
              v-else
              alt=""
              class="no_checkbox"
            />
          </template>
          <template #right-icon>
            <van-icon name="success" color="#28A745" v-if="select === 0" />
          </template>
        </van-cell>
        <van-cell title="ERB" @click="select = 1" class="hover">
          <template #icon>
            <img
              src="@/assets/token/yuan-active.png"
              v-if="select === 1"
              alt=""
              class="no_checkbox"
            />
            <img
              src="@/assets/token/yuan.png"
              v-else
              alt=""
              class="no_checkbox"
            />
          </template>
          <template #right-icon>
            <van-icon name="success" color="#28A745" v-if="select === 1" />
          </template>
        </van-cell>
      </van-cell-group>
      <div class="warning-text" v-if="select === 1">
        <span
          >{{t('minerspledge.selectErb')}}</span
        >
      </div>

      <div class="warning-text" v-if="select === 0">
        <span
          >{{t('minerspledge.selectSnft')}}</span
        >
      </div>
      <div class="footer-btns">
        <van-button
          @click="show = false"
          style="width: 100px"
          class="btn"
          round
          plain
          >{{t('common.cancel')}}</van-button
        >
        <van-button
          :loading="isLoading"
          style="width: 100px"
          type="primary"
          class="btn"
          round
          @click="http"
          >{{t('common.confirm')}}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { emit } from "process";
import { Icon, Checkbox, Button, Toast, CellGroup, Cell } from "vant";
import {
  ref,
  nextTick,
  Ref,
  computed,
  toRaw,
  SetupContext,
  onMounted,
  watch,
} from "vue";
import { getWallet,clone ,TransactionTypes} from "@/store/modules/account";
import { useStore } from "vuex";
import { useI18n } from 'vue-i18n';
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";

export default {
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
  },
  props: {
    isWarning: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, context: SetupContext) {
    const {t} = useI18n()
    let Time = ref(3);
    nextTick(() => {
      let setIntervalValue = setInterval(() => {
        Time.value -= 1;
        if (Time.value === 0) {
          clearInterval(setIntervalValue);
        }
      }, 1000);
    });
    const {$tradeConfirm} = useTradeConfirm()
    const select = ref(0);
    const { emit }: any = context;
    const show = computed({
      get() {
        return props.isWarning;
      },
      set(v: boolean) {
        emit("update:isWarning", v);
      },
    });
    const store = useStore();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const emitWarningSuccess = () => {
      show.value = false;
      emit("warningSuccess");
    };
    const toHex = (str: string) => {
      if (str === "") return "";
      var hexCharCode = [];
      for (var i = 0; i < str.length; i++) {
        hexCharCode.push(str.charCodeAt(i).toString(16));
      }
      return hexCharCode.join("");
    };
    const isLoading = ref(false);
    const http = async () => {
      try {
        isLoading.value = true;
        const str = `wormholes:{"version": "0.0.1", "type": 25, "reward_flag": ${select.value}}`;
        const data3 = toHex(str);
        console.log(data3);
        console.log(str);
        const tx1 = {
          from: accountInfo.value.address,
          to: accountInfo.value.address,
          data: `0x${data3}`,
        };
        console.log(tx1);

        const receipt: any = await store.dispatch('account/transaction', tx1)
        const res = await receipt.wallet.provider.waitForTransaction(receipt.hash, null, 60000)
        store.dispatch("account/waitTxQueueResponse");
        console.log(receipt);
        console.log("receiptreceiptreceiptreceiptreceipt");
        isLoading.value = false;
        emitWarningSuccess();
      } catch (err: any) {
        console.log(err);
        if(err.toString().indexOf('timeout') > -1) {
        $tradeConfirm.update({status:"warn",failMessage: t('error.timeout')})
      } else {
        $tradeConfirm.update({status:"fail",failMessage: err.reason})
      }
        isLoading.value = false;
      }
    };
    const text = props.text;

    watch(()=>show.value, async(n) => {
      if(n) {
        Toast.loading({duration:0})
           try {
             const wallet = await getWallet();
      const { address } = wallet;
      const ethAccountInfo = await wallet.provider.send("eth_getAccountInfo", [
        address,
        "latest",
      ]);
      debugger
      select.value = ethAccountInfo.RewardFlag;
           }finally{
            Toast.clear()
      }
      }
    },{
      immediate: true,
      deep: true
    })
    return {
      isLoading,
      http,
      select,
      show,
      text,
      emitWarningSuccess,
      Time,
      t
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-warning-dark {
  left: 0;
  right: 0;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);

}
.dialog-warning {
  z-index: 9999;
  width: 340px;
  height: 380px;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  max-width: 340px;
  font-size: 15px;
  border-radius: 8px;
  overflow: hidden;
}
.dialog-warning-header {
  height: 62px;
  line-height: 62px;
  text-align: center;
  font-size: 15px;
  background: #f8fcff;
  color: #000;
  font-weight: bold;
}
.warning-icon {
  padding: 25px;
  padding-top: 25px;
  text-align: center;
}
.warning-text {
  text-align: center;
  padding: 0 15px;
  margin-top: 30px;
  font-size: 12px;
  color: #037cd6;
}
.footer-btns {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  margin-top: 30px;
  div {
    padding: 25px;
    text-align: center;
    span {
      display: inline-block;
      width: 100px;
      height: 45px;
      font-size: 12px;
      border-radius: 50px;
      text-align: center;
      line-height: 45px;
      box-sizing: border-box;
      &:first-child {
        color: #000;
        margin-right: 40px;
        border: 1px solid #000;
      }
      &:last-child {
        background-color: #d73a49;
      }
    }
  }
}
.no_checkbox {
  margin-top: 2px;
  margin-right: 15px;
  width: 18px;
  height: 18px;
  display: inline-block;
}
</style>