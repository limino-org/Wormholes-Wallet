<template>
    <div class="snft-list">
<van-sticky :offset-top="95">
    <div class="flex between tab-box">
      <span class="pl-14 pr-14 lh-20 conver-label">{{t('common.snftLabel')}}</span>
      <!-- <div class="flex between tab-list">
        <div
          :class="`tab-card flex center hover ${item.select ? 'active' : ''}`"
          @click.stop="handleTab(item.value, idx)"
          v-for="(item, idx) in tabList"
          :key="item.value"
        >
          {{ item.label }}
          <i
            v-if="item.value == '1' || item.value == '3'"
            @click.stop="handleTabModal"
            :class="`iconfont ${tabModal ? 'icon-shangla' : 'icon-xiala'} `"
          ></i>
        </div>
      </div> -->
      <div class="switch-box pr-14 pl-14 flex right" v-show="list.length">
        <van-switch
          v-model="value"
          @change="handleChangeSwitch"
          size="18px"
        ></van-switch>
      </div>
    </div>
  </van-sticky>
  <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
    <div class="snft-list-box">
      <div class="flex " v-for="(item) in list" :key="item.nft_address" >
        <div :class="`checkbox_img flex center-v pr-10 right pl-14 ${item.hasUnfreeze || typeof item.hasUnfreeze == 'undefined' ? '' : 'disabled'}`" v-show="isSelectComputed">
            <i
              v-if="item.flag"
              @click.stop="handleSelect(item)"
              class="iconfont icon-xuanzhong2"
            ></i>
            <i
              v-else
              @click.stop="handleSelect(item)"
              class="iconfont icon-xuanzhong"
            ></i>
          </div>
        <SnftCard :data="item" :select="isSelectComputed" />
      </div>
      <!-- <div :class="`snftcontainer ${item.hasUnfreeze || typeof item.hasUnfreeze == 'undefined' ? '' : 'disabled'}`" :title="item.hasUnfreeze || typeof item.hasUnfreeze == 'undefined' ? '' : t('wallet.snftUnfree')" v-for="(item, i) in list" :key="item.nft_address" @mouseover="item.renderPop = true" @mouseleave="item.renderPop = false"  @click.stop="toNftExchange(item)">
        <div class="snftcontainer_left">
          <div :class="`checkbox_img flex center ${item.hasUnfreeze || typeof item.hasUnfreeze == 'undefined' ? '' : 'disabled'}`" v-if="isSelectComputed">
            <i
              v-if="item.flag"
              @click.stop="handleSelect(item)"
              class="iconfont icon-xuanzhong2"
            ></i>
            <i
              v-else
              @click.stop="handleSelect(item)"
              class="iconfont icon-xuanzhong"
            ></i>
          </div>
          <div class="snftcontainer_left_container">
            <div class="img-p">
              <van-image
                :src="`https://www.wormholestest.com${item.source_url}`"
                fit="cover"
                alt=""
                class="snftimg"
              />
          
            </div>
            <div class="snftmiddle flex column between" >
              <div class="flex between center-v snftName h-14 text-weight">
                <span class="f-14 lh-12 hover flex center-v"  @click.stop="toNftExchange(item)">
                  {{ item.collections }}-<span class="red"></span>
                  <span class="nft-p">{{item.pidx}}</span>
                  <span class="nft-c" v-if="item.cidx !== undefined">{{item.cidx}}</span>
                  <span class="nft-n"  v-if="item.nidx !== undefined">{{item.nidx}}</span>
                  <span class="nft-f" v-if="item.fidx !== undefined">{{item.fidx}}</span>
                  <span v-if="item.renderPop">
                    <van-popover v-model:show="item.showPop" theme="dark" placement="right" >
            <div class="lh-16 text-left p-8">{{t(`common.snftColorTip`)}}</div>
            <template #reference>
              <van-icon name="question" @mouseover.stop="item.showPop = true" size="15" @mouseout.stop="item.showPop = false" />
            </template></van-popover>
                  </span>
                  </span
                >
                <van-icon name="arrow" v-show="!value" />
      
              </div>
              <div class="snftleftcolleaddre flex center-v">
                <span class="snftmiddle-text">{{ item.nft_address }}</span>
              </div>
            </div>
          </div>
        </div>

      </div> -->
      <div v-if="finished && !list.length">
        <NoData />
      </div>
      <!-- <i18n-t
        tag="div"
        keypath="wallet.buySnft"
        class="text-center findMore"
        v-if="!loading && finished"
      >
        <template v-slot:link>
          <span>{{ t("wallet.findMore") }}</span>
        </template>
      </i18n-t> -->
    </div>
  </van-list>
  </div>

  <!-- <van-pull-refresh v-model="loading2" @refresh="onRefresh">
</van-pull-refresh> -->
  <Transition name="slider">
    <div :class="`flex center buySnft pb-30 pt-30 ${bugTipClass}`" v-if="showBuyTip">
      <i18n-t keypath="wallet.buySnft" tag="div" class="text-center f-12">
        <template v-slot:link><a :href="VUE_APP_OFFICIAL_EXCHANGE" target="__blank">{{ t('wallet.findMore') }}</a></template>
      </i18n-t>
    </div>
  </Transition>
  <Transition name="slider">
    <div class="snft_bottom" v-if="isSelectComputed">
      <div class="snft_bottom-left">
        <div class="checkbox_img" v-if="isSelectComputed">
          <i
            v-if="isSelectAll"
            @click="isSelectAllChange"
            class="iconfont icon-xuanzhong2"
          ></i>
          <i
            v-else
            @click="isSelectAllChange"
            class="iconfont icon-xuanzhong"
          ></i>
        </div>
        <span :class="`${isSelectAll ? 'select' : ''}`">{{
          t("common.all")
        }}</span>
        <div class="snft_bottom-left-text">
          <div class="total">
            {{ sumP }}(L3)/{{ sumC }}(L2)/{{ sumN }}(L1)/{{ sumF }}(L0)
          </div>
          <div class="usd">{{ sumAll }}ERB <span>( ≈${{toUsd( sumAll,4)}})</span></div>
        </div>
      </div>
      <div class="snft_bottom-right hover" @click="showTime">
        <div class="snft_right_swap flex center">
          <span>{{ submitText }}</span>
          <i class="iconfont icon-caozuo-xunhuan1 ml-4"></i>
        </div>
      </div>
    </div>
  </Transition>
  <van-dialog
    v-model:show="show"
    :show-cancel-button="false"
    :show-confirm-button="false"
    class="transfer-modal">
    <div class="dialog-warning-dark-c">
      <div v-if="show" class="dialog-warning-dark-c-container">
        <div class="dialog-warning-header-c">
          {{ titleText }}
        </div>
        <div class="confirm-card" v-if="tabIndex == 2">
          <div class="card">
            <div class="card-label">
              <span>{{  t("converSnft.select") }}</span>
        
            </div>
            <div class="card-value ">{{ sumP }}(L3)/{{ sumC }}(L2)/{{ sumN }}(L1)/{{ sumF }}(L0)</div>
          </div>
          <div class="card">
            <div class="card-label">
              <span>{{ t("converSnft.amount") }}</span>
        
            </div>
            <div class="card-value ">{{ sumAll }}ERB ≈${{toUsd(sumAll,2)}}</div>
          </div>
          <div class="card">
            <div class="card-label gasfee">
              <span>{{ t("send.gasfee") }}</span>
              <van-popover
                v-model:show="showTip6"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("common.gasFee") }}
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip6 = true"
                    @mouseout="showTip6 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value gasfee">≈{{gasFee}} ERB(≈ $ {{toUsd(gasFee, 8)}})</div>
          </div>
        </div>
        <Tip :message="t('common.converTip')" type="warn" />
        <i18n-t
          keypath="converSnft.tip"
          v-if="tabIndex == 2"
          tag="div"
          class="dialog-warning-text"
        >
          <template v-slot:link>
            <a
              :href="VUE_APP_OFFICIAL_EXCHANGE"
              target="_blank"
              rel="noopener noreferrer"
              >{{ t("converSnft.buy") }}</a
            >
          </template>
        </i18n-t>
        <!-- <div class="confirm-card" v-if="tabIndex == 1">
          <div class="card">
            <div class="card-label">{{ t("converSnft.select") }}</div>
            <div class="card-value">{{ sumP }}(P)/{{ sumC }}(C)/{{ sumN }}(N)/{{ sumF }}(F)</div>
          </div>
          <div class="card">
            <div class="card-label">{{ t("converSnft.amount") }}</div>
            <div class="card-value">{{sumAll}}ERB(≈${{toUsd(sumAll,2)}})</div>
          </div>
          <div class="card">
            <div class="card-label">
            <span>{{ t("bourse.hsitoryReturn") }}</span>
              <van-popover
              v-model:show="showTip2"
              theme="dark"
              placement="top"
              trigger="manual">
              <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">{{ t("bourse.tip6") }} </div>
              <template #reference>
              <van-icon
                @mouseenter="showTip2 = true"
                @mouseout="showTip2 = false"
                name="question hover" />
                </template>
              </van-popover>
          </div>
          <div class="card-value">{{historyProfit}} ERB(≈ ${{toUsd(historyProfit,2)}})</div>
        </div>

          <div class="card">
            <div class="card-label">
              <span>{{ t("bourse.income") }}</span>
              <van-popover
                v-model:show="showTip1"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("converSnft.iconmeTip") }}
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip1 = true"
                    @mouseout="showTip1 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value">≈{{myprofit}} ERB(≈ ${{toUsd(myprofit,2)}})</div>
          </div>
          <div class="card">
            <div class="card-label gasfee">
              <span>{{ t("send.gasfee") }}</span>
              <van-popover
                v-model:show="showTip3"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("common.gasFee") }}
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip3 = true"
                    @mouseout="showTip3 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value gasfee">≈{{gasFee}} ERB(≈ $ {{toUsd(gasFee, 8)}})</div>
          </div>
        </div> -->

        <!-- <div class="confirm-card" v-if="tabIndex == 3">
          <div class="card">
            <div class="card-label">{{ t("converSnft.select") }}</div>
            <div class="card-value">{{ sumP }}(P)/{{ sumC }}(C)/{{ sumN }}(N)/{{ sumF }}(F)</div>
          </div>
          <div class="card">
            <div class="card-label">{{ t("converSnft.amount") }}</div>
            <div class="card-value">{{sumAll}}ERB(≈${{toUsd(sumAll, 2)}})</div>
          </div>
          <div class="card">
            <div class="card-label">
              <span>{{ t("bourse.income") }}</span>
              <van-popover
                v-model:show="showTip1"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("converSnft.iconmeTip") }}
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip1 = true"
                    @mouseout="showTip1 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value">≈{{myprofit}} ERB(≈ ${{toUsd(myprofit,6)}})</div>
          </div>
          <div class="card">
            <div class="card-label">
              <span>{{ t("converSnft.staking") }}</span>
              <van-popover
                v-model:show="showTip2"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("common.gasFee") }} 
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip2 = true"
                    @mouseout="showTip2 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value">1 {{t('createExchange.year')}}</div>
          </div>
          <div class="card">
            <div class="card-label gasfee">
              <span>{{ t("send.gasfee") }}</span>
              <van-popover
                v-model:show="showTip3"
                theme="dark"
                placement="top"
                trigger="manual"
              >
                <div class="f-12 pl-10 pr-10 pt-10 pb-10 popover-tip">
                  {{ t("common.gasFee") }}
                </div>
                <template #reference>
                  <van-icon
                    @mouseenter="showTip3 = true"
                    @mouseout="showTip3 = false"
                    name="question hover"
                  />
                </template>
              </van-popover>
            </div>
            <div class="card-value gasfee">≈{{gasFee}} ERB(≈ $ {{toUsd(gasFee, 8)}})</div>
          </div>
        </div> -->

        <div class="footer-btns-c">
          <van-button
            @click="show = false"
            style="width: 100px"
            class="btn"
            round
            plain
            >{{ t("common.cancel") }}</van-button
          >
          <van-button
            style="width: 100px"
            :loading="isLoading"
            type="primary"
            class="btn"
            :disabled="Time !== 0"
            round
            @click="handleSubmit"
            >{{ t("common.confirm")
            }}{{ Time === 0 ? "" : `(${Time}s)` }}</van-button
          >
        </div>
      </div>
    </div>
  </van-dialog>
  <!-- <SnftModal v-model="tabModal" @change="handleChange" /> -->
</template>

<script lang="ts">
import { defineComponent, onDeactivated, onUnmounted } from "@vue/runtime-core";
import { computed, ref,onBeforeMount, onMounted, watch } from "vue";
import { useStore } from "vuex";
import {
  queryArraySnft,
  snft_com_page,
  tokenIdByNftaddr
} from "@/http/modules/nft";
import dialogWarning from "@/components/dialogWarning/message.vue";
import NoData from "@/components/noData/index.vue";
import SnftCard from './nftCard.vue'
import {
  List,
  Cell,
  CellGroup,
  Image,
  Button,
  Icon,
  Sticky,
  Toast,
  Dialog,
  Popover,
  Switch,
  ListInstance,
  PullRefresh 
} from "vant";
import eventBus from "@/utils/bus";
import { useI18n } from "vue-i18n";
import { clone, getGasFee, getWallet, TransactionSendStatus } from "@/store/modules/account";
import { useToast } from "@/plugins/toast";
import BigNumber from "bignumber.js";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
import { VUE_APP_EXCHANGES_URL, VUE_APP_OFFICIAL_EXCHANGE } from "@/enum/env";
import SnftModal from "./snftModal.vue";
import { getRandomColor } from "@/utils";
import { web3 } from "@/utils/web3";
import { toUsd } from "@/utils/filters";
import { ethers } from "ethers";
import { TransactionTypes } from "@/store/modules/account";
import Tip from '@/components/tip/index.vue'
import { debounce, throttle } from "@/utils/utils";
import router from "@/router";

export default defineComponent({
  name: "nft-list",
  props: {
    isSelect: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["updateLength", "success", "showSwitch", "update:modelValue"],
  components: {
    [Icon.name]: Icon,
    [Image.name]: Image,
    [List.name]: List,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [PullRefresh.name] : PullRefresh,
    "dialog-warning": dialogWarning,
    [Sticky.name]: Sticky,
    [Dialog.Component.name]: Dialog.Component,
    SnftCard,
    NoData,
    SnftModal,
    Tip
  },
  setup(props: any, context: any) {
    const { emit }: any = context;
    const isWarning = ref(false);
    const loading = ref(false);
    const finished = ref(false);
    const store = useStore();
    const { t } = useI18n();
    const nftErr = ref(false);
    const network = ref({
      chainId: 51891
    })
    const layoutType = computed(() => store.state.system.layoutType);
    const list: any = ref([]);
    const accountInfo = computed(() => store.state.account.accountInfo);
    let Time = ref(3);
    const isSelectComputed = computed({
      get: () => {
        return props.isSelect;
      },
      set: (v) => {
        emit("update:isSelect", v);
      },
    });

    onMounted(async() => {
      // const wallet = await getWallet()
      // const nftAccountInfo = await wallet.provider.send(
      //         "eth_getAccountInfo",
      //         ['0x8000000000000000000000000000000000015a94', "latest"]
      //       );
      //       debugger
    })
    const show = ref(false);
    
    const hex2int = (hex: any) => {
      let len = hex.length,
        a = new Array(len),
        code;
      for (let i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48 <= code && code < 58) {
          code -= 48;
        } else {
          code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
      }
      console.log('a', a)
      return a.reduce(function (acc, c) {
        acc = 16 * acc + c;
        return acc;
      }, 0);
    };

    const snftPosition = (nft_address: string) =>{
      const str = nft_address.substr(41)
      console.log('last str', str)
      return Number(`0x${str || 0}`) + 1
    }
    const sumP = computed(() => {
      return list.value.filter((l: any) => l.flag && l.tag == "P").length;
    });
    const sumC = computed(() => {
      return list.value.filter((l: any) => l.flag && l.tag == "C").length;
    });
    const sumN = computed(() => {
      return list.value.filter((l: any) => l.flag && l.tag == "N").length;
    });
    const sumF = computed(() => {
      return list.value.filter((l: any) => l.flag && l.tag == "F").length;
    });
    const sumAll = computed(() => {
      //  @ts-ignore
      const {t0,t1,t2,t3} = store.state.configuration.setting.conversion
      const pnum = new BigNumber(sumP.value).multipliedBy(4096).multipliedBy(t3);
      const cnum = new BigNumber(sumC.value).multipliedBy(256).multipliedBy(t2);
      const nnum = new BigNumber(sumN.value).multipliedBy(16).multipliedBy(t1);
      const fnum = new BigNumber(sumF.value).multipliedBy(t0);
      return pnum.plus(cnum).plus(nnum).plus(fnum).toString();
    });
    const showTime = () => {
      const data = list.value.filter((f: any) => f.flag);
      if (data.length) {
        // 
        show.value = true;
        calcProfit()
        calcGasFee()
        let setIntervalValue = setInterval(() => {
          if (Time.value > 0) {
            Time.value -= 1;
            if (Time.value === 0) {
              clearInterval(setIntervalValue);
            }
          } else {
            clearInterval(setIntervalValue);
          }
        }, 1000);
      } else {
        Toast(t("wallet.selectSNFT"));
      }
    };
    /**
     * status
     * 2 conversion
     * 3 pledge
     * 1 redemption
     */

    const params2 = {
      owner: accountInfo.value.address,
      page: "1",
      page_size: "20",
      status: "3",
    };
    
    const getSnftList = async(snftlist: Array<any>, blockNumber: number)=> {
      if(!wallet) {
        wallet = await getWallet()
      }
      const list = []
      for await (const nft_address of snftlist) {
        const nftAccountInfo = await wallet.provider.send("eth_getAccountInfo",[nft_address, web3.utils.toHex((blockNumber - 1).toString())])
        nftAccountInfo.nft_address = nft_address
        list.push(nftAccountInfo)
      }
      return list
    }

    const onLoad = async () => {
      let blockNumber = 0
      let network: any = null
      params2.status = tabIndex.value;
      loading.value = true;
      try {
        if(tabIndex.value == '2'){
          wallet = await getWallet()
          blockNumber = await wallet.provider.getBlockNumber();
          network = await wallet.provider.getNetwork()
        }        
        let { nfts } = await snft_com_page(params2);
        nfts = nfts && nfts.length ? nfts : [];
        const nftsAddr = nfts && nfts.length ? nfts.map((item: any) => item.address.toUpperCase()) : ''
        let copyList = JSON.parse(JSON.stringify(list.value))
        copyList = copyList.filter((item: any) => !nftsAddr.includes(item.address.toUpperCase()))
        const nftAddList = nfts.map((item: any) => {
          const len = item.address.length;
          let str = item.address;
          switch (len) {
            case 39:
              str = str + "000";
              break;
            case 40:
              str = str + "00";
              break;
            case 41:
              str = str + "0";
              break;
            case 42:
              break;
          }
          return str;
        }) ;
        if (!nfts || !nfts.length) {
          finished.value = true;
          loading.value = false;
        }
        
        // // 去重
        // const newlist = list.value.map((item: any) => item.address)
        // const newNftList = nftAddList.filter((item: any) => item.nft_address.toUpperCase())
        const nftInfoList = await getSnftList(nftAddList, blockNumber)
        // const { data: nftInfoList } = await queryArraySnft({
        //   array: `${JSON.stringify(nftAddList)}`,
        // });
        console.warn('nftInfoList', nftInfoList)
        nfts.forEach((item: any) => {
          if(tabIndex.value == '2' && item.pledge_number !== null) {
            item.hasUnfreeze = (blockNumber - Number(item.pledge_number)) > (network && network.chainId === 51888 ? 73 : 6307201)
          }
          
          const reallen = item.address.length;
          let str = item.address;
          const hexp = `0x${str.substr(37,2)}`
          const hexc = `0x${str.substr(39,1)}`
          const hexn = `0x${str.substr(40,1)}`
          const hexf = `0x${str.substr(41,1)}`
          switch (reallen) {
            case 39:
              item.tag = "P";
              item.tagName = "L3";
              item.tagIdx = 3;
              str = str + "000";
              item.pidx = web3.utils.hexToNumber(hexp)
              break;
            case 40:
              item.tag = "C";
              str = str + "00";
              item.tagName = "L2";
              item.tagIdx = 2;
              item.pidx = web3.utils.hexToNumber(hexp)
              item.cidx = web3.utils.hexToNumber(hexc) + 1
              break;
            case 41:
              item.tag = "N";
              item.tagName = "L1";
              item.tagIdx = 1;
              str = str + "0";
              item.pidx = web3.utils.hexToNumber(hexp)
              item.cidx = web3.utils.hexToNumber(hexc) + 1
              item.nidx = web3.utils.hexToNumber(hexn) + 1
              break;
            case 42:
              item.tag = "F";
              item.tagName = "L0";
              item.tagIdx = 0;
              item.pidx = web3.utils.hexToNumber(hexp)
              item.cidx = web3.utils.hexToNumber(hexc) + 1
              item.nidx = web3.utils.hexToNumber(hexn) + 1
              item.fidx = web3.utils.hexToNumber(hexf) + 1
              break;
          }
          item.showPop = false
          item.renderPop = false
          item.realAddr = str;
          item.flag = false;
          item.nft_address = item.address;

          const str1 = item.nft_address.substr(item.nft_address.length - 2);
          // The last 2 digits of the position in SNFT are converted to hexadecimal +1
          item.position = hex2int(str1) + 1;
          item.snftPosition = snftPosition(item.nft_address)
          // convert
          const str2 = item.nft_address.substr(item.nft_address.length - 4);
          // The last four digits of the position in the period turn to hexadecimal +1
          console.warn('str2', str2)
          item.number = hex2int(str2) + 1;

          nftInfoList.forEach((child: any) => {
            if (
              item.realAddr.toUpperCase() == child.nft_address.toUpperCase()
            ) {
              item.metaData = { ...child };
              item.source_url = child.source_url;
              item.collections = child.name;
            }
          });
        });
        params2.page = (Number(params2.page) + 1).toString();

        copyList.push(...nfts);
        list.value = copyList
        emit("updateLength", list.value.length);
        if (!nfts.length) {
          finished.value = true;
        }
      } catch (err) {
        console.error(err);
        finished.value = true;
      } finally {
        loading.value = false;
      }
    };

    // const 
    let wallet: any = null
    onBeforeMount(async() => {
      wallet = await getWallet()
      network.value = await wallet.provider.getNetwork()
    })
    const isSelectAll = ref(false);
    const isSelectAllChange = () => {
      isSelectAll.value = !isSelectAll.value;
      list.value.forEach((f: any) => {
        console.warn('f:', f)
        const { hasUnfreeze, tag } = f
        if(f != 'F' && !hasUnfreeze && tabIndex.value === '1') {
          return
        }
        f.flag = isSelectAll.value;
      });
    };
    const toHex = (str: string) => {
      if (str === "") return "";
      var hexCharCode = [];
      for (var i = 0; i < str.length; i++) {
        hexCharCode.push(str.charCodeAt(i).toString(16));
      }
      return hexCharCode.join("");
    };
    const { $wtoast } = useToast();
    const { $tradeConfirm } = useTradeConfirm();
    const isLoading = ref(false);

    let txQueue: Array<any> = [];

    const reLoading = () => {
      nftErr.value = false;
      finished.value = false;
      params2.page = "1";
      list.value = [];
      value.value = false
      // onLoad();
    };
    eventBus.on("changeAccount", (address) => {
      show.value = false
      params2.owner = address;
      reLoading();
      onLoad();
    });
    onUnmounted(() => {
      eventBus.off('changeAccount')
      window.removeEventListener('scroll', deFun)
    })

    const tabList = ref([
      // { label: t("createExchange.redemption"), value: "3", select: true },w
      { label: t("createExchange.convert"), value: "2", select: true },
    ]);
    const tabIndex = ref("2");
    const handleTab = (v: string, i: number) => {
      if(loading.value){
        Toast(t('common.loadingWait'))
        return
      }
      tabIndex.value = v;
      tabList.value.forEach((item, idx) => {
        if (idx == i) {
          item.select = true;
        } else {
          item.select = false;
        }
      });

      reLoading();
      onLoad();
    };
    const tabModal = ref(false);
    const value = ref(false);
    const showConvert = ref(false);
    const handleTabModal = () => {
      if(loading.value){
        Toast(t('common.loadingWait'))
        return
      }
      tabModal.value = !tabModal.value;
    };

    const handleChange = (data: any) => {
      tabList.value.forEach((item, i) => (item.select = false));
      tabList.value[0] = { ...data, select: true };
      tabIndex.value = data.value;
      reLoading();
      onLoad();
    };

    const handleChangeSwitch = () => {
      console.log(value.value);
      emit("showSwitch", value.value);
    };

    const submitText = computed(() => {
      let str = "";
      switch (tabIndex.value) {
        case "2":
          str = t("common.conver");
          break;
        case "3":
          str = t("createminerspledge.stake");
          break;
        case "1":
          str = t("createExchange.redemption");
          break;
      }
      return str;
    });

    const historyCallBack = () => {
      router.push({name:'transactionList'})
    }

    const handleSubmit = async () => {
      const data: any = list.value.filter((f: any) => f.flag);
      if (data.length) {
        const count = data.length
        const { t0, t1, t2, t3 } = store.state.configuration.setting.conversion
        let amount = new BigNumber(0)
        let pstr = 0
        let cstr = 0
        let nstr = 0
        let fstr = 0
        data.forEach((item: any) => {
          const {metaData:{ MergeLevel, MergeNumber}} = item
          if(MergeLevel == 0) {
            amount = amount.plus(t0)
            fstr++
          }
          if(MergeLevel == 1) {
            amount = amount.plus(new BigNumber(MergeNumber).multipliedBy(t1))
            nstr++
          }
          if(MergeLevel == 2) {
            amount = amount.plus(new BigNumber(MergeNumber).multipliedBy(t2))
            cstr++
          }
          if(MergeLevel == 3) {
            amount = amount.plus(new BigNumber(MergeNumber).multipliedBy(t3))
            pstr++
          }
        })
        let numstr = '';
        pstr ? numstr = numstr + pstr + `(L3*${pstr})` + '、' :''
        cstr ? numstr = numstr + cstr + `(L2*${cstr})` + '、' :''
        nstr ? numstr = numstr + nstr + `(L1*${nstr})` + '、' :''
        fstr ? numstr = numstr + fstr + `(L0*${fstr})` + '、' :''
        numstr = numstr.slice(0, numstr.length -1)
        // isLoading.value = true;
        isSelectComputed.value = false;
        show.value = false;
        $tradeConfirm.open({
          approveMessage: t("wallet.conver_approve"),
          wattingMessage: t("wallet.conver_waiting",{count:`<span style='color:#037CD6;'>${count}</span>`,amount:`<span style='color:#037CD6;'>${amount.toNumber()}</span>`,countstr:numstr }),
          wattingMessageType:"html",
          disabled: [TradeStatus.pendding],
          callBack: () => {
            reLoading();
            onLoad();
          },
          failBack: () => {
            reLoading();
            onLoad();
          },
        });
        debugger
        let transitionType = ''
        try {
          for await (const iterator of data) {
            const {nft_address} = iterator
            let str = "";
            switch (tabIndex.value) {
              case "2":
              transitionType = '6'
                str = `wormholes:{"type":6,"nft_address":"${nft_address}","version":"v0.0.1"}`;
                break;
              case "3":
              transitionType = '7'
                str = `wormholes:{"type":7,"nft_address":"${nft_address}","version":"0.0.1"}`;
                break;
              case "1":
              transitionType = '8'
                str = `wormholes:{"type":8,"nft_address":"${nft_address}","version":"0.0.1"}`;
                break;
            }

            const data3 = toHex(str);
            const tx1 = {
              from: accountInfo.value.address,
              to: accountInfo.value.address,
              data: `0x${data3}`,
              transitionType,
              nft_address,
              checkTxQueue: false
            };
            const receipt: any = await store.dispatch('account/transaction', tx1)
            txQueue.push(receipt);
            console.log('receipt', receipt)
          }
          $tradeConfirm.update({
            status: "approve",
          });
          const receiptList = await store.dispatch("account/waitTxQueueResponse");
          const successList = receiptList.map((item: any) => item.status)
          if(successList.length === count) {
          $tradeConfirm.update({
            status: "success",
            successMessage: t("wallet.conver_success",{count:`<span style='color:#037CD6;'>${count}</span>`,amount:`<span style='color:#037CD6;'>${amount.toNumber()}</span>`}),
            successMessageType:'html',
            historyCallBack
          });
          emit("success");
          } else {
            $tradeConfirm.update({
            status: "fail",
            successMessage: t("wallet.conver_wrong",{count: successList.length}),
            successMessageType:'html',
            historyCallBack
          });
          emit("success");
          }
        } catch (err) {
          console.error(err)
          $tradeConfirm.update({
            status: "fail",
            failMessage: t("createExchange.create_wrong"),
            historyCallBack
          });
        } finally {
          isLoading.value = false;
        }
      }
    };

    const titleText = computed(() => {
      let str = "";
      switch (tabIndex.value) {
        case "1":
          str = t("converSnft.tab1");
          break;
        case "2":
          str = t("converSnft.converTit");
          break;
        case "3":
          str = t("converSnft.tab3");
          break;
      }
      return str;
    });

    
    const myprofit = ref('')
    const historyProfit = ref('')
        const calcProfit = async() => {
          if(!wallet) {
            wallet = await getWallet()
          }
          const  blockNumber = await wallet.provider.getBlockNumber();
          const blockn = web3.utils.toHex(blockNumber.toString());
      const data = await wallet.provider.send('eth_getValidator',[blockn])
          // const data2 = await getAccount(accountInfo.value.address)
          let total = new BigNumber(0)
          data.Validators.forEach((item:any) =>{
            total = total.plus(item.Balance)
          } )
        const totalStr = total.div(1000000000000000000).toFixed(6)
        const totalprofit = store.state.account.minerTotalProfit 
        const totalPledge = new BigNumber(sumAll.value)
        myprofit.value = new BigNumber(totalprofit).multipliedBy(totalPledge.div(totalStr)).toFixed(6)
        historyProfit.value = new BigNumber(totalprofit).multipliedBy(new BigNumber(sumAll.value).div(totalStr)).toFixed(6)
    }

    const gasFee = ref('')
    const calcGasFee = async() => {
      let str = "";
      const {nft_address}: any = list.value.length ? list.value[0] : {}
            switch (tabIndex.value) {
              case "2":
                str = `wormholes:{"type":6,"nft_address":"${nft_address}","version":"v0.0.1"}`;
                break;
              case "3":
                str = `wormholes:{"type":7,"nft_address":"${nft_address}","version":"0.0.1"}`;
                break;
              case "1":
                str = `wormholes:{"type":8,"nft_address":"${nft_address}","version":"0.0.1"}`;
                break;
            }
      const data3 = toHex(str);
          const tx1 = {
            to: accountInfo.value.address,
            value: ethers.utils.parseEther(0 + ""),
            data: `0x${data3}`,
          };
          const gas: any = await getGasFee(tx1)
          try {
            const totalNum = sumP.value + sumN.value + sumF.value + sumC.value
            // @ts-ignore
            gasFee.value = new BigNumber(
              gas
            ).multipliedBy(totalNum)
              .toFixed(9);
          } catch (err: any) {
            console.error(err);
          }
    }
    const showTip1 = ref(false);
    const showTip2 = ref(false);
    const showTip3 = ref(false);
    const showTip4 = ref(false);
    const showTip5 = ref(false);
    const showTip6 = ref(false);


    const toNftExchange = async(item: any) => {
      const { tag, nft_address } = item
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
      // :http://192.168.1.235:9006/c0x5051580802283c7b053d234d124b199045ead750/#/   51888
      // 51891:https://snft.wormholestest.com
      const { source_url, metaData } = item
      const { nft_contract_addr } = metaData
      const domain = network.value && network.value.chainId === 51888 ? 'http://192.168.1.235:9006/c0x5051580802283c7b053d234d124b199045ead750/#' : 'https://hub.wormholes.com/c0x97807fd98c40e0237aa1f13cf3e7cedc5f37f23b/#'
      let str = '/assets/detail'
      if(tag == 'P' || tag == 'C' || tag == 'N') {
        str += `?nft_contract_addr=${nft_contract_addr}&nft_token_id=${nft_token_id}`
      } else if(tag == 'F') {
        str += `?nft_contract_addr=${nft_contract_addr}&nft_token_id=${nft_token_id}&source_url=${source_url}`
      }
      const newUrl = `${domain}${str}`
      window.open(newUrl)
    }


    const handleSelect = (item: any) => {
      if(tabIndex.value !== '1') {
        item.flag = !item.flag
        return
      }
      if(tabIndex.value === '1' && item.hasUnfreeze) {
        item.flag = !item.flag
        return
      }
      Toast(t('wallet.snftUnfree'))
    }

    const showBuyTip = ref(true)
    let oldScrollTop = 0
    const scrolling = () => {
      if(list.value.length < 10) {
        return
      }
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let scrollStep = scrollTop - oldScrollTop;
      oldScrollTop = scrollTop;
      if (scrollStep < 0) {
        console.log("scroll up.")
        if(!showBuyTip.value)showBuyTip.value = true
      } else {
        if(showBuyTip.value)showBuyTip.value = false
        console.log("scroll down.")
      }
    }
    const deFun = debounce(scrolling, 300)
    onMounted(() => {
      window.addEventListener('scroll', deFun)
    })

    const bugTipClass = ref('')
    const watchList = (val: any) => {
      if(val && val.length >= 10) {
        !bugTipClass.value ? bugTipClass.value = 'fixed' : ''
        // if(showBuyTip.value)showBuyTip.value = false 
      } else {
        bugTipClass.value ? bugTipClass.value = '' :''
        // if(!showBuyTip.value)showBuyTip.value = true 
      }
    }

    watch(()=> list.value, watchList , {
      deep: true,
      immediate: true
    })

    const loading2 = ref(false)
    const onRefresh = () => {
      list.value = []
      loading2.value = true
      onLoad();
    }
    
    return {
      showBuyTip,
      onRefresh,
      VUE_APP_OFFICIAL_EXCHANGE,
      handleSelect,
      bugTipClass,
      toNftExchange,
      myprofit,
      historyProfit,
      showTip1,
      showTip2,
      showTip3,
      showTip4,
      showTip5,
      showTip6,
      handleSubmit,
      titleText,
      gasFee,
      isLoading,
      submitText,
      handleChangeSwitch,
      showConvert,
      accountInfo,
      handleTabModal,
      show,
      layoutType,
      isSelectAll,
      sumN,
      toUsd,
      t,
      sumC,
      sumP,
      sumF,
      loading,
      tabList,
      tabIndex,
      tabModal,
      handleTab,
      finished,
      showTime,
      Time,
      onLoad,
      isWarning,
      sumAll,
      list,
      isSelectComputed,
      isSelectAllChange,
      VUE_APP_EXCHANGES_URL,
      value,
      handleChange,
      // pledgeSnft,
      // redemSnft,
    };
  },
});
</script>
<style lang="scss" scoped>
.snft-list-box {
  // padding-bottom:70px;
}
.conver-label {
  font-weight: bold;
}
.red {
  color: rgb(215, 58, 73);
  margin-left: 2px;
}
.nft-c,.nft-f,.nft-n,.nft-p{
  color: #fff;

margin-right: 3px;
border-radius: 3px;
// font-size: 20px;
// padding: 0 5px;
// line-height: 14px;
font-size: 18px;
padding: 0 4px;
line-height: 14px;
font-family: KenneyPixel;
text-align: center;
}
.buySnft {
  color: #848484;
    background: #fff;
   &.fixed {
    z-index: 1;
    position: fixed;
    width: 190px;
    bottom: 10px;
    line-height: 14px;
    left: 50%;
    margin-left: -95px;
    padding: 3px 5px;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
   }
  a {
    color: #037cd6;
  }
}
.nft-p {
background: rgb(215, 58, 73);

}
.nft-c{
  background: rgb(247, 191, 3);
}
.nft-n{
  background: rgb(58, 174, 85);
}
.nft-f{
  background: rgb(3, 124, 214);
}
.snft-list-box {

}
.tab-box {
  position: relative;
  background: #F1F3F4;
  padding: 8px 0;

}

:deep() {
  .van-sticky--fixed {
    border-bottom: 1px solid rgb(135 134 134 / 50%);
  }


}
.switch-box {
}
.tab-list {
  width: 200px;
  height: 26px;
  border-radius: 26px;
  border: 1px solid #037cd6;
  .tab-card {
    line-height: 24px;
    padding: 0 1px;
    text-align: center;
    width: 50%;
    border-radius: 24px;
    &.active {
      background: #037cd6;
      color: #fff;
    }
  }
}
.findMore {
  margin-top: 21px;
  color: #848484;
  span {
    color: #037cd6;
    cursor: pointer;
  }
}
.nft-list {
  &.card {
    padding: 13px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    :deep(.nft-card:nth-of-type(odd)) {
      margin-right: 15px;
    }
  }
}
// .nft-list-a {
//   height: calc(100vh - 600px);
// }
</style>
<style lang="scss" scoped>
.snftcontainer {
  height: 67px;
  padding: 0px 10px 0 15px;
  border-bottom: 1px solid #E4E7E8;
  display: flex;
  align-items: center;
  &.disabled {
    cursor:default;
    .img-p .van-image {
      filter: grayscale(100%);
    }
    .number {
      background: #ccc !important;
    }
    .snftmiddle-text,.snftName {
      color: #ccc !important;
    }
    .iconfont {
      color: #ccc;
    }
  }
  .checkbox_img {
    border-bottom: 1px solid #E4E7E8;
    &.disabled {
      cursor: not-allowed;
    }
    cursor: pointer;
    // background-color: red;
    i {
      width: 22px;
      font-size: 18px;
      color: #858585;
      &.icon-xuanzhong2 {
        color: #037cd6;
      }
      &.icon-xuanzhong {
        font-size: 20px;
      }
    }
    padding:7px 7px 7px 0;
  }
  .img-p {
    position: relative;
    .van-image {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
    }
  }
  .number {
    position: absolute;
    bottom: 2px;
    right: 3px;
    padding: 2px;
    font-size: 10px;
    min-width: 15px;
    line-height: 15px;
    text-align: center;
    min-height: 15px;
    background-color: #037cd6;
    border-radius: 10px;
    color: #fff;
  }

  .snftcontainerleft {
    //  width:10%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    //  border:1px solid #D0D7D7;
  }
  .snftmiddle {
    padding: 5px 0;
    width: 100%;
    .snftleftcollect {
      text-align: left;
      font-size: 22px;
    }
    .snftleftcolleaddre {
      font-size: 12px;
      color: #797777;
      margin-top: 7px;
    }
    .snftmiddle-text {
      line-height: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      letter-spacing: -0.6px;
    }
    .snftName {
      font-weight: bold;
      &>span {
        span {
          vertical-align: top;
        }
      }
      i {
        color: #B3B3B3;
        font-size: 18px;
      }
    }
  }
  .snftcontainright {
    font-size: 16px;
  }
}
.snftcontainer_left {
  display: flex;
  align-items: center;
  width: 100%;
}
.snftcontainer_left_container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  &:hover {
    cursor: pointer;
    color: #037cd6;
    .snftmiddle .snftmiddle-text {
      color: #037cd6;
    }
    .snftmiddle .snftName i{
      color: #037cd6;
    }
  }
}
.snftimg {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
}
.checkbox_img {
  cursor: pointer;
  // background-color: red;

  i {
    width: 22px;
    font-size: 18px;
    color: #858585;

    &.icon-xuanzhong2 {
      color: #037cd6;
    }
    &.icon-xuanzhong {
      font-size: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.snft_bottom {
  position: fixed;
  bottom: 0px;
  height: 65px;
  width: 100%;
  max-width: 750px;
  z-index: 1;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.snft_bottom-left {
  display: flex;
  align-items: center;
  margin-left: 14px;
  span {
    margin: 0 10px 0 0;
    font-size: 14px;
    color: #b3b3b3;
  }
  span.select {
    color: #037cd6;
  }
  .snft_bottom-left-text {
    .total {
      font-size: 12px;
      margin-bottom: 4px;
      letter-spacing: 0.4px;
    }
    .usd {
      color: #037cd6;
      font-size: 14px;
      font-weight: bold;
      span {
        font-weight: normal;
      }
    }
  }
}
.snft_right_swap {
  display: flex;
  align-items: center;
  // width: 75px;
  background-color: #037cd6;
  color: #fff;
  border-radius: 15px;
  height: 30px;
  line-height: 30px;
  padding: 0 7px;
  margin-right: 15px;
  span {
    font-size: 12px;
  }
  img {
    width: 25px;
    height: 15px;
  }
}
</style>

<style lang="scss" scoped>
.dialog-warning-dark-c-container {
  padding-bottom: 20px;
  color: #fff;
  font-size: 15px;
  border-radius: 8px;
  overflow: hidden;
}
.dialog-warning-header-c {
  height: 62px;
  line-height: 62px;
  text-align: center;
  font-size: 15px;
  color: #000;
  background: #f8fcff;
  font-weight: bold;
}
.warning-icon-c {
  padding: 25px;
  padding-top: 25px;
  text-align: center;
}
.warning-text-c {
  text-align: center;
  padding: 0 75px;
  font-size: 14px;
  color: #000;
}
.footer-btns-c {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  margin-top: 20px;
  div {
    padding: 25px;
    text-align: center;
    span {
      display: inline-block;
      width: 100px;
      height: 45px;
      font-size: 12px;
      border-radius: 50px;
      text-align: center;
      line-height: 45px;
      box-sizing: border-box;
      &:first-child {
        color: #000;
        margin-right: 40px;
        border: 1px solid #000;
      }
      &:last-child {
        background-color: #d73a49;
      }
    }
  }
}
.dialog-warning-text {
  color: #848484;
  text-align: center;
  margin-top: 21px;
  line-height: 16px;
  a {
    color: #037cd6;
    &:hover {
      text-decoration: underline;
    }
  }
}
.miners-container-item {
  margin: 25px 12.5px 0 12.5px;
  padding: 17px 15px 0 15px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7e8;
}
.bourse-container-meaning {
  margin-bottom: 16px;
}
.exchange {
  color: #000;
  margin-top: 7px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7e8;
}
.bt {
  border-bottom: none !important;
}
.c1 {
  color: #8f8f8f;
}
.dialog-warning-text-c {
  color: #8f8f8f;
  text-align: center;
  margin: 15px 0;
  font-size: 12px;
}

.slider-enter-active {
  animation: slider-in 0.3s ease-in-out;
}
.slider-leave-active {
  animation: slider-in 0.3s reverse ease-in-out;
}


.confirm-card {
  color: #000;
  min-height: 150px;
  border-radius: 5px;
  border: 1px solid #e4e7e8;
  margin: 15px;
  .gasfee {
    color: #3aae55;
  }
  .card:nth-last-of-type(1) {
    border-bottom: none;
  }
  .card {
    border-bottom: 1px solid #e4e7e8;
    margin: 0 15px;
    padding: 10px 0 10px;
    &-label {
      line-height: 16px;
      color: #8f8f8f;
      :deep(){
        .van-popover__wrapper {
          width: 10px;
          height: 10px;
        }
      }
    }
    &-value {
      line-height: 16px;
      margin-top: 3px;
    }
  }
}

@keyframes slider-in {
  0% {
    transform: translateY(90px);
  }

  100% {
    transform: translateY(0);
  }
}


@media screen and (min-width:750px) {
  .snftcontainer .snftmiddle .snftmiddle-text {
    letter-spacing: 0px;
    font-size: 14px;
  }
}
</style>