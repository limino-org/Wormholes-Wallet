<template>
      <Transition name="slider">
        <div :class="`flex center buySnft pb-30 pt-30 ${bugTipClass}`" v-if="showBuyTip">
            <slot></slot>
        </div>
      </Transition>
</template>
<script lang="ts" setup>
import { debounce } from "@/utils/utils";
import { watch, ref, onMounted, onUnmounted } from "vue";

   const props = defineProps({
        triggerTop:{
            type: Number,
            default: 300
        },
        finished: {
            type: Boolean,
            default: false
        }
    })
    const showBuyTip = ref(true)
    let oldScrollTop = 0
    const bugTipClass = ref('')

    watch(() => props.finished,()=>{
        if(props.finished){
            window.removeEventListener('scroll', deFun)
            bugTipClass.value = ''
            showBuyTip.value = true
        }
    })

    const scrolling = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let scrollStep = scrollTop - oldScrollTop;
      oldScrollTop = scrollTop;
      if(scrollStep == 0){
        return
      }
        if(scrollTop >= props.triggerTop && scrollStep <0){
            !bugTipClass.value ? bugTipClass.value = 'fixed' : ''
        } else {
            bugTipClass.value ? bugTipClass.value = '' :''
        }
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
    onUnmounted(() => {
      window.removeEventListener('scroll', deFun)

    })
</script>
<style lang="scss" scoped>
.buySnft {
  color: #848484;
    background: #fff;
   &.fixed {
    z-index: 1;
    position: fixed;
    min-width: 190px;
    bottom: 10px;
    line-height: 14px;
    left: 50%;
    margin-left: -95px;
    padding: 3px 5px;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
   }
  a {
    color: #9F54BA;
  }
}
</style>