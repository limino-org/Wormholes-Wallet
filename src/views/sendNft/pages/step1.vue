<template>
  <div class="nft-detail">
    <div class="quanping"  v-if="!isAiNft">
      <van-icon name="expand-o" class="hover"  @click="showImg" />
    </div>
    <div class="code flex center" >
      <van-image
       @click="showImg"
        v-if="!isAiNft"
        :src="nftInfo.meta_url"
        width="6.8rem"
        height="6.8rem"
      ></van-image>
      <div :class="`nft-ai ${nftInfo.category == 2 ? 'fail' : 'success'}`" v-else>
          <div class="flex center">
            <div>
              <img src="@/assets/ai-default.png" v-if="nftInfo.category == 2" />
              <img src="@/assets/ai-success.png" v-else/>
            </div>
          </div>
          <div class="flex center">
            <div class="nft-ai-text" v-if="nftInfo.category == 2">{{ t('generateNFT.noPic') }} <br> {{ t('generateNFT.noPic2') }}</div>
            <div class="nft-ai-text success" v-else>{{ t('generateNFT.okPic') }} <br> {{ t('generateNFT.okPic2') }}</div>
          </div>
        </div>
    </div>

    <!-- NFT information -->
    <div class="form van-hairline--surround">
      <div class="content van-hairline--bottom" v-if="isAiNft">
        <div class="form-titie">{{ t("generateNFT.aiPromptTit") }}</div>
        <div class="form-content name">{{ nftInfo.info.prompt }}</div>
      </div>
      <div class="content van-hairline--bottom">
        <div class="form-titie">{{ t("sendNFT.address") }}</div>
        <div class="form-content van-ellipsis">
          {{ addressMask(pageData.data.address) }}
        </div>
      </div>
      <!-- <div class="content">
        <div class="form-titie">{{ t("sendNFT.amount") }}</div>
        <div class="form-content">

          {{ pageData.data.royalty_ratio }}ERB
        </div>
      </div> -->
    </div>
    <!-- function -->
    <div class="flex evenly">
        <div class="actions-btn" @click="toSend">
          <div class="action-icon flex center">
            <i class="iconfont icon-teshujiantouzuoxiantiao-copy"></i>
          </div>
          <div class="send-action text-center">{{ t("sendNFT.send") }}</div>
        </div>
        <div class="actions-btn" @click="tomore">
          <div class="action-icon flex center">
            <van-icon name="description" />
          </div>
          <div class="send-action text-center">{{ t("sendNFT.more") }}</div>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { showSlider, show } from "@/components/navHeader/hooks/slider";
import {
  Tab,
  Tabs,
  Popup,
  Icon,
  Dialog,
  Sticky,
  Toast,
  Loading,
  Image,
  Empty,
  ImagePreview,
} from "vant";
import {
  ref,
  Ref,
  reactive,
  onMounted,
  computed,
  toRefs,
  watch,
  onBeforeMount,
} from "vue";
import NavHeader from "@/components/navHeader/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { addressMask, decimal } from "@/utils/filters";
import { web3 } from "@/utils/web3";

export default {
  components: {
    NavHeader,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Image.name]: Image,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    // @ts-ignore
    const nftInfo = ref(JSON.parse(sessionStorage.getItem("nftInfo")));

    const { address, info } = nftInfo;
    const pageData = reactive({ data: nftInfo });
    pageData.data.info = JSON.parse(pageData.data.info)
    const isAiNft = ref(pageData.data.info.meta_url ? false : true)
    const handleLeft = () => {
      router.back();
    };
    const toSend = () => {
      router.push({
        name: "sendNft-step2",
        query: {
          address,
        },
      });
    };
    const tomore = () => {
      Toast(t("sendNFT.tomore"));
    };
    const showImg = () => {
      ImagePreview({ images: [nftInfo.value.meta_url], closeable: true });
    };

    return {
      t,
      handleLeft,
      pageData,
      isAiNft,
      toSend,
      addressMask,
      nftInfo,
      name,
      tomore,
      showImg,
    };
  },
};
</script>
<style lang="scss" scoped>
  .nft-ai {
    background: #F3F3F3;
    padding: 5px 0;
    width: 256px;
    height: 256px;
    position: relative;
    &.success {
      background: #FCF5FF;
    }
    &.fail {
      background: #F3F3F3;
    }
    img {
      display: block;
      margin: 70px auto 0;
      height: 80px;
    }
    &-text {
      width: 160px;
      margin-top: 5px;
      text-align: center;
      font-size: 12px;
      color: #D9D5D5;
      word-break: keep-all;
      &.success {
        color: #D5B4E0;
      }
    }
  }
  .quanping {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    margin-right: 22px;
    i {
      top: 10px;
      right: 22px;
      font-size: 16px;
      color: #9A9A9A;
    }
  }
.nft-detail {
  padding-bottom: 50px;
  .back {
    font-size: 18px;
    color: #9F54BA;
  }

  .code {
    width: 256px;
    height: 256px;
    margin: 25px auto 15px;
    border-radius: 7px;
    overflow: hidden;

    :deep(.van-image) {
      border-radius: 7px;
      overflow: hidden;
    }
  }
  .info {
    margin: 0 15px;
    .card {
      width: 105px;
      height: 65px;
      background: #F8F3F9;
      border-radius: 7.5px;
      text-align: center;
      padding: 4px 0;
      box-sizing: border-box;
      &.active {
        border: 1px solid #9F54BA;
      }
      & > div {
        line-height: 20px;
      }
      &-t {
        font-size: 12px;
        color: #848484;
      }
      &-m {
        font-weight: bold;
        font-size: 12px;
      }
      &-b {
        font-size: 12px;
        color: #848484;
      }
    }
  }
  .form {
    margin: 20px;
    /* height: 205px; */
    &:after {
      border-radius: 5px;
    }
    .content {
      font-size: 14px;
      line-height: 20px;
      padding: 15px 10px;
      .form-titie {
        color: #9A9A9A;
      }
      .name {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .line {
      height: 1px;
      background-color: #e4e7e8;
    }
  }
  .actions-btn {
    .action-icon {
      margin: 0 auto;
      width: 35px;
      height: 35px;
      background-color: #9F54BA;
      border-radius: 50%;
      i {
        font-size: 16px;
        color: #fff;
      }
    }
    .send-action {
      line-height: 16px;
      color: #9F54BA;
      font-size: 12px;
      margin-top: 7px;
    }
  }
}
</style>