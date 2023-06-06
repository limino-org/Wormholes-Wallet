<template>
  <div
    @click="toDetail"
    :class="`nft-card  clickActive  ${
      layoutType == 'list'
        ? ' flex between'
        : 'van-hairline--surround'
    } ${layoutType}`"
  >
    <div :class="`info  ${layoutType == 'list' ? 'flex between' : ''}`">
      <div class="icon flex center">
        <van-image :src="data.info.meta_url" fit="cover" />
      </div>
      <div class="address flex column between">
        <div class="name">{{ (data.info.name) }}</div>
        <div class="add">{{ addressMask(data.address) }}</div>
      </div>
    </div>
    <div class="amount flex center-v" v-if="layoutType == 'list' && amountType != 'mask'">
      <div class="val">{{ data.info.royalty }} {{ currentNetwork.currencySymbol }}</div>
      <!-- <div class="usd">≈ ${{ data.to_doller }}</div> -->
    </div>
    <div class="flex right center-v f-12" v-if="amountType == 'mask' && layoutType =='list'">********</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue'
import { addressMask, decimal } from '@/utils/filters'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { Image } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { web3 } from '@/utils/web3'
export default defineComponent({
  name: 'nft-card',
  components: {
    [Image.name]: Image
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup(props: any) {
    const store = useStore()
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    const layoutType = computed(() => store.state.system.layoutType)
    const router = useRouter()
    const datab: any = getCurrentInstance()
    const nftname = (value: string) => {
      web3.utils.hexToUtf8('0x' + value)
    }
    async function getdata() {
      let info = datab.data
      console.log(info)
    }
    const toDetail = () => {
      sessionStorage.setItem('nftInfo',JSON.stringify(props.data))
      router.push({ name: 'sendNft-step1'})
    }
    // Balance display type
    const amountType = computed(() => store.state.system.amountType)
    // let info = item.data.raw_met.a_url
    return {
      addressMask,
      currentNetwork,
      layoutType,
      toDetail,
      amountType,
      getdata,
      nftname
    }
  }
})
</script>
<style lang="scss" scoped>
.nft-card {
  transition: 0.3s ease-in-out;
  &.card:hover {
    cursor: pointer;
    box-shadow: 0px 2px 14px rgba($color: #ccc, $alpha: 0.4);
    /* background:#F8F3F9; */
    color:#9F54BA;
    .usd,.address .add {
      color:#9F54BA;
    }
  }
  &.list:hover {
    background:#F8F3F9;
    color:#9F54BA;
    .usd,.address .add {
      color:#9F54BA !important;
    }
  }
  &.list {
    padding: 15px;
    overflow: hidden;
    border-bottom:1px solid #E4E7E8;
    .info {
      .icon {
        width: 40px;
        height: 40px;
        /* background: #9F54BA; */
        border-radius: 6px;
        margin-right: 15px;
        overflow: hidden;
        .van-image {
          width: 1.06667rem;
          height: 1.06667rem;

        }
        img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          display: block;
        }
      }
      .address {
        .add {
          color: rgba(154, 154, 154, 1);
        }
      }
    }
    .name {
      width: 220px;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  &.card {
    width: calc(50vw - 15px - 7.5px);
    margin-bottom: 15px;
    &:after {
      border-radius: 12px;
    }
    .info {
      padding: 7.5px 7.5px 0 7.5px;
      border-radius: 6px;
      .icon {
        width: 100%;
        height: 150px;
        display: flex;
        justify-content: center;
        .van-image {
          width: 100%;
          height: 100%;
          border-radius:6px;
          overflow: hidden;
        }
      }
    }
    .add {
      color: rgba(154, 154, 154, 1);
      margin: 5px 0;
    }
    .name {
      margin-top: 5px;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .name,
  .add,
  .val,
  .usd {
    font-size: 12px;
    line-height: 16px;
  }
  .amount {
    .usd {
      color: rgba(154, 154, 154, 1);
    }
    .val,
    .usd {
      text-align: right;
    }
  }
}

@media screen and (min-width: 756px) {
  .nft-card.card {
    width: 49%;
    margin-right: 0 !important;
  }
}
</style>