<template>
    <NavHeader :hasLeft="false">
      <template v-slot:title>
        <div class="flex center title">{{t('wallet.wormHoles')}}</div>
      </template>
    </NavHeader>
  <div class="loading-bg pt-24 pb-24">
    <div class="tit-big text-center f-16">{{t('createAccountpage.creating')}}</div>
  <div class="loading pt-28 ">
     <van-progress :percentage="percentage" stroke-width="5" />
  </div>
  </div>
  <div class="icon-box flex center">
    <div class="iconele flex center" :style="{backgroundImage: `url(${require('@/views/guidance/imgs/circle.png')})`}">
      <div class="iconinner flex center" :style="{backgroundImage: `url(${require('@/views/guidance/imgs/circle1.png')})`}">
        <img src="./imgs/11111.png" alt="" >
      </div>
    </div>
  </div>
  <div class="tip">
    <div class="lh-30 text-bold text-center f-21 mt-8 mb-16">{{t('createAccountpage.congratulations')}}</div>
    <i18n-t keypath="createAccountpage.successfullyCreated" tag="div" class="f-12 lh-16 tip-info text-center">
      <template v-slot:br><br></template>
    </i18n-t>

  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Icon, Toast, Button,Progress  } from "vant";
import { ref, Ref, computed, toRaw, SetupContext, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NavHeader from '@/components/navHeader/index.vue'
export default {
  name: "loginAccount-create-step2",
  components: {
    [Button.name]: Button,
    [Progress.name]:Progress,
    NavHeader
  },
  setup(){
    const router = useRouter()
    const percentage = ref(0)
    const {t} = useI18n()
    let setValue = setInterval(() => {
      if (percentage.value < 100) {
        percentage.value += 1
      }
      if (percentage.value === 100) {
        clearInterval(setValue)
        setTimeout(() => {
          debugger
          router.push({
            name: 'startpage'
          })
        }, 500)
      }
    })
    return {
      percentage,
      t
    };
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
    color: #000;
  font-weight: bold;
}
.loading-bg {
  background: #F8F3F9;
  height: 90px;
  .tit-big {
    line-height: 21px;
  }
  .loading{
    margin: 0 62px;
  }
  
}
.icon-box {
  margin-top: 50px;
  .iconele {
    width: 175px;
    height: 175px;
    border-radius: 50%;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: left 0 top 0 right 0 bottom 0;
    .iconinner {
      width: 110px;
      height: 110px;
          background-size: cover;
    background-repeat: no-repeat;
    background-position: left 0 top 0 right 0 bottom 0;

      img {
        display: block;
        width: 40%;
      }
    }
  }
}
.tip-info {
  width: 255px;
  margin: 0 auto;
  color: #848484;

}
</style>