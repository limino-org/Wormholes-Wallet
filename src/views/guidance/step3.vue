
<template>
  <div v-if="showModal" class="custom-popover">
    <div class="custom-popover-header">
      <div class="footer-btns">
        <div class="container pl-20 pr-20 evenly flex">
          <span @click="dispatchClose">{{t('common.cancel')}}</span>
          <span @click="handleClick(3)">{{t('common.next')}} 3/6</span>
        </div>
      </div>
      <div class="footer-text">
        <div>
          {{t('common.nftN')}}
        </div>
      </div>
    </div>
    <div class="custom-popover-container">
      <div :class="`snftcontainer `" v-for="(item, i) in list" :key="i">
      <div class="snftcontainer_left">

        <div class="snftcontainer_left_container">
          <div class="img-p">
            <van-image
              :src="`https://www.wormholestest.com${item.source_url}`"
              fit="cover"
              alt=""
              class="snftimg"
            />
            <!-- <div class="number" :style="{ background: item.color }">
              {{ item.number }}
            </div> -->
          </div>
          <div class="snftmiddle flex column between" >
            <div class="flex between center-v snftName h-14 text-weight">
              <span class="f-14 lh-12 hover flex center-v"  >
                {{ item.collections }}-<span class="red"></span>
                <span class="nft-p">{{item.pidx}}</span>
                <span class="nft-c" v-if="item.cidx !== undefined">{{item.cidx}}</span>
                <span class="nft-n"  v-if="item.nidx !== undefined">{{item.nidx}}</span>
                <span class="nft-f" v-if="item.fidx !== undefined">{{item.fidx}}</span>
                </span
              >
              <van-icon name="arrow"  />

            </div>
            <div class="snftleftcolleaddre flex center-v">
              <span class="snftmiddle-text">{{ item.nft_address }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="custom-popover-footer">
    </div>
  </div>
  <dialog-warning @warningSuccess="warningSuccess" theme="light"  @close="handleClose"  :text="t('common.confirmExit')"  v-model:isWarning="isWarning"></dialog-warning>

</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed, onMounted, onBeforeMount } from "vue";
import { Popover, Dialog, Button } from "vant";
import WormTransition from "@/components/wromTransition/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import dialogWarning from '@/components/dialogWarning/indexAffirm.vue'
import eventBus from "@/utils/bus";
import { nextTick } from "process";
export default defineComponent({
  name: 'guide-modal2',
    components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    WormTransition,
    'dialog-warning': dialogWarning
  },
  props: {
    type: {
      type: Number,
      default: 3,
    },
  },
  setup(props: any, context: SetupContext) {
    
    const { t }=useI18n()
    const { state, dispatch } = useStore();
    const showModal = ref(false);
    const show3 = computed(() => state.system.show3);
    const list = ref([
      {},
      {},
      {},
      {}
    ])
    watch(
      () => show3,
      (n) => {
        if(n){
          eventBus.emit('guideSnftModal',1)
        }
        showModal.value = n.value
      },
      { immediate: true, deep: true }
    );

    const handleClick = (v: number) => {
      dispatch("system/showDialog", v);
    };
    const warningSuccess = () => {
      dispatch('system/closeGuide')
      showModal.value = false
      isWarning.value = false
    }
    const beforeClose = async () => {
      const flag = await Dialog.confirm({
        message: t('bootstrapwindow.unboot'),
                  className:"closeGuideModal",

      })
        .then(() => true)
        .catch(() => false);
        console.log('flag', flag)
        if(flag) {
          dispatch('system/closeGuide')
          showModal.value = false
        }
    };
    const isWarning = ref(false)
    const dispatchClose = () => {
      isWarning.value = true
      showModal.value = false
    }
    const handleClose = () => {
      showModal.value = true
    }
    // onMounted(() => {
    //   let time = setTimeout(() => {
    //       eventBus.emit('guideSnftModal',1)
    //       clearTimeout(time)
    //   },1000)
    // })
    return {
      t,
      // show2,
      handleClick,
      handleClose,
      showModal,
      beforeClose,
      dispatchClose,
      warningSuccess,
      isWarning,
      list
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-popover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
}
.custom-popover-header {
  height: 308px;
  background-color: rgba(0, 0, 0, .7);
  position: relative;
}
.footer-text {
  position: absolute;
  font-size: 12px;
  color: #fff;
  bottom: 82px;
  left: 50%;
  width: 50%;
  div {
    display: inline-block;
    transform: translateX(-50%);
    &:before {
        content: "";
        position: absolute;
        bottom: -42px;
        left: -20px;
        width: 75px;
        display: inline-block;
        z-index: 999999;
        transform: rotate(90deg);
        border-top: 1px dotted #037cd6;
      }
    &:after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 16px;
      width: 4px;
      height: 4px;
      background-color: #037CD6;
      border-radius: 50%;
      display: inline-block;
      z-index: 999999;
    }
  }
}
.custom-popover-container {
  padding-top: 80px;
  img {
      width: 100%;
  }
}
.custom-popover-footer {
  position: relative;
  height: calc(100% - 308px - 350px);
  background-color: rgba(0, 0, 0, .7);
}
.footer-btns {
  width: 100%;
  padding-top: 100px;
  div {
    span {
      cursor: pointer;
    display: inline-block;
    width: 100px;
    height: 45px;
    font-size: 12px;
          cursor: pointer;

    border-radius: 50px;
    text-align: center;
    line-height: 45px;
    color: #fff;
    box-sizing: border-box;
    &:first-child {
      border: 1px solid #fff;
      margin-right: 40px;
    }
    &:last-child {
      background-color: #037cd6;
    }
  }
  }
}

.dialog-box {
  // width: 340px;
  padding-bottom: 25px;
    .serial-number{
     display: flex;
     justify-content: flex-end;
     text-indent: 10px;
     padding-bottom: 14px;
     padding-right: 14px;
     font-size: 12px;
     font-size: 12px;
     .left{
       color: #037CD6;
      }
   }
  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-top: 44px;
  }
  .small-tit {
    text-align: center;
    margin-bottom: 50px;
    font-size: 12px;
    color: #848484;
  }
  :deep {
    button {
      min-width: 100px;
    }
  }
  :deep(.van-popover__wrapper) {
    height: 0;
  }
}
</style>
<style scoped lang="scss">
.snftcontainer {
height: 67px;
padding: 0px 10px 0 15px;
border-bottom: 1px solid #E4E7E8;
background: #fff;
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
  &.disabled {
    cursor: not-allowed;
  }
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
}</style>