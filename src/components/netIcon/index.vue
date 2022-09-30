<template>
  <!-- 0 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 0"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M.134,12.14A2.994,2.994,0,0,1,2.122,8.389,38.51,38.51,0,0,1,11,7.023V5H8V3h3V0h2V3h3V5H13V7.023a38.51,38.51,0,0,1,8.878,1.366,3,3,0,0,1,1.989,3.751L21.448,20H2.552ZM2,22v2H22V22Z"/>
  </svg>

  <!-- 1 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 1"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M3.8,8.152A10.491,10.491,0,0,1,10.16,4.181a2.5,2.5,0,1,1,3.681,0A10.441,10.441,0,0,1,20.2,8.149a7.837,7.837,0,0,0-3.358,3.326,5.98,5.98,0,0,0-9.69,0A7.836,7.836,0,0,0,3.8,8.152ZM21.449,20,24.017,9.062C20.427,9.447,18,11.777,18,15H16a4,4,0,0,0-8,0H6C6,11.777,3.573,9.447-.016,9.062L2.551,20ZM2,24H22V22H2Z"/>

  </svg>
  <!-- 2 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 2"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M21,15c0-2.248-1.378-4.605-3.016-6.619l-5.216,6.26a1,1,0,1,1-1.536-1.282l5.416-6.5a36.111,36.111,0,0,0-3.5-3.228A2,2,0,1,0,10.807,3.6C8.814,4.987,3,9.511,3,15a8.983,8.983,0,0,0,3.356,7H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2H17.645A8.985,8.985,0,0,0,21,15Z"/>

  </svg>
  <!-- 3 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 3"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M11,11H2V9.355A3.266,3.266,0,0,1,4.162,6.3C7.119,5.229,9.112,3.929,9.9.758L10.094,0h.781C21.873,0,22,9.9,22,10V20H5.236C7.392,18.046,10.19,14.858,11,11ZM1,22v2H23V22Z"/>

  </svg>
  <!-- 4 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 4"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M13,12v2H11V12a1,1,0,0,1,2,0ZM0,9V0H6V4H9V0h6V4h3V0h6V9a3,3,0,0,1-3,3v8H3V12A3,3,0,0,1,0,9Zm9,7h6V12a3,3,0,0,0-6,0ZM1,22v2H23V22Z"/>

  </svg>
  <!-- 5 -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-show="index == 5"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
  >
<path d="M4,14V12H7.111a7,7,0,1,1,9.778,0H20v2Zm13,3V16H7v1a5.006,5.006,0,0,1-5,5v2H22V22A5.006,5.006,0,0,1,17,17Z"/>
n
  </svg>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
defineProps({
  color: {
    type: String,
    default: "#000",
  },
  size: {
    type: String,
    default: "30",
  },
  index: {
    type: Number,
    default: 0,
  },
});
</script>
<style lang="scss">
</style>