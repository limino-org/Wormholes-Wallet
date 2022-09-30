<template>
  <div class="flex center worm-box">
    <div :class="`icon-box flex center ${size}`">
      <div
        class="iconele flex center icon1-enter-active"
        :style="{
          backgroundImage: `url(${require('@/views/mnemonic/imgs/circle.png')})`,
        }"
      >
        <div :class="`${t1 ? 't1-enter-active' : ''} tbox`">
          <slot name="t1"></slot>
        </div>
        <div :class="`${t2 ? 't2-enter-active' : ''} tbox`">
          <slot name="t2" v-if="t2"> </slot>
        </div>
        <div :class="`${t3 ? 't3-enter-active' : ''} tbox`">
          <slot name="t3" v-if="t3"> </slot>
        </div>
        <div :class="`${t4 ? 't4-enter-active' : ''} tbox`">
          <slot name="t4" v-if="t4"> </slot>
        </div>
        <div :class="`${t5 ? 't5-enter-active' : ''} tbox`">
          <slot name="t5" v-if="t5"> </slot>
        </div>
        <div
          class="iconinner flex center text-enter-active"
          :style="{
            backgroundImage:`url(${require('@/views/mnemonic/imgs/circle2.png')})`,
          }"
        >
          <slot name="icon"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "worm-transition",
  props: {
    size: {
      type: String,
      default: "big",
    },
  },
  setup() {
    const t1 = ref(false);
    const t2 = ref(false);
    const t3 = ref(false);
    const t4 = ref(false);
    const t5 = ref(false);
    onMounted(() => {
      const d1 = Math.floor(Math.random() * (900 - 780 + 1)) + 550;
      const d2 = Math.floor(Math.random() * (1000 - 650 + 1)) + 600;
      const d3 = Math.floor(Math.random() * (800 - 550 + 1)) + 350;
      const d4 = Math.floor(Math.random() * (580 - 450 + 1)) + 450;
      const d5 = Math.floor(Math.random() * (900 - 550 + 1)) + 550;
      let time1 = setTimeout(() => {
        t1.value = true;
        clearTimeout(time1);
      }, d1);
      let time2 = setTimeout(() => {
        t2.value = true;
        clearTimeout(time2);
      }, d2);
      let time3 = setTimeout(() => {
        t3.value = true;
        clearTimeout(time3);
      }, d3);
      let time4 = setTimeout(() => {
        t4.value = true;
        clearTimeout(time4);
      }, d4);
      let time5 = setTimeout(() => {
        t5.value = true;
        clearTimeout(time5);
      }, d5);
    });
    return {
      t1,
      t2,
      t3,
      t4,
      t5,
    };
  },
});
</script>
<style scoped lang="scss">
.worm-box {
}
.icon-box {
  margin-top: 50px;
  &.big {
    .iconele {
      width: 175px;
      height: 175px;
      .iconinner {
        width: 110px;
        height: 110px;
        
      }
    }
  }
  &.small {
    .iconele {
      width: 60px;
      height: 60px;
      .iconinner {
        width: 37.5px;
        height: 37.5px;
      }
    }
  }
  .iconele {
    position: relative;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    .iconinner {
      background-size: cover;
      background-repeat: no-repeat;
      text-shadow: 10px 15px 15px #03345a;

      background-position: left 0 top 0 right 0 bottom 0;
      font-size: 26px;
      font-weight: bold;
      color: #037cd6;
    }
  }
}

.big .text-enter-active {
  animation: text-in 1s ease-in-out forwards;
}
.small .text-enter-active {
  animation: text-in2 1s ease-in-out forwards;
}
@keyframes text-in {
  0% {
    width: 50px;
    height: 50px;
    font-size: 80px;
  }
  20% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    font-size: 26px;
    width: 110px;
    height: 110px;
    text-shadow: 0px 0px 0px #085b9b;
  }
}
@keyframes text-in2 {
  0% {
    width: 20px;
    height: 20px;
    font-size: 40px;
  }
  20% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    font-size: 14px;
    width: 37.5px;
    height: 37.5px;
    text-shadow: 0px 0px 0px #085b9b;
  }
}
.tbox {
  width: 20px;
  height: 20px;
  // background: #037cd6;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -10px;
  margin-top: -10px;
  opacity: 0;
}

.t1-enter-active {
  animation: t1-in 1.5s ease forwards;
}

@keyframes t1-in {
  0% {
    opacity: 0;
    transform: scale(0.22);
  }
  100% {
    opacity: 1;
    transform: scale(0.8);
    left: 30px;
    top: 60px;
  }
}

.t2-enter-active {
  animation: t2-in 1.2s ease forwards;
}

@keyframes t2-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
    top: 120px;
    left: 30px;
  }
}

.t3-enter-active {
  animation: t3-in 1s ease forwards;
}

@keyframes t3-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
    left: 130px;
    top: 120px;
  }
}

.t4-enter-active {
  animation: t4-in 1.5s ease forwards;
}

@keyframes t4-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
    left: 125px;
    top: 50px;
  }
}

.t5-enter-active {
  animation: t5-in 1.7s ease forwards;
}

@keyframes t5-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
    left: 80px;
    top: -5px;
  }
}
.big .icon1-enter-active {
  animation: icon1-in 1s ease forwards;
}
.small .icon1-enter-active {
  animation: icon1-in2 1s ease forwards;
}

@keyframes icon1-in {
  0% {
    opacity: 0.5;
    width: 120px;
    height: 120px;
  }
  100% {
    opacity: 1;
    height: 175px;
    width: 175px;
  }
}
@keyframes icon1-in2 {
  0% {
    opacity: 0.5;
    width: 37.5px;
    height: 37.5px;
  }
  100% {
    opacity: 1;
    height: 60px;
    width: 60px;
  }
}
</style>