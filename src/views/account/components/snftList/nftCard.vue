<template>
  <div class="snft-card flex between">
    <div class="snft-card-l flex">
      <div :class="`level flex center-v ${select ? '' : 'pl-14'}`">
        <div :class="`icon flex center-h ${data.tagName.toLowerCase()}`"> 
          <!-- {{ data.tagName }} -->
          <span>L</span><span>{{ data.tagIdx }}</span>
        
        </div>
      </div>
      <div class="flex center-v tag-box">
        <NftTag :data="data" :tag="data.tag" />
      </div>
    </div>
    <div class="snft-card-r" v-show="!select">
      <div class="flex right center-v link-icons">
        <van-popover
        v-model:show="showPopover2"
        placement="top"
        class="nft-tag-popover"
      >
        <div class="lh-16 text-center">{{ t('common.viewInExchange') }}</div>
        <template #reference>
          <i class="iconfont icon-fangwujianzhuwugoujianbeifen" @click.stop="toNftExchange"  @mouseover="showPopover2 = true" @mouseout="showPopover2 = false"></i>
        </template>
      </van-popover>
      <van-popover
        v-model:show="showPopover"
        placement="top"
        class="nft-tag-popover"
      >
        <div class="lh-16 text-center">{{ t('common.viewInBrowser') }}</div>
        <template #reference>
          <i class="iconfont icon-network" @click.stop="toBrowser"  @mouseover="showPopover = true" @mouseout="showPopover = false"></i>
        </template>
      </van-popover>
        
    
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { addressMask, decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { computed } from "vue";
import { Popover } from "vant";
import {
  queryArraySnft,
  snft_com_page,
  tokenIdByNftaddr
} from "@/http/modules/nft";
import { useRoute, useRouter } from "vue-router";
import NftTag from './nftTag.vue'
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: "nft-card",
  components: {
    [Popover.name]:Popover,
    NftTag
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any) {
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const layoutType = computed(() => store.state.system.layoutType);
    const {t} = useI18n()
    const router = useRouter();
    const toDetail = () => {
      router.push({ name: "nft-detail", query: props.data });
    };
    
    const toNftExchange = async() => {
      const { tag, nft_address,source_url, metaData } = props.data
      let tokenidmm = ''
      switch(nft_address.length){
        case 42:
          tokenidmm = nft_address
          break;
        case 41:
        tokenidmm = `${nft_address}m`
          break;
        case 40:
        tokenidmm = `${nft_address}mm`
          break;
        case 39:
        tokenidmm = `${nft_address}mmm`
          break;
      }
      const {data: nft_token_id} = await tokenIdByNftaddr(tokenidmm)
      const { nft_contract_addr } = metaData
      const domain = currentNetwork.value && currentNetwork.value.chainId === 51888 ? 'http://192.168.1.235:9006/c0x5051580802283c7b053d234d124b199045ead750/#' : 'https://hub.wormholes.com/c0x97807fd98c40e0237aa1f13cf3e7cedc5f37f23b/#'
      let str = '/assets/detail'
      if(tag == 'P' || tag == 'C' || tag == 'N') {
        str += `?nft_contract_addr=${nft_contract_addr}&nft_token_id=${nft_token_id}`
      } else if(tag == 'F') {
        str += `?nft_contract_addr=${nft_contract_addr}&nft_token_id=${nft_token_id}&source_url=${source_url}`
      }
      const newUrl = `${domain}${str}`
      window.open(newUrl)
    }

    const toBrowser = () => {
      const { tag, nft_address,source_url, metaData } = props.data
      const domain = 'https://www.wormholesscan.com/#/SNFT/SNFTDetails'
      const str = `?snftid=${nft_address}`
      const newUrl = `${domain}${str}`
      window.open(newUrl)
    }
    
    const showPopover2 = ref(false)
    const showPopover= ref(false)
    return {
      addressMask,
      currentNetwork,
      toBrowser,
      layoutType,
      toDetail,
      toNftExchange,
      showPopover2,
      t,
      showPopover
    };
  },
});
</script>


<style lang="scss" scoped>
$L0Color: #9F54BA;
$L1Color: #3AAE55;
$L2Color: #F7BF03;
$L3Color: #D73A49;
.snft-card {
  flex: 1;
  height: 67px;
  border-bottom: 1px solid #E4E7E8;
  &-l {
    width: 70%;
    .level {
      padding-right: 10px;
      height: 100%;
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-weight: bold;
        color: #fff;
        line-height: 40px;
        text-align: center;
        letter-spacing: 1px;
          //       font-size: 32px;
          // font-family: KenneyPixel;
        span:nth-of-type(1) {
          font-size: 22px;
          font-weight: normal;
          // font-family: KenneyPixel;
        }
        span:nth-of-type(2) {
          font-size:15px;
          line-height: 15px;
          font-weight: normal;
          margin-top: 14px;
        }
        &.l3 {
          background: $L3Color;
        }
        &.l2 {
          background: $L2Color;
        }
        &.l1 {
          background: $L1Color;
        }
        &.l0 {
          background: $L0Color;
        }
      }
    }
    .tag-box {
      height: 100%;
    }
  }
  &-r {
    width: 30%;
    .link-icons {
      height: 100%;
      padding-right: 15px;
    }
    :deep(){
      .van-popover__wrapper {
      &:nth-of-type(2){
        margin-left: 15px;
      }
    }
    }
    i {
      cursor: pointer;
      font-size: 18px;

    }
  }
}
</style>