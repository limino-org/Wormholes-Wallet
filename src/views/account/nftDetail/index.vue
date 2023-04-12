<template>
  <div class="nft-detail">
    <van-sticky>
      <NavHeader :hasRight="false">
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="handleLeft" />
        </template>
      </NavHeader>
    </van-sticky>

    <div class="code flex center">
     <van-image :src="pageData.data.source_url" width="6.8rem" height="6.8rem"></van-image>
    </div>
    
    <div class="form van-hairline--surround">
        <div class="content van-hairline--bottom">
            <div class="form-titie">
            {{t('nftDetail.name')}}:</div>
            <div class="form-content">{{pageData.data.name}}</div>
            </div>  
         <div class="content van-hairline--bottom">
            <div  class="form-titie">
            {{t('nftDetail.address')}}:</div>
            <div class="form-content van-ellipsis">{{addressMask(pageData.data.address)}}</div>
            </div>  
         <div class="content">
            <div class="form-titie">
            {{t('nftDetail.amount')}}:</div>
            <div class="form-content">
              <!-- {{pageData.data.royalty_ratio}}ERB -->

            </div>
            </div>  
        
    </div>
        <van-sticky position="bottom" :offset-bottom="30">
               <div class="actions-btn"  @click="toSend">
          <div class="action-icon flex center ">
            <i class="iconfont icon-jiantou_youshang"></i>
          </div>
          <div class="send-action text-center">
            {{t('nftDetail.send')}}
          </div>
        </div>
        </van-sticky>

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

export default {
  components: {
    NavHeader,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Image.name]: Image
  },
  setup() {
    const {t}=useI18n()
    const router = useRouter();
    const route = useRoute();
    const { query } = route;
    const { address }: any = query;
    const pageData = reactive({ data: query });
    const handleLeft = () => {
      router.back();
    };
    const toSend = () => {
      router.push({
        name:'send-nft1',
        query: {
          address
        }
      })
    }

    return {
      t,
      handleLeft,
      pageData,
      toSend,
      addressMask
    };
  },
};
</script>
<style lang="scss" scoped>
.nft-detail {
  padding-bottom: 50px;
  .back {
    font-size: 18px;
    color: rgba(3, 125, 214, 1);
  }
  .code {
    width: 256px;
    height: 256px;
    margin: 25px auto 15px;
    border: 1px solid #ccc;
    border-radius: 7px;
    overflow: hidden;
    :deep(.van-image){
      border-radius: 7px;
      overflow: hidden;
    }
  }
  .info {
    margin: 0 15px;
    .card {
      width: 105px;
      height: 65px;
      background: #f4faff;
      border-radius: 7.5px;
      text-align: center;
      padding: 4px 0;
      box-sizing: border-box;
      &.active {
        border: 1px solid #037cd6;
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
      margin: 15px;
      height: 205px;
      &:after {
          border-radius: 5px;
      }
      .content{
        font-size: 14px;
        line-height: 20px;
        padding:15px 10px;
        .form-titie{
          color:#E4E7E8 ;
        }
      }
      .line{
        height: 1px;
        background-color: #E4E7E8;
      }
  }
  .actions-btn{
    .action-icon{
      margin: 0 auto;
     width: 35px;
     height: 35px;
     background-color: #037CD6;
     border-radius: 50%;
     i {
            font-size: 16px;
            color: #fff;
          }
     }
     .send-action{
         line-height: 16px;
          color: rgba(3, 125, 214, 1);
          font-size: 12px;
          margin-top: 7px;
     }
  }
}
</style>