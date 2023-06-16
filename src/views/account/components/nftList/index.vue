<template>
  <van-list
    v-model:loading="loadNft"
    :finished="finished"
    @load="handleOnLoad"
    v-model:error="nftErr"
  >
    <van-sticky offset-top="91">
      <div class="flex between center-v create-box">

        <span class="f-12 text-bold label">
          <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="bottom-start">
            <template #reference>
              <span class="hover flex center">{{ sortVal.text }} 
                <!-- <i :class="`iconfont ${showPopover ? 'icon-shangla' : 'icon-xiala'}`"></i> -->
               </span>
            </template>
          </van-popover>
          </span>
        <span class="add flex center" @click="toCreate"><van-icon name="plus" /></span>
      </div>
    </van-sticky>
    <div :class="`nft-list ${layoutType}`" v-show="pageData.nftList.length" >
      <!-- <div v-if="sortVal.value == 0">
        <NftCard
        v-for="item in pageData.nftList"
        :key="item.address"
        :data="item"
      />
      </div>
      <div v-else>
        <AiNftCard
        v-for="item in pageData.nftList"
        :key="item.nft_address"
        :data="item"
       />
      </div> -->
      <AiNftCard
        v-for="item in pageData.nftList"
        :key="item.nft_address"
        :data="item"
       />
    </div>

  </van-list>
  <div
      class="no-list"
      v-show="!pageData.nftList.length && !nftErr && finished"
    >
      <NoData :hasText="false" />
    </div>
    <SliderBottom :finished="finished">
        <div class="text-center tip1">
          {{ t("wallet.notoken", { type: "NFT" }) }}
          <span class="toCreate hover mr-4" @click="toCreate">{{
           sortVal.text
          }}</span>
          <span class="tip2 disabled">{{ t("createNft.findMore") }}</span>
        </div>
    </SliderBottom>


    <!-- error -->
    <div class="err-nft p-20" v-if="nftErr">
      <div class="text-center mt-20 mb-20 f-14">
        {{ t("createNft.pullagain") }}
      </div>
      <div class="flex center">
        <van-button @click="reLoading">{{ t("createNft.retry") }}</van-button>
      </div>
    </div>
  <!-- </van-pull-refresh> -->
</template>

<script lang="ts">
import NftCard from "./nftCard.vue";
import AiNftCard from "./aiNftCard.vue";
import { getNftOwner,getDrawInfoByUser,GetDrawInfoParams, getDrawInfoByNftaddrs,getOwnerNftList } from "@/http/modules/nft";
import eventBus from "@/utils/bus";
import NoData from "@/components/noData/index.vue";
import {web3} from '@/utils/web3';
import {
  computed,
  ref,
  watch,
  reactive,
  Ref,
  defineComponent,
  SetupContext,
} from "vue";
import { useStore } from "vuex";
import { List, Toast, Button, PullRefresh, Sticky, Icon, Popover } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "@/plugins/toast";
import { decode } from "js-base64";
import SliderBottom from '@/components/sliderBottom/index.vue'

export default defineComponent({
  name: "nft-list",
  components: {
    NftCard,
    AiNftCard,
    [List.name]: List,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    NoData,
    SliderBottom
  },
  emits: ["onLoad"],
  setup(props: any, context: SetupContext) {
    const store = useStore();
    const { t } = useI18n();
    const router = useRouter();
    const layoutType = computed(() => store.state.system.layoutType);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const pageData: any = reactive({ nftList: [] });
    const { $wtoast } = useToast();
    // nft load
    const loadNft: Ref<boolean> = ref(false);
    const finished: Ref<boolean> = ref(false);
    const nftErr: Ref<boolean> = ref(false);
    let params = {
      owner: accountInfo.value.address.toLowerCase(),
      page: "0",
      page_size: "8",
    };
    let aiparams = {
      useraddr: accountInfo.value.address,
      index: '-8',
      count: '8'
    }

    const getAiNftList = async (newAiparams: GetDrawInfoParams) => {
      const {data} = await getDrawInfoByUser(newAiparams).finally(() => loadNft.value =false)

      if(data && data.length) {
        data.forEach((item: any) => {
          const param = JSON.parse(item.Drawparams)
          item['prompt'] = param.prompt
          item['randomNumber'] = param.randomNumber
        })
        pageData.nftList.push(...data);
      }
      return Promise.resolve(data);
    }

    // Get user NFT
    const getNftList = async (params: any) => {
      // Get user NFT Gets the NFT list of the current account
      try {
        const { nfts, total }: any = await getOwnerNftList(params)
      const nftaddrs = nfts.map((item: any) => item.address)
      
      const drawList = await getDrawInfoByNftaddrs({nftaddrs})
      debugger
      // @ts-ignore
      if (nfts && nfts.length) {
        nfts.forEach((item: any) => {
          try{
        //     data.forEach((item: any) => {
        //   const param = JSON.parse(item.Drawparams)
        //   item['prompt'] = param.prompt
        //   item['randomNumber'] = param.randomNumber
        // })
        console.warn('web3.utils.toUtf8(item.raw_meta_url)', web3.utils.toUtf8(item.raw_meta_url))
            item.info = web3.utils.toUtf8(item.raw_meta_url);
          }catch(err){
            console.error(err)
            item.info = {}
          }
        });
        // @ts-ignore
        pageData.nftList.push(...nfts);
      }
      return Promise.resolve(nfts);

      }catch(err){

      }finally {
        loadNft.value = false
      }

    };
    // List loading event
    const handleOnLoad = async () => {
      console.log('load nft...')
      try {
        if(sortVal.value == 0) {
          params.page = (Number(params.page) + 1) + "";
          const list = await getNftList(params);
        if (!list || !list.length) {
          finished.value = true;
        }
        }else {
          aiparams.index = (Number(aiparams.index) + Number(aiparams.count)) + "";
         const list = await getAiNftList(aiparams)
         if (!list || !list.length) {
          finished.value = true;
        }
        }
       
      } catch (err) {
        nftErr.value = true;
        Toast(JSON.stringify(err));
      }
    };

    // Error, retry
    const reLoading = () => {
      nftErr.value = false;
      finished.value = false;
      params.page = "-1";
      aiparams.index = '-8'
      pageData.nftList = [];
      handleOnLoad();
    };

    // Update the current collectibles list each time you switch accounts
    eventBus.on("changeAccount", (address) => {
      params.owner = address;
      reLoading();
    });
    const toCreate = () => {
      if (Number(accountInfo.value.amount) == 0) {
        $wtoast.warn(t("wallet.haveNoMoney"));
        return false;
      }
      router.push({ name: "generateNFT" });

      // if(sortVal.value == 0) {
      //   router.push({ path: "/createNft/step2" });
      // }
      // if(sortVal.value == 1) {
      //   router.push({ name: "generateNFT" });
      // }
    };

    // The drop-down load
    const onRefresh = () => {
      reLoading();
    };

    const showPopover = ref(false)
    const sortVal = reactive({
      text: t('castingnft.createNFT'), value:0
    })
    const actions = [
      { text: t('castingnft.createNFT'), value:0,className:'hoverMenuItem' },
      { text: t('generateNFT.title'),value:1 ,className:'hoverMenuItem'},
    ];
    const onSelect = ({text, value}: any) => {
      sortVal.text = text
      sortVal.value = value
      reLoading()
    };

    return {
      sortVal,
      onSelect,
      actions,
      showPopover,
      toCreate,
      layoutType,
      handleOnLoad,
      pageData,
      nftErr,
      finished,
      loadNft,
      reLoading,
      onRefresh,

      t,
    };
  },
});
</script>
<style lang="scss" scoped>

.icon-shangla {
  font-size: 18px;
}
.create-box {
  background: #f1f3f4;
  height: 30px;
  padding: 0 15px;
  position: relative;
  .label {
    color: #848484;
  }
  .add {
    width: 36px;
height: 18px;
background: #9F54BA;
border-radius: 9px;
cursor: pointer;
i {
  color: #fff;
  font-size: 14px;
}
  }
}
.nft-list {
  &.card {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    // :deep(.nft-card:nth-of-type(odd)) {
    //   margin-right: 15px;
    // }
  }
}
.tip1 {
  .toCreate {
    color: #9F54BA;
    font-size: 12px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.tip2.disabled {
  color: #b3b3b3 !important;
}
</style>