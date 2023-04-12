<template>
  <div
    :class="`collection-card ${active ? 'active' : ''}`"
    @click="viewDetail"
  >
  <div class="flex between">
    <div class="collection-card-left flex">
      <div class="token-icon flex center">
        <div
          :class="`token-icon-box flex center ${handleSendStatus(data)}`"
        >
          <i
            :class="`iconfont  ${
              txTypeToIcon(data)
            }`"
          ></i>
        </div>
      </div>
      <div class="token-info flex center">
        <div>
          <div class="name">
            {{ handleTxType(data) }}
            <span :class="`status ${transactionStatusClass(data)}`">
              {{ transactionStatus(data) }}
            </span>
          </div>
          <div class="amount">
            {{ formatTxDate(data) }}
          </div>
        </div>
      </div>
    </div>
    <div class="collection-card-right flex center">
      <div>
        <div class="van-ellipsis text-right val lh-18">
          {{transferAmountText(data)}} {{currentNetwork.currencySymbol}}
        </div>
      </div>
    </div>
  </div>
  <div class="speed-box" v-show="transactionStatusClass(data) === 'waitting'">
    <van-button type="primary" class="mr-10" plain @click.stop="handleSpeedSend">{{t('common.speedUp')}}</van-button>
    <van-button type="default" plain @click.stop="handleSpeedCancel">{{t('common.cancel')}}</van-button>
  </div>
  </div>
</template>

<script lang="ts">
// Collectible card
import {
  SetupContext,
  Ref,
  ref,
  reactive,
  defineComponent,
  computed,
  toRaw,
} from "vue";
import { Icon,Button } from "vant";
import {
  transactionTarget,
  formatDate,
  addressMask,
  toUsdSymbol,
  transactionStatus,
  transactiontxType,
  transferAmountText,
  handleSendStatus,
  txTypeToIcon,
  handleTxType,
  transactionStatusClass,
  formatTxDate
} from "@/utils/filters";
import { useStore } from "vuex";
import { AccountInfo } from "@/store/modules/account";
import { useI18n } from "vue-i18n";
import { utils } from "ethers";
import { useToast } from "@/plugins/toast";

export default defineComponent({
  name: "collectionCard",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
    toName: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits:['handleSend','handleCancel','handleClick'],
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const { emit } = context;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const {$wtoast} = useToast()
    const viewDetail = () => {
      emit("handleClick",props.data);
    };
    const handleSpeedSend = () => {
      if(accountInfo.value.address.toUpperCase() !== props.data.from.toUpperCase()){
        $wtoast.warn(t('common.toggleAddress'))
        return 
      }
      emit('handleSend',props.data)
    }
    const handleSpeedCancel = () => {
      emit('handleCancel',props.data)
    }
    const sendAddress = computed(() => {
      return addressMask(props.data.to);
    });
    const fromAddress = computed(() => {
      return addressMask(props.data.from);
    });

    return {
      transferAmountText,
      handleSendStatus,
      transactionStatusClass,
      t,
      viewDetail,
      txTypeToIcon,
      transactionTarget,
      accountInfo,
      handleSpeedSend,
      handleSpeedCancel,
      formatDate,
      addressMask,
      sendAddress,
      fromAddress,
      utils,
      toUsdSymbol,
      transactionStatus,
      currentNetwork,
      handleTxType,
      formatTxDate
    };
  },
});
</script>

<style lang="scss" scoped>
.collection-card {
  min-height: 62px;
  padding-left: 15px;
  padding-right: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  transition: ease 0.3s;
  border-bottom: 1px solid #E4E7E8;
  cursor: pointer;
  transition: ease .3s;
  &.active {
    background: #E9F5FE;
    padding-left: 20px;
  }
  &:hover {
    background: #E9F5FE;
    padding-left: 20px;
  }
  &-left {
    .token-icon {
      width: 30px;
      height: 100%;
      color: rgba(3, 125, 214, 1);
      &-box {
        width: 28px;
        height: 28px;
        border-radius: 50%;

        font-size: 26px;
        i {
          font-size: 16px;
        }
        &.success {
          border: 1PX solid rgba(40, 167, 69, 1);
          color: rgba(40, 167, 69, 1);
        }
        &.fail {
          border: 1PX solid rgb(214, 25, 25);
          color: rgb(214, 25, 25);
        }
        &.pendding {
          border: 1PX solid #F7BF03;
          color: #F7BF03;
        }
      }
    }
    .token-info {
      margin-left: 8px;
      .name {
        font-size: 12px;
        line-height: 16px;
        font-weight: bold;
        span {
          font-weight: normal;
        }
      }
      .amount {
        font-size: 12px;
        line-height: 12px;
        color: #9a9a9a;
        span {
          color: rgba(40, 167, 69, 1);
        }
      }
    }
  }
  &-right {
    div {
      width: 120px;
      font-size: 12px;
    }
    .val {
      color: #000;
      font-weight: bold;
    }
    .usd {
      color: #9a9a9a;
    }
  }
}
.status0,
.status1 {
  transform: scale(0.9);
}
.status.success {
  display: inline-block;
  line-height: 14px;
  color: rgba(58, 174, 85, 1);
  background: #e5ffeb;
  padding: 0 5px;
  border-radius: 7px;
}
.status.failed {
  display: inline-block;
  line-height: 14px;
  color: rgb(214, 25, 25);
  background: #ffe8e5;
  padding: 0 5px;
  border-radius: 7px;
}
.status.waitting {
  display: inline-block;
  line-height: 14px;
  color: #F7BF03;
  background: #FEFCDA;
  padding: 0 5px;
  border-radius: 7px;
}
.speed-box {
  margin-top:10px;
  padding-left: 38px;
  button {
    height: 34px;
  }
}
</style>
