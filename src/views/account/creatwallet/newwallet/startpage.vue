<template>
  <div class="startpages">
        <div class="startcotop">
          <div class="startcontop_img">
            <img src="@/assets/token/logowallet.png" alt="" id="container" />
          </div>
          <div class="startcotop_txt">{{t('introductorypage.bootstrap1')}}</div>
        </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter()
const {t} = useI18n()

onMounted(() => {
  let time = setTimeout(() => {
    router.replace({name:'wallet'})
    clearTimeout(time)
  },3000)
})
</script>
<style lang="scss" scoped>
.startpages {
  // background-color:red;
  height: 100vh;
  overflow: hidden;

  .startcotop {
    // background-color:red;
    margin: 300px auto;
    .startcontop_img {
      width: 100px;
      height: 100px;
      img {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        margin-left: -60px;
        // animation: scroll 6s ease-in-out forwards;
        -webkit-animation: startcontop_img  5s linear 0.2s infinite ;
      }
      
     
    }
    .startcotop_txt {
      color: #000;
      font-weight: bold;
      font-size: 20px;
      text-align: center;
      line-height: 260px;
        -webkit-animation: startcontop_img  7s linear 0.2s infinite ;
    }
  }
}

@keyframes startcontop_img{
			
				0%{
					transform: scale(1);
					opacity: 0;
				}
				25%{
					transform: scale(1.5);
					opacity: 0.5;
				}
				50%{
					transform: scale(2);
					opacity: 1;
				}
				75%{
					transform: scale(2.5);
					opacity: 0.5;
				}
				100%{
					transform: scale(3);
					opacity: 0;
				}
			}
</style>