<template>
  <div class="m-page">
    <div class="mnemonic-bg pt-24 pb-24">
      <div class="tit-big text-center f-16">
        {{ t("mnemonic.verifyMnemonicPhrase") }}
      </div>
      <div class="flex center">
        <div class="tit-small text-center f-12 mt-10 lh-16">
          {{ t("mnemonic.protectYourFunds") }}
        </div>
      </div>
      <div class="flex center">
        <div class="color-p text-center f-12 lh-16">
          {{ t("mnemonic.correctOrder") }}
        </div>
      </div>
    </div>
    <div class="tip pl-14 pr-14 pb-14 van-hairline--surround flex">
      <div
        :class="`tip-card clickActive mt-16 f-12 flex van-hairline--surround  ${
          item.status ? 'error' : ''
        }`"
        v-for="(item, idx) in chooseList.data"
        :key="idx"
      >
        <div :class="`icon lh-24 van-hairline--surround text-center`">
          <span v-if="!item.status">
            {{ idx + 1 }}
          </span>
          <van-icon @click="clearKey(item, idx)" v-else name="cross" />
        </div>
        <div class="word lh-24 text-center van-ellipsis">{{ item.name }}</div>
      </div>
    </div>
    <div class="tip tip-2 pl-14 pr-14 pb-14 van-hairline--surround flex">
      <div
        class="tip-card h-24 clickActive mt-16 f-12 flex van-hairline--surround"
        v-for="(item, idx) in list.data"
        :key="idx"
        @click="sort(item, idx)"
      >
        <div class="word lh-24 text-center van-ellipsis">{{ item.name }}</div>
      </div>
    </div>

    <div class="warn f-12 lh-16 pl-30 pr-30" v-show="errorFlag">
      {{ t("mnemonic.errorMessage") }}
    </div>

    <div class="btn-groups">
      <div class="container  pl-28 pr-28">
        <van-button type="primary" @click="next" block>{{
          t("mnemonic.continue")
        }}</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, onMounted, reactive } from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { getCookies } from "@/utils/jsCookie";
import { parseMnemonic } from "@/utils/web3";
import { randArr } from "@/utils/utils";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStore } from 'vuex';
import localforage from 'localforage';

export default {
  name: "mnemonic-step3",
  components: {
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore()
    debugger
    // Unsorted
    const list = reactive({
      data: [],
    });
    // Sequenced
    const chooseList: any = reactive({
      data: [],
    });
    // Correct sequence
    const realList = reactive({ data: [] });
    const sort = (item: any, index: number) => {
      // If all are filled, or one is wrong, you can't continue to choose
      const flag = chooseList.data.find((item: any) => item.name == "");
      const flag2 = chooseList.data.find((item: any) => item.status);
      if (flag && !flag2) {
        chooseList.data.some((c: any, idx: number) => {
          if (c.name == "") {
            let status = false;
            // @ts-ignore
            if (realList.data[idx].name != item.name) {
              //    Compared with the real mnemonic, if the error status is set to true, otherwise it is false
              status = true;
            }
            chooseList.data[idx] = {
              name: item.name,
              status,
              preIndex: index,
            };
            list.data[index] = {
              // @ts-ignore
              name: "",
            };
            return true;
          }
        });
      } else {
        Toast(t("mnemonic.tryagain"));
      }
    };

    const errorFlag = computed(() => {
      return chooseList.data.find((item: any) => item.status);
    });
    // Clear key
    const clearKey = (item: any, idx: number) => {
      const { name, preIndex } = item;
      chooseList.data[idx] = {
        name: "",
        status: false,
      };
      list.data[preIndex] = {
        // @ts-ignore
        name,
      };
    };
    const keyStore = computed(() => store.state.mnemonic.keyStore)

    onMounted(async () => {
      // const mnemonicJson = await localforage.getItem('mnemonic')
      // Get the decrypted mnemonic
      const password = getCookies("password");
      const realmm = await parseMnemonic(password, keyStore.value);
      // Correct sorting
      const nlist = realmm
        .split(" ")
        .map((key: string) => ({ name: key, status: false }));
      // @ts-ignore
      realList.data = [...nlist];
      const llist = [...randArr(nlist)];
      // Disorder
      // @ts-ignore
      list.data = llist;
      llist.forEach((item, idx: number) => {
        chooseList.data[idx] = { name: "", status: false };
      });
    });

    const next = () => {
      const flag = chooseList.data.find((item: any) => !item.name);
      if (flag) {
        Toast(t("mnemonic.checkthemnemonic"));
        return;
      }
      router.push({ name: "mnemonic-backupSuccessful" });
    };
    return {
      t,
      list,
      chooseList,
      realList,
      clearKey,
      sort,
      errorFlag,
      next,
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
  .color-p {
    color: #037cd6;
  }
}
.icon-box {
  .iconele {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.warn {
  color: #d73a49;
}
.tip {
  width: 320px;
  margin: 30px auto;
  box-sizing: border-box;
  min-height: 100px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  &:after {
    border-radius: 4px;
  }
  &-card {
    width: 90px;
    background: #f4faff;
    color: #037cd6;
    transition: ease 0.3s;
    border-radius: 12px;
    &:hover {
      background: #cae5fc;
    }
    &.error {
      &:after,
      .icon:after {
        border-color: #d73a49;
      }
      .icon {
        background: #d73a49;
      }
      i:hover {
        color: #fff;
      }
      .word {
        color: #d73a49;
      }
    }
    .icon {
      width: 24px;
      height: 24px;
      background: #037cd6;
      border-radius: 50%;
      color: #fff;
      &.error {
        background: #d73a49;
      }
    }
    .word {
      width: calc(90px - 26px);
    }
    &:after,
    .icon:after {
      border-color: #037cd6;
      border-radius: 45px;
    }
  }
}
.tip-2 {
  margin-bottom: 15px !important;
  .tip-card .word {
    width: 100% !important;
  }
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