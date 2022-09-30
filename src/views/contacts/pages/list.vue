<template>
<van-sticky>
      <NavHeader title="Close" :hasRight="true">
        <template v-slot:title>
          <div class="flex center title">{{t('setting.contacts')}}</div>
        </template>
      </NavHeader>
    </van-sticky>
  <div class="contacts-list">
    <div class="list pt-16">
      <div
        class="
          search-box
          ml-14
          mr-14
          flex
          center-v
          between
        "
      >
        <div class="flex center-v ipt-box pl-10">
          <van-icon name="search hover" />
          <van-field
            v-model="name"
            :placeholder="t('contacts.entername')"
            @input="search"
          ></van-field>
        </div>
        <div
          class="close flex center pr-14 pt-10 pb-10 pl-10"
          v-show="name"
          @click="clear"
        >
          <van-icon name="cross" />
        </div>
      </div>

      <div class="index-list mt-16 mb-30">
        <van-sticky offset-top="48" v-if="contacts.length">
          <div class="sort-box flex right center-v">
            <span class="sort-icon flex center" @click="toggleSort">
              <!-- <i class="iconfont icon-sorting"></i> -->
              <svg
                t="1652000398657"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="27331"
                width="16"
                height="16"
              >
                <path
                  d="M278.74 206l-1.57 1.57V206h1.57zM315.07 101l-1.57 1.57V101h1.57z"
                  :fill="sortType == '1' ? '#037CD6' : '#909090'"
                  p-id="27332"
                ></path>
                <path
                  d="M455.22 873.05h-61.74V151.63h61.74z"
                  :fill="sortType == '1' ? '#037CD6' : '#909090'"
                  p-id="27333"
                ></path>
                <path
                  d="M209.16 424.58v-87.31l184.33-184.32 1.28-1.29 43.66 43.65-44.94 44.95-184.33 184.32z"
                  :fill="sortType == '1' ? '#037CD6' : '#909090'"
                  p-id="27334"
                ></path>
                <path
                  d="M568.11 151.62h61.74v721.42h-61.74z"
                  :fill="sortType == '1' ? '#909090' : '#037CD6'"
                  p-id="27335"
                ></path>
                <path
                  d="M814.17 600.09v87.31L629.85 871.72l-1.29 1.29-43.66-43.66 44.95-44.94 184.32-184.32z"
                  :fill="sortType == '1' ? '#909090' : '#037CD6'"
                  p-id="27336"
                ></path>
              </svg>
            </span>
          </div>
        </van-sticky>
        <ContactsList :indexList="indexList" :contacts="contacts" />
      </div>
      <van-sticky position="bottom" :offset-bottom="30">
        <div class="flex center pl-14 pr-14">
          <van-button type="primary" @click="toAdd" plain block
            >{{ t("contacts.newadd") }}</van-button
          >
        </div>
      </van-sticky>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, reactive } from "vue";
import NavHeader from "@/popup/components/navHeader/index.vue";

import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Dialog,
  IndexBar,
  IndexAnchor,
  Cell,
} from "vant";
import { useRoute, useRouter } from "vue-router";
import { Language, languages } from "@/enum/language";
import { defineComponent, Ref, ref, watch, SetupContext } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import AccountIcon from "@/components/accountIcon/index.vue";
import { getRandomIcon } from "@/utils/index";
import ContactsList from "@/popup/views/contacts/components/contactsList.vue";
import { vantLangs } from "@/language/index";
import { Locale } from "vant";
export default {
  name: "contacts-list",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Field.name]: Field,
    NavHeader,
    [Sticky.name]: Sticky,
    [Cell.name]: Cell,
    AccountIcon,
    ContactsList,
  },
  setup(props: any, context: SetupContext) {
    const { locale,t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { dispatch, state } = store;
    // 1 ascending 2 descending
    const sortType = ref("1");
    const name = ref("");
    const alist = computed(() => {
      // Split into two-dimensional arrays according to the first letter
      const list = state.account.contacts.map((item: any) => item);
      list.sort((a: any, b: any) => {
        if (sortType.value == "1") {
          return (a.name + "").localeCompare(b.name + "");
        } else {
          return (b.name + "").localeCompare(a.name + "");
        }
      });

      const newl = list.filter((item: any) => {
        if (name.value) {
          if (item.name.toUpperCase().indexOf(name.value.toUpperCase()) > -1) {
            return item;
          }
        } else {
          return item;
        }
      });

      const arr: any = [];
      newl.forEach((item: any) => {
        const { name } = item;
        const label = name.substr(0, 1);
        const f = arr.find((child: any) => child.label == label);
        if (f) {
          arr.forEach((sun: any) => {
            sun.label == label ? sun.children.push({ ...item }) : "";
          });
        } else {
          arr.push({ label, children: [{ ...item }] });
        }
      });
      return arr;
    });

    let contacts = alist;

    const indexList = computed(() => {
      return contacts.value.map((item: any) => item.label);
    });

    const clear = () => {
      name.value = "";
    };

    const search = () => {};
    const toAdd = () => {
      router.push({
        name: "contacts-add",
      });
    };

    const { commit } = store;
    const handlerClick = (data: any) => {
      const { backUrl } = route.query;
      if (backUrl) {
        commit("transfer/CHOOSE_CONTACT", data);
        router.replace({ name: backUrl.toString() });
      }
    };

    const toggleSort = () => {
      if (sortType.value == "1") {
        sortType.value = "2";
      } else {
        sortType.value = "1";
      }
    };

    return {
      t,
      name,
      sortType,
      clear,
      search,
      toAdd,
      contacts,
      indexList,
      handlerClick,
      toggleSort,
    };
  },
};
</script>
<style lang="scss" scoped>
.contacts-list {
  * {
    box-sizing: border-box;
  }

  :deep(.van-sticky--fixed) {
    .sort-box {
      max-width: 750px;
      margin: 0 auto;
      position: relative;
    }
    .sort-icon {
      position: inherit;
      top: 0;
    }
  }
  .sort-icon {
    position: absolute;
    padding: 4px;
    right: 6px;
    box-sizing: border-box;
    height: 30px;
    top: 123px;
    z-index: 1000;
    color: #909090;
    cursor: pointer;
  }
  .list {
    // height: calc(100vh - 48px - 16px);
    // overflow-y: scroll;
  }
  .search-box {
    border: 1PX solid #BBC0C5;
    border-radius: 5px;
    &:hover {
      border-color: #037cd6;
    }
  }

  .ipt-box {
    width: 96%;
    i {
      color: #037cd6;
      font-size: 22px;
    }
  }
  .close {
    width: 30px;
    i {
      font-size: 16px;
      color: #037cd6;
    }
  }
}
</style>