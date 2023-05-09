<template>
  <div
    class="token-card flex between clickActive"
    @click="toTokenHome"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <div class="token-card-left flex w-100">
      <div class="token-icon flex center">
        <div class="icon-box flex center">
          <img src="@/assets/token/logowallet.png" v-show="hover" alt="">
          <img src="@/assets/token/icon_black.svg" v-show="!hover" alt="">
        </div>
      </div>
      <div class="token-info flex center">
        <div class="token-name">{{data.name}}</div>
        <div>
          <div class="name">{{ decimal(data.balance) }} {{ data.symbol }}</div>
          <div class="amount text-right" v-if="!data.tokenContractAddress">${{ toUsd(data.balance, 6) }}</div>
        </div>
      </div>
    </div>
    <div class="token-card-right flex center">
      <!-- <van-icon name="arrow" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import {
  SetupContext,
  Ref,
  ref,
  reactive,
  defineComponent,
  computed,
} from "vue";
import { Icon,Image } from "vant";
import { useRouter } from "vue-router";
import { decimal, toUsd } from "@/utils/filters";
import { useStore } from "vuex";

export default defineComponent({
  name: "tokenCard",
  components: {
    [Icon.name]: Icon,
    [Image.name]: Image
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    // Whether network icon
    networkIcon: {
      type: Boolean,
      default: false,
    },
    toName: {
      type: String,
      default: 'currencyHome'
    }
  },
  setup(props: any, context: SetupContext) {
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const router = useRouter();
    const { emit } = context;
    const {commit} = useStore()
    const toTokenHome = () => {
            // Stores data for token selection
      commit('transfer/UPDATE_CHOOSETOKEN', props.data)
      router.replace({
        name: props.toName,
        query: props.data
      })
      emit('handleClick')
    };
    const hover = ref(false)
    return {
      toTokenHome,
      decimal,
      currentNetwork,
      hover,
      toUsd
    };
  },
});
</script>

<style lang="scss" scoped>
.token-card {
  height: 68px;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #E4E7E8;
  &:hover {
    transition: ease .3s;
    cursor: pointer;

    color: #037DD6;
    .token-info .amount {
      color: #037DD6;
    }
  }
  &-left {
    .token-icon {
      width: 38px;
      height: 100%;
      .icon-box {
        border-radius: 50%;
        img {
          width: 38px;
        }
      }
    }
    .token-info {
      flex: 1;
      padding: 0 0 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .token-name {
        font-size: 15px;
      }
      .name {
        font-size: 12px;
        line-height: 12px;
        font-weight: bold;
        text-align: right;
      }
      .amount {
        font-size: 12px;
        line-height: 12px;
        color: rgba(119, 119, 119, 1);
        margin-top: 8px;
      }
    }
  }
  &-right {
    font-size: 16px;
  }
}
.w-100 {
  width: 100%;
}
</style>
