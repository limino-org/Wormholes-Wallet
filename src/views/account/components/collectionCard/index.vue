<template>
  <div
    class="collection-card flex between"
    @click="viewDetail"
  >
    <div class="collection-card-left flex">
      <div class="token-icon flex center">
        <div
          :class="`token-icon-box flex center ${
            data.status == 1 ? 'success' : 'fail'
          }`"
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
            <span :class="`status${data.status}`">
              {{ transactionStatus(data.status) }}
            </span>
          </div>
          <div class="amount">
            {{ formatDate(data.date, "MM/DD") }}
            {{ $t("transactionDetails.at") }}
            {{ formatDate(data.date, "HH:mm ") }}
          </div>
        </div>
      </div>
    </div>
    <div class="collection-card-right flex center">
      <div>
        <div class="van-ellipsis text-right val lh-18">
         {{data.transitionType == '6' ? '+' + data.convertAmount : '-' + utils.formatEther(data.value)}} {{data.symbol}}
        </div>
        <div class="van-ellipsis text-right usd lh-18">
          {{data.transitionType == '6' ? toUsdSymbol(data.convertAmount, 4) : toUsdSymbol(utils.formatEther(data.value),4)}} 
        </div>
      </div>
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
import { Icon } from "vant";
import {
  transactionTarget,
  formatDate,
  addressMask,
  toUsdSymbol,
  transactionStatus,
  transactiontxType,
} from "@/utils/filters";
import { useStore } from "vuex";
import { AccountInfo } from "@/store/modules/account";
import { useI18n } from "vue-i18n";
import { utils } from "ethers";
export default defineComponent({
  name: "collectionCard",
  components: {
    [Icon.name]: Icon,
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
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const store = useStore();
    const { emit } = context;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const viewDetail = () => {
      emit("handleClick");
    };

    const sendAddress = computed(() => {
      return addressMask(props.data.to);
    });
    const fromAddress = computed(() => {
      return addressMask(props.data.from);
    });
    const txTypeToIcon = (data: any) => {
      const {txType,transitionType} = data
      let s = ''
      if(transitionType == '6') {
        return 'icon-caozuo-xunhuan1'
      }
      switch(txType.trim()){
        case 'send':
        case 'other':
          s = 'icon-jiantou_youshang'
          break;
        case 'contract':
          s = 'icon-icon-'
          break;
      }
      return s
    }
    const handleTxType = (item: any) => {
      const {transitionType,txType} = item
      console.warn('transitionType', transitionType)
     if(transitionType && transitionType == '6') {
        return t('common.conver')
     } else {
      return transactiontxType(txType)
     }
    }
    return {
      t,
      viewDetail,
      txTypeToIcon,
      transactionTarget,
      accountInfo,
      formatDate,
      addressMask,
      sendAddress,
      fromAddress,
      utils,
      toUsdSymbol,
      transactionStatus,
      currentNetwork,
      handleTxType
    };
  },
});
</script>

<style lang="scss" scoped>
.collection-card {
  height: 62px;
  padding-left: 15px;
  padding-right: 10px;
  transition: ease 0.3s;
  border-bottom: 1px solid #E4E7E8;
  cursor: pointer;
  transition: ease .3s;
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
        font-size: 10px;
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
.status1 {
  display: inline-block;
  line-height: 14px;
  color: rgba(58, 174, 85, 1);
  background: #e5ffeb;
  padding: 0 5px;
  border-radius: 7px;
}
.status0 {
  display: inline-block;
  line-height: 14px;
  color: rgb(214, 25, 25);
  background: #ffe8e5;
  padding: 0 5px;
  border-radius: 7px;
}
</style>
