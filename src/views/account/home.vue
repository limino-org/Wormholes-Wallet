<template>
  <div class="home">
    <div class="container" id="container">
      <router-view />
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
      </router-view>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Button, Sticky } from 'vant'
import { onBeforeRouteUpdate } from 'vue-router'
import NavHeader from '@/components/navHeader/index.vue'
import { Ref, ref } from 'vue'
export default {
  name: 'index',
  components: {
    NavHeader,
    [Button.name]: Button,
    [Sticky.name]: Sticky
  },
  setup() {
    onBeforeRouteUpdate((to, form, next) => {
      transitionName(to.fullPath, form.fullPath)
      next()
    })
    const animateName: Ref<string> = ref('')
    const transitionName = (to: string, form: string) => {
      if (to == '/wallet' && form == '/') {
        animateName.value = ''
        return
      }
      const arr1: Array<string> = to.split('/')
      const arr2: Array<string> = form.split('/')
      const name: string = arr1.length > arr2.length ? 'slide-right' : 'slide-left'
      animateName.value = name
    }
    return {
      animateName
    }
  }
}
</script>
<style lang="scss">

.page-container {
  min-height: calc(100vh - 48px);
  scrollbar-width: none;
  // overflow-y: scroll;
  position: relative;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
:deep(.van-popup) {
  position: absolute;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  width: 100%;
  min-height: 100vh;
  will-change: transform;
  transition: all 300ms cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
  backface-visibility: hidden;
}
.slide-right-enter-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(-3%, 0, 0);
}
.slide-left-enter-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(-3%, 0, 0);
}
</style>
