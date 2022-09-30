<template>
  <div class="m-page">
    <div class="mnemonic-bg pt-24 pb-24">
      <div class="tit-big text-center f-16">
        {{ t("mnemonic.hint") }}
      </div>
      <div class="flex center">
        <div class="tit-small text-center f-12 mt-10 lh-16">
          {{ t("mnemonic.tips") }}
        </div>
      </div>
    </div>
    <div class="icon-box flex center">
      <div
        class="iconele flex center"
        :style="{
          backgroundImage: `url(${require('@/views/mnemonic/imgs/circle.png')})`,
        }"
      >
        <div
          class="iconinner flex center"
          :style="{
            backgroundImage: `url(${require('@/views/mnemonic/imgs/circle2.png')})`,
          }"
        >
          <img src="./../imgs/lock.png" alt="" />
        </div>
      </div>
    </div>
    <div class="tip">
      <div class="lh-20 text-center f-14 mt-8 mb-16">
        {{ t("mnemonic.yourRecoveryPhrase") }}
      </div>
      <div class="f-12 lh-16 tip-info text-center">
        {{ t("mnemonic.yourRecoveryPhraseTitle") }}
      </div>
      <div class="f-12 lh-16 tip-info text-center mt-16">
        {{ t("mnemonic.protectYourFunds") }}
      </div>
    </div>

    <div class="flex center h-30 mt-16">
      <span class="remind f-12 lh-16 hover" @click="remindLater">
        {{ t("mnemonic.remindMeLater") }}
      </span>
    </div>
    <div class="btn-groups">
      <div class="container flex center pl-28 pr-28">
        <van-button type="primary" block @click="toStep2">
          {{ t("mnemonic.backUp") }}
        </van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default {
  name: "mnemonic-step1",
  components: {
    [Button.name]: Button,
    [Sticky.name]: Sticky,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { commit } = useStore();
    const toStep2 = () => {
      router.push({ name: "mnemonic-step2" });
    };
    commit("system/UPDATE_LASTDELAYTIME", new Date().getTime());
    const remindLater = () => {
      router.replace({ name: "wallet" });
    };
    return {
      t,
      toStep2,
      remindLater,
    };
  },
};
</script>
<style lang="scss" scoped>
.mnemonic-bg {
  background: rgba(244, 250, 255, 1);
  .tit-big {
    line-height: 21px;
  }
  .tit-small {
    width: 290px;
    color: rgba(132, 132, 132, 1);
  }
}
.icon-box {
  margin-top: 50px;
  .iconele {
    width: 175px;
    height: 175px;
    border-radius: 50%;
    overflow: hidden;
    // background: url('/@/popup/views/mnemonic/imgs/circle.png') left 0 right 0 top 0 bottom 0 no-repeat ;
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
.remind {
  font-weight: bold;
  color: #000;
  text-decoration: underline;
}
.btn-group {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
}
.m-page {
  padding-bottom: 100px;
}
</style>