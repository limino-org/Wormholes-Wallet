<template>
  <div class="choose-token-card flex between van-hairline--bottom clickActive" @click="toTokenHome">
    <div class="choose-token-card-left flex">
      <div class="token-icon flex center">
        <div class="icon-box">
          <img v-if="data" :src="data.logoUrl" alt />
        </div>
      </div>
      <div class="token-info flex center">
        <div>
          <div class="name">{{data.symbol}}</div>
          <div class="amount text-right">{{data.name}}</div>
        </div>
      </div>
    </div>
    <div class="choose-token-card-right flex center">
      <!-- <van-icon name="arrow" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, Ref, ref, reactive, defineComponent } from 'vue'
import { Icon } from 'vant'
import { useRouter } from 'vue-router'
import { decimal } from '@/utils/filters'
export default defineComponent({
  name: 'chooseTokenCard',
  components: {
    [Icon.name]: Icon
  },
  props: {
    data: {
      type: Object,
      default: null
    },
  },
  setup(props: any, context: SetupContext) {
    const router = useRouter()
    const { emit } = context
    const toTokenHome = () => {
      emit('handleClick', props.data)
    }
    return {
      toTokenHome,
      decimal
    }
  }
})
</script>

<style lang="scss" scoped>
.choose-token-card {
  height: 62px;
  padding-left: 28px;
  padding-right: 10px;

  &-left {
    .token-icon {
      width: 26px;
      height: 100%;
      .icon-box {
        width: 26px;
        border-radius: 50%;
        img {
          width: 100%;
        }
      }
    }
    .token-info {
      padding: 0 0 0 22px;
      .name {
        font-size: 12px;
        line-height: 16px;
      }
      .amount {
        font-size: 12px;
        line-height: 12px;
        color: rgba(119, 119, 119, 1);
      }
    }
  }
  &-right {
    font-size: 16px;
  }
}
</style>
