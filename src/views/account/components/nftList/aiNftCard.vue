<template>
  <div
    @click="toDetail"
    :class="`nft-card  clickActive  ${
      layoutType == 'list' ? ' flex between' : ''
    } ${layoutType} pb-14`"
  >
    <div :class="`info  ${layoutType == 'list' ? 'flex between' : ''}`">
      <div class="icon flex center">
        <van-image :src="data.meta_url" fit="cover" v-if="data.meta_url" />
        <div :class="`nft-ai ${data.category == 2 ? 'fail' : 'success'}` " v-else>
          <div class="flex center">
            <div>
              <img src="@/assets/ai-default.png" v-if="data.category == 2" />
              <img src="@/assets/ai-success.png" v-else/>
            </div>
          </div>
          <div class="flex center">
            <div class="nft-ai-text" v-if="data.category == 2">{{ t('generateNFT.noPic') }} <br> {{ t('generateNFT.noPic2') }}</div>
            <div class="nft-ai-text success" v-else>{{ t('generateNFT.okPic') }} <br> {{ t('generateNFT.okPic2') }}</div>
          </div>
        </div>
      </div>
      <div :class="`address  ${layoutType == 'list' ? 'flex center-v between' : ''}`">
        <!-- <div class="name">{{ (data.info.name) }}</div> -->
        <div class="add lh-14 h-14">{{ addressMask(data.address) }}</div>
        <div class="draw-btn" v-if="data.category == 2" @click.stop="toDraw">
          {{ t("generateNFT.AIDrawing2") }}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";
import { addressMask, decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { computed } from "vue";
import { Image } from "vant";
import { useRoute, useRouter } from "vue-router";
import { web3 } from "@/utils/web3";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: "nft-card",
  components: {
    [Image.name]: Image,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  setup(props: any) {
    const { t } = useI18n();
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const layoutType = computed(() => store.state.system.layoutType);
    const router = useRouter();
    const datab: any = getCurrentInstance();
    const nftname = (value: string) => {
      web3.utils.hexToUtf8("0x" + value);
    };
    async function getdata() {
      let info = datab.data;
      console.log(info);
    }

    // Balance display type
    const amountType = computed(() => store.state.system.amountType);
    // let info = item.data.raw_met.a_url

    const toDraw = () => {
      router.push({ name: "generateNFT-ai", query: props.data });
    };
    const toDetail = () => {
      console.log('------')
      sessionStorage.setItem("nftInfo", JSON.stringify(props.data));
      router.push({ name: "sendNft-step1" });
    };
    return {
      toDetail,
      toDraw,
      addressMask,
      currentNetwork,
      layoutType,
      amountType,
      getdata,
      t,
      nftname,
    };
  },
});
</script>
  <style lang="scss" scoped>
  .nft-ai {
    padding: 5px 0;

    position: relative;
    &.success {
      background: #FCF5FF;
    }
    &.fail {
      background: #F3F3F3;
    }
    &-text {
 
      color: #D9D5D5;
      word-break: keep-all;
      &.success {
        color: #D5B4E0;
      }
    }
  }
  .nft-card.list{
    .nft-ai {
      width: 50px;
    height: 50px;
    border-radius: 6px;
    overflow: hidden;
    img {
      width: 20px;
    }
    &-text {
      text-align: center;
      transform-origin: center center;

      transform: scale(.6);
      width: 90px;
      left: -20px;
      bottom: 0;
      position: absolute;
      
    }
    }
  }
  .nft-card.card {
    
    .nft-ai {
      height: 100%;
      width: 100%;
      padding: 25px 0 0;
      &-text {
        margin-top: 5px;
        text-align: center;
      }
      img {
        width: 80px;
      }
    }
    .icon {

    }
    .draw-btn {
      width: 82px;
      margin-top: 5px;
    }
  }
.nft-card {

  &.card:hover {
    cursor: pointer;
  .info {
    transition: 0.3s ease;
    box-shadow: 0px 2px 14px rgba($color: #ccc, $alpha: 0.4);

    /* background:#F8F3F9; */
    color: #9f54ba;
  }
    .usd,
    .address .add {
      color: #9f54ba;
    }
  }
  &.list:hover {
    background: #f8f3f9;
    color: #9f54ba;
    .usd,
    .address .add {
      color: #9f54ba !important;
    }
  }
  &.list {
    padding:5px 15px;
    overflow: hidden;
    border-bottom: 1px solid #e4e7e8;
    .info {
      width: 100%;
      .icon {
        width: 60px;
        height: 60px;
        /* background: #9F54BA; */
        border-radius: 6px;
        margin-right: 15px;
        overflow: hidden;
        .van-image {
          /* width: 1.06667rem;
            height: 1.06667rem; */
          width: 50px;
          height:50px;
          overflow: hidden;
          border-radius: 6px;
     
        }

      }
      .address {
        width: 100%;
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
    /* width: calc(50vw - 15px - 7.5px);
    
    margin-bottom: 15px; */
    transition: ease .3s;
    &:after {
      border-radius: 12px;
    }
    .info {
      padding: 7.5px 7.5px 8px 7.5px;
      border: 1px solid #e4e7e8;
      border-radius: 6px;
      overflow: hidden;
      .icon {
        width: 100%;
        height: 150px;
        display: flex;
        justify-content: center;
        border-radius: 6px;
        overflow: hidden;
        .van-image {
          width: 100%;
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
        }
      }
    }
    .add {
      color: rgba(154, 154, 154, 1);
      margin: 5px 0 0;
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
.draw-btn {
  min-width: 82px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  background: #9f54ba;
  border-radius: 12px;
}

@media screen and (min-width: 756px) {
  .nft-card.card {

  }
}
</style>