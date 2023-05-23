<template>
  <!-- <van-sticky>
    <NavHeader title="Close" :hasLeft="false">
      <template v-slot:title>
        <div class="flex center title">{{ t("setting.contacts") }}</div>
      </template>
    </NavHeader>
  </van-sticky> -->
  <div class="contacts-list">
    <div class="list">
      <!-- <div class="search-box ml-14 mr-14 flex center-v between">
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
      </div> -->
      <van-tabs
        v-model:active="active"
        class="mt-10"
        shrink
        sticky
        offset-top="48"
      >
        <van-tab :title="t('contacts.tab_contacts')">
          <div class="index-list mb-30" v-if="contacts3.length">
            <van-sticky offset-top="94" v-if="contacts3.length">
              <div class="sort-box flex right center-v">
                <span class="sort-icon flex center" @click="toggleSort(3)">
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
                      :fill="sortType3 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27332"
                    ></path>
                    <path
                      d="M455.22 873.05h-61.74V151.63h61.74z"
                      :fill="sortType3 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27333"
                    ></path>
                    <path
                      d="M209.16 424.58v-87.31l184.33-184.32 1.28-1.29 43.66 43.65-44.94 44.95-184.33 184.32z"
                      :fill="sortType3 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27334"
                    ></path>
                    <path
                      d="M568.11 151.62h61.74v721.42h-61.74z"
                      :fill="sortType3 == '1' ? '#909090' : '#9F54BA'"
                      p-id="27335"
                    ></path>
                    <path
                      d="M814.17 600.09v87.31L629.85 871.72l-1.29 1.29-43.66-43.66 44.95-44.94 184.32-184.32z"
                      :fill="sortType3 == '1' ? '#909090' : '#9F54BA'"
                      p-id="27336"
                    ></path>
                  </svg>
                </span>
              </div>
            </van-sticky>

            <ContactsList
              :indexList="indexList3"
              :contacts="contacts3"
              :offsetTop="46"
            />
          </div>
          <no-data v-else />
        </van-tab>
        <van-tab :title="t('contacts.tab_recents')">
          <div class="index-list mb-30" v-if="contacts2.length">
            <van-sticky offset-top="94" v-if="contacts2.length">
              <div class="sort-box flex right center-v">
                <span class="sort-icon flex center" @click="toggleSort(2)">
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
                      :fill="sortType2 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27332"
                    ></path>
                    <path
                      d="M455.22 873.05h-61.74V151.63h61.74z"
                      :fill="sortType2 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27333"
                    ></path>
                    <path
                      d="M209.16 424.58v-87.31l184.33-184.32 1.28-1.29 43.66 43.65-44.94 44.95-184.33 184.32z"
                      :fill="sortType2 == '1' ? '#9F54BA' : '#909090'"
                      p-id="27334"
                    ></path>
                    <path
                      d="M568.11 151.62h61.74v721.42h-61.74z"
                      :fill="sortType2 == '1' ? '#909090' : '#9F54BA'"
                      p-id="27335"
                    ></path>
                    <path
                      d="M814.17 600.09v87.31L629.85 871.72l-1.29 1.29-43.66-43.66 44.95-44.94 184.32-184.32z"
                      :fill="sortType2 == '1' ? '#909090' : '#9F54BA'"
                      p-id="27336"
                    ></path>
                  </svg>
                </span>
              </div>
            </van-sticky>
            <ContactsList
              :indexList="indexList2"
              :contacts="contacts2"
              :offsetTop="46"
            />
          </div>
          <no-data v-else />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, reactive } from "vue";
import NavHeader from "@/components/navHeader/index.vue";

import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Dialog,
  IndexBar,
  IndexAnchor,
  Tabs,
  Empty,
  Tab,
  Cell,
} from "vant";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, Ref, ref, watch, SetupContext } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import AccountIcon from "@/components/accountIcon/index.vue";
import ContactsList from "@/views/contacts/components/contactsList.vue";

export default {
  name: "contacts-choose-list",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Field.name]: Field,
    NavHeader,
    [Sticky.name]: Sticky,
    [Cell.name]: Cell,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    AccountIcon,
    ContactsList,
  },
  setup(props: any, context: SetupContext) {
    const { locale, t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { dispatch, state } = store;
    // 1 ascending 2 descending
    const sortType = ref("1");
    const active = '1'
    const name = ref("");
    const accountInfo = computed(() => state.account.accountInfo);
    // recent contacts
    const sortType2 = ref("1");
    const alist2 = computed(() => {
      // Split into two-dimensional arrays according to the first letter
      const list = state.account.recentList.filter(
        (item: any) =>
          item.address.toUpperCase() != accountInfo.value.address.toUpperCase()
      );
      list.sort((a: any, b: any) => {
        if (sortType2.value == "1") {
          return a.name.split(' ')[1] - b.name.split(' ')[1]
        } else {
          return b.name.split(' ')[1] - a.name.split(' ')[1]
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

    let contacts2 = alist2;

    const indexList2 = computed(() => {
      return contacts2.value.map((item: any) => item.label);
    });

    // My account
    const sortType3 = ref("1");
    const alist3 = computed(() => {
      // Split into two-dimensional arrays according to the first letter
      const list = state.account.accountList.filter(
        (item: any) =>
          item.address.toUpperCase() != accountInfo.value.address.toUpperCase()
      );
      list.sort((a: any, b: any) => {
        const [str1, idx] = a.name.split(' ')
          const [str2, idx2]  = b.name.split(' ')
          console.warn('idx, idx2', idx, idx2)
        if (sortType3.value == "1") {
          return a.name.split(' ')[1] - b.name.split(' ')[1]
        } else {
          return b.name.split(' ')[1] - a.name.split(' ')[1]
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

    let contacts3 = alist3;

    const indexList3 = computed(() => {
      return contacts3.value.map((item: any) => item.label);
    });

    const clear = () => {
      name.value = "";
    };

    const search = () => {};

    const { commit } = store;
    const handlerClick = (data: any) => {
      const { backUrl } = route.query;
      if (backUrl) {
        commit("transfer/CHOOSE_CONTACT", data);
        router.replace({ name: backUrl.toString() });
      }
    };

    // sort
    const toggleSort = (type: number) => {
      if (type == 1) {
        if (sortType.value == "1") {
          sortType.value = "2";
        } else {
          sortType.value = "1";
        }
      }
      if (type == 2) {
        if (sortType2.value == "1") {
          sortType2.value = "2";
        } else {
          sortType2.value = "1";
        }
      }
      if (type == 3) {
        if (sortType3.value == "1") {
          sortType3.value = "2";
        } else {
          sortType3.value = "1";
        }
      }
    };
    return {
      name,
      sortType,
      clear,
      search,

      sortType2,
      sortType3,
      alist3,
      alist2,
      indexList2,
      indexList3,
      contacts3,
      contacts2,
      handlerClick,
      toggleSort,
      t,
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(){
  .van-cell {
    padding: 0 10px;
    .van-field__body {
    padding: 0;
    border: none;
    }

  }
}
:deep(.van-tab) {
  height: 46px;
  padding: 0;
  margin-right: 20px;
}
:deep(.van-tabs__nav--line) {
  padding-bottom: 0;
  padding-left: 14px;
  padding-right: 14px;
}
:deep(.van-tabs--line .van-tabs__wrap) {
  height: 46px !important;
}
:deep(.van-tab--active) {
  color: #9F54BA;
}
:deep(.van-tabs__line) {
  display: none;
}
:deep(.van-tab__text) {
  border-bottom: 2px solid #fff;
  line-height: 14px;
  font-size: 12px;
  color: #000;
}
:deep(.van-tab--active .van-tab__text) {
  border-bottom: 1px solid #9F54BA;
  color: #9F54BA;
}
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
    top: 46px;
    z-index: 1000;
    color: #909090;
    cursor: pointer;
  }
  .list {
    // height: calc(100vh - 48px - 16px);
    // overflow-y: scroll;
  }
  .search-box {
    border: 1px solid #bbc0c5;
    border-radius: 5px;
    &:hover {
      border-color: #9F54BA;
    }
  }

  .ipt-box {
    width: 96%;
    i {
      color: #9F54BA;
      font-size: 22px;
    }
  }
  .close {
    width: 30px;
    i {
      font-size: 16px;
      color: #9F54BA;
    }
  }
}
</style>