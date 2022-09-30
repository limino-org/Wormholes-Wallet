<template>
  <div class="guide-step2" id="guide-step2-page">
    <div class="text-center f-24 title">{{t("createAccountpage.terms")}}</div>
    <div class="text-center f-12 tit-content">{{t("createAccountpage.serviceandPrivacyNotice")}}</div>
    <div class="selection-box">
      <div class="tit terms flex between hover" @click="toservice">
        <div class="f-12">{{t("createAccountpage.service")}}</div>
        <div class="f-12 right-icon">
          <i class="iconfont icon-cuowuguanbiquxiao"  v-if="isShowServiceTrueIcon === 1"></i>
          <i class="iconfont icon-duihao" v-if="isShowServiceTrueIcon === 2"></i>
          <img src="./imgs/right.png" />
        </div>
      </div>
      <div class="tit privacy flex between hover" @click="toprivacy">
        <div class="f-12">{{t("createAccountpage.privacy")}}</div>
        <div class="f-12 right-icon">
                    <i class="iconfont icon-cuowuguanbiquxiao"  v-if="isShowPrivacyTrueIcon === 1"></i>
          <i class="iconfont icon-duihao" v-if="isShowPrivacyTrueIcon === 2"></i>

          <img src="./imgs/right.png" />
        </div>
      </div>
    </div>
    <div class="btn-groups">
      <div class="container pl-28 pr-28 flex between">
        <van-button round block plain type="primary" class="mr-10" @click="toback">{{t("createAccountpage.back")}}</van-button>
        <van-button round block type="primary"  @click="togo">{{t("createAccountpage.continue")}}</van-button>
      </div>
    </div>
  </div>
  <!-- Terms of service -->
  <TermsService  v-model:show="showService" @select="handleSelect" />
  <dialog-warning :text="t('createAccountpage.isServiceandPrivacyNotice')"   v-model:isWarning="isWarning"></dialog-warning>
  <!-- Privacy policy -->
  <PrivacyPolicy  v-model:show="showPrivacy" @select="handleSelect2" />
</template>
<script lang="ts">
import { Icon, Checkbox, Button, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { ref, Ref, computed, toRaw, SetupContext, onMounted, watch } from 'vue'
import TermsService from '@/components/termsservice/index.vue'
import PrivacyPolicy from '@/components/privacypolicy/index.vue'
import dialogWarning from '@/components/dialogWarning/index.vue'
import { useI18n } from 'vue-i18n'
export default {
  name: 'guide-step2',
  components: {
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    TermsService,
    PrivacyPolicy,
    'dialog-warning': dialogWarning,
  },
  setup() {
    const { t } = useI18n()
    const checked = ref(true)
    const checkAll = ref(true)
    const checked1: Ref<boolean> = ref(true)
    const router = useRouter()
    const toback = () => {
      router.push({
        name: 'guidance'
      })
    }
    const togo = () => {
      if (!isShowPrivacyTrue.value) {
          isShowPrivacyTrueIcon.value = 1
          isWarning.value = true
      } else {
          isShowPrivacyTrueIcon.value = 2
      }
      if (!isShowServiceTrue.value) {
          isShowServiceTrueIcon.value = 1
          isWarning.value = true
      } else {
          isShowServiceTrueIcon.value = 2
      }
      if (!isShowPrivacyTrue.value || !isShowServiceTrue.value) {
         return
      }
      if (checkAll.value == false) {
         isWarning.value = true
          return;
      } else {
        router.push({
          name:'newwallet'
          // name: 'create-step'
        })
      }
    }
    //  service
    const showService = ref(false)
    let isShowServiceTrue = ref(false)
    let isShowPrivacyTrue = ref(false)
    let isShowServiceTrueIcon = ref(0)
    let isShowPrivacyTrueIcon = ref(0)
    const toservice = () => {
      console.log('11')
      showService.value =  true
    }
    const isWarning = ref(false)
    const isWarnings = ref(false)
    //  Laws and regulations
    const showPrivacy = ref(false)
    const toprivacy = () => {
      console.log('12')
      showPrivacy.value = true
    }
    const handleSelect = (v: any) => {
      checked.value = v
      isShowServiceTrue.value = v
      isShowServiceTrueIcon.value = v ? 2 : 1
    }
    const handleSelect2 = (v: any) => {
      checked1.value = v
      isShowPrivacyTrue.value = v
      isShowPrivacyTrueIcon.value = v ? 2 : 1
    }
    const handleChange = (v: any) => {
      console.log('change', v)
      if (v) {
        checked.value = true
        checked1.value = true
      } else {
        checked.value = false
        checked1.value = false
      }
    }


 
    return {
      isWarning,
      isWarnings,
      isShowServiceTrue,
      isShowPrivacyTrue,
      t,
      checked1,
      checked,
      toback,
      checkAll,
      handleChange,
      togo,
      toservice,
      toprivacy,
      showService,
      showPrivacy,
      handleSelect,
      handleSelect2,
      isShowPrivacyTrueIcon,
      isShowServiceTrueIcon
    }
  }
}
</script>
<style lang='scss' scoped >
.guide-step2 {
  .title {
    font-weight: 700;
    padding-top: 77px;
  }
  .tit-content {
    color: #b3b3b3;
    margin-top: 10px;
  }
  .selection-box {
    height: 160px;
    // width: 318px;
    border: 1px solid #e4e7e8;
    margin: 22px 27px;
    .tit {
      color: #037cd6;
      height: 80px;
      line-height: 80px;
      padding-right: 15px;
      padding-left: 15px;
    }
    .terms {
      position: relative;
      &::after {
        display: block;
        content: '';
        position: absolute;
        height: 1px;
        border-bottom: 1px solid #e4e7e8;
        left: 17.5px;
        right: 17.5px;
        bottom: 0;
      }
    }
  }
  .tit-small {
    color: #b3b3b3;
  }
  .form-button {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    button {
      margin: 20px;
    }
  }
  .check {
    margin-top: 26px;
    margin-left: 27px;
  }
  img {
    width: 20px;
    margin-left: 10px;
  }
  .right-icon {
    display: flex;
    align-items: center;
    .icon-cuowuguanbiquxiao {
      color: #D73A49;
      font-size: 18px;
    }
    .icon-duihao {
      color: rgb(58, 174, 85);
    }
  }
}
</style>