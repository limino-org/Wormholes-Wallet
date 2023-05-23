<template>
    <div :class="creator">
      <NavHeader :title="t('sidebar.snftCreator')" :has-right="false">
        <template v-slot:left>
          <span class="back" @click="appProvide.back">{{
            t("common.back")
          }}</span>
        </template>
      </NavHeader>
      <div>
        <WormholesTransition size="small">
          <template v-slot:icon>
            <img
              class="iconele flex center"
              src="@/assets/token/logowallet.png"
            />
          </template>
        </WormholesTransition>
      </div>
      <div class="text-center f-24 text-bold mt-10">
        {{ t("sidebar.snftCreator") }}
      </div>
      <div class="form">
        <div class="card">
          <div class="c-top">
            <div class="label">
              {{ t("creatorSnft.labelPeriod") }}
              <van-popover
                class="creatorSnftPopover"
                v-model:show="showPopup"
                theme="dark"
                :placement="`${pageType == 'Popup' ? 'bottom-start' : 'right'}`"
              >
                <p class="pl-10 pr-10">{{ t("creatorSnft.totalPeriod") }}</p>
                <template #reference>
                  <van-icon
                    name="question hover"
                    @mouseover="showPopup = true"
                    @mouseleave="showPopup = false"
                  />
                </template>
              </van-popover>
            </div>
          </div>
          <div class="c-bottom">{{ creatorStatus.count }}</div>
        </div>
        <div class="card">
          <div class="c-top">
            <div class="label">
              {{ t("creatorSnft.labelProfit") }}
              <van-popover
                class="creatorSnftPopover"
                v-model:show="showPopup1"
                theme="dark"
                :placement="`${pageType == 'Popup' ? 'bottom-start' : 'right'}`"
              >
                <p class="pl-10 pr-10">{{ t("creatorSnft.totalProfit") }}</p>
                <template #reference>
                  <van-icon
                    name="question hover"
                    @mouseover="showPopup1 = true"
                    @mouseleave="showPopup1 = false"
                  />
                </template>
              </van-popover>
            </div>
          </div>
          <div class="c-bottom">{{ creatorStatus.profitStr }} ERB</div>
        </div>
        <div class="card">
          <div class="c-top">
            <div class="label">
              {{ t("creatorSnft.labelTimes") }}
  
              <van-popover
                v-model:show="showPopup2"
                class="creatorSnftPopover"
                theme="dark"
                :placement="`${pageType == 'Popup' ? 'bottom-start' : 'right'}`"
              >
                <p class="pl-10 pr-10">{{ t("creatorSnft.totalTimes") }}</p>
                <template #reference>
                  <van-icon
                    name="question hover"
                    @mouseover="showPopup2 = true"
                    @mouseleave="showPopup2 = false"
                  />
                </template>
              </van-popover>
            </div>
          </div>
          <div class="c-bottom">{{ creatorStatus.count }}</div>
        </div>
        <div class="card">
          <div class="c-top">
            <div class="label">
              {{ t("creatorSnft.labelAward") }}
  
              <van-popover
                v-model:show="showPopup3"
                class="creatorSnftPopover"
                theme="dark"
                :placement="`${pageType == 'Popup' ? 'bottom-start' : 'right'}`"
              >
                <p class="pl-10 pr-10">{{ t("creatorSnft.totalAward") }}</p>
                <template #reference>
                  <van-icon
                    name="question hover"
                    @mouseover="showPopup3 = true"
                    @mouseleave="showPopup3 = false"
                  />
                </template>
              </van-popover>
            </div>
          </div>
          <div class="c-bottom">{{ creatorStatus.rewardEth }} ERB</div>
        </div>
        <div class="card">
          <div class="c-top">
            <div class="c-top">
              <div class="label">
                {{ t("creatorSnft.labelWeight") }}
                <van-popover
                  v-model:show="showPopup4"
                  class="creatorSnftPopover"
                  theme="dark"
                  :placement="`${pageType == 'Popup' ? 'bottom-start' : 'right'}`"
                >
                  <p class="pl-10 pr-10">{{ t("creatorSnft.totalWeight") }}</p>
                  <template #reference>
                    <van-icon
                      name="question hover"
                      @mouseover="showPopup4 = true"
                      @mouseleave="showPopup4 = false"
                    />
                  </template>
                </van-popover>
              </div>
            </div>
          </div>
          <div class="c-bottom">{{ creatorStatus.weight }}</div>
        </div>
      </div>
      <div class="text-center pl-30 pr-30 creatorTip">
          <i18n-t tag="div" keypath="creatorSnft.tip" class="lh-16">
              <template v-slot:link1><a :href="exchangeUrl" target="_blank" class="link" rel="noopener noreferrer">{{ t('creatorSnft.exchange') }}</a></template>
              <template v-slot:link2><a :href="browserurl" target="_blank" class="link" rel="noopener noreferrer">{{ t('creatorSnft.browser') }}</a></template>
          </i18n-t>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { computed, defineComponent, inject, InjectionKey, onMounted, ref } from "vue";
  import NavHeader from "@/components/navHeader/index.vue";
  import { useI18n } from "vue-i18n";
  import WormholesTransition from "@/components/wromTransition/index.vue";
  import { AppProvide } from "@/provides/app";
  import { Icon as VanIcon, Popover as vanPopover } from "vant";
  import { VUE_APP_EXCHANGES_URL, VUE_APP_SCAN_URL } from "@/enum/env";
  import { useStore } from "vuex";
  const {state,dispatch} = useStore()
  const appProvide = inject<AppProvide>("appProvide");
  const accountInfo = computed(() => state.account.accountInfo)
  const { t } = useI18n();
  const showPopup = ref(false);
  const showPopup1 = ref(false);
  const showPopup2 = ref(false);
  const showPopup3 = ref(false);
  const showPopup4 = ref(false);
  const exchangeUrl = `${VUE_APP_EXCHANGES_URL}/c0x97807fd98c40e0237aa1f13cf3e7cedc5f37f23b/#/assets`
  const browserurl = `${VUE_APP_SCAN_URL}AccountDetail/${accountInfo.value.address}`
  
  const creatorStatus = computed(() => state.account.creatorStatus || {})
  onMounted(() => {
    dispatch('account/getCreatorStatus', state.account.accountInfo.address)
  })
  
  // @ts-ignore
  const pageType = window.pageType
  </script>
  
  <style lang="scss" scoped>
  .iconele {
    width: 16px;
    height: 16px;
  }
  .creatorTip {
      color: #B3B3B3;
      .link {
          color: #9F54BA;
          text-decoration: underline;
          display: inline-block;
      }
  }
  .form {
    border: 1px solid #e4e7e8;
    border-radius: 5px;
    min-height: 230px;
    margin: 20px 15px;
    .card {
      &:last-of-type {
        border-bottom: none;
      }
      border-bottom: 1px solid #e4e7e8;
      margin: 0 13px;
      padding: 14px 0;
      font-size: 14px;
      .c-top {
        color: #a3a3a3;
      }
      .c-bottom {
        line-height: 12px;
        margin-top: 5px;
      }
    }
  }
  .creator {
    &.Popup {
      :deep(){
        .icon-box {
          margin-top: 20px;
        }
      }
    }
  }
  </style>