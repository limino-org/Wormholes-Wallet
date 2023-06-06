<template>
  <div class="loading-bg pt-24 pb-24">
    <div class="tit-big text-center f-16">Create NFT</div>
    <div class="flex center mt-20">
      <div class="step2 f-12 lh-16">1</div>
      <span class="dotted-line "></span>
      <div class="step3 f-12 lh-16">2</div>
      <span class="dotted-line2  "></span>
      <div class="step3 f-12 lh-16">3</div>
    </div>
    <div class="flex evenly f-12 pr-20 pl-20 ">
      <div class="tit-small now">Upload</div>
      <div class="tit-small no">Information</div>
      <div class="tit-small no">Done</div>
    </div>
  </div>
<div class="text-center content  ">
   <van-uploader  v-model="fileList" preview-size="256"  multiple :max-count="1" />
</div>
  <div class="text-center lh-16 copywriting tit-small f-12 ">
     Click upper area to upload Recommended size: 500px * 500px Supported format: PNG, size: within 1m
  </div>
  <div style="margin: 24px 16px">
    <van-button type="primary" :disabled="disabled" block @click="handleNext">Next</van-button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Icon, Toast, Button,Tab, Tabs,Uploader,Form, Field, CellGroup,Dialog,Step,Steps  } from "vant";
import { ref, Ref, computed, toRaw, SetupContext, onMounted } from 'vue'
import { useRouter } from 'vue-router';

export default {
  name: "createNft-step1",
  components: {
    [Button.name]: Button,
    [Tab.name]:Tab,
    [Tabs.name]:Tabs,
    [Uploader.name]:Uploader,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Dialog.Component.name]: Dialog.Component,
    [Step.name]:Step,
    [Steps.name]:Steps,
  },
  setup(){
    const router = useRouter()
     const active = ref(0);
    const fileList: any = ref([]);
    const disabled = computed(() => {
      const len = fileList.value.length;
      if(len){
        return false
      }
        return true
    })

    const handleNext = () => {
      const img = fileList.value[0].content
      sessionStorage.setItem('createNft-step1', img)
      router.push({name:'createNft-step2'})
    }
    return { 
      active,
      fileList,
      disabled,
      handleNext
     };
  }
};
</script>
<style lang="scss" scoped>
.loading-bg {
  background: #F8F3F9;
  height: 135px;
  .tit-big {
    line-height: 21px;
  }
  .step{
    width: 17px;
    height: 17px;
    background-color: #9F54BA;
    color: #fff;
    text-align: center;
    border-radius: 50%;
  }
  .step2{
    width: 17px;
    height: 17px;
    background-color: #68B1E6;
    color: #fff;
    text-align: center;
    border-radius: 50%;
  }
  .step3{
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1PX solid #B3B3B3;
    color: #B3B3B3;
    text-align: center;
    border-radius: 50%;
  }
 .dotted-line{
      margin-top: 2px;
      text-align: center;
      width: 80px;
      height: 0px;
      border: 1PX dashed #000000;
      transform: scale(0.8);
    }
     .dotted-line2{
      margin-top: 2px;
      text-align: center;
      width: 80px;
      height: 0px;
      border: 1PX dashed #979797;
      transform: scale(0.8);
    }
  .tit-small{
  color: #9F54BA;
  }
  .now{
    color: #68B1E6;
  }
  .no{
    color: #B3B3B3;
  }
}
.content{
  margin-top: 45px;
}
.copywriting{
  word-break:normal;
  margin: 0 77px;
}
.tit-small{
  color: #BBBBBB;
  margin-top:21px ;
}
 .form-button {
    display: flex;
    margin: 50px 16px;
    button:nth-of-type(1){
      margin-right: 20px;
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