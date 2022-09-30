<template>
  
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { addressMask, decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { computed } from "vue";
import { Image } from "vant";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "nft-card",
  components: {
    [Image.name]: Image,
  },
  props: {
    data: {
      type: Object,
      default: {},
    }
  },
  setup(props: any) {
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const layoutType = computed(() => store.state.system.layoutType);
    const router = useRouter();
    const toDetail = () => {
      router.push({ name: "nft-detail", query: props.data });
    };
    return {
      addressMask,
      currentNetwork,
      layoutType,
      toDetail,
    };
  },
});
</script>


<style lang="scss" scoped>
.snftcontainer{
  height: 64px;
  padding: 0px 0 0 15px; 
  .checkbox_img{
    // background-color: red;
    .no_checkbox{
      width:17.5px;
      height:17.5px;
      display: inline-block;
    }
  }
   width:calc(100% - 15px);
   border-bottom:1px solid #DBD9DA;
   display: flex;
   justify-content:space-between;
   align-items: center;
   .snftcontainerleft{
    //  width:10%;
     width:60px;
     height:60px;
     border-radius:50%;
    //  border:1px solid #D0D7D7;
     
   }
   .snftmiddle{
        .snftleftcollect{
          text-align:left;
          font-size: 22px;
        }
        .snftleftcolleaddre{
          font-size: 10px;
          color:#797777;
        }
        .snftmiddle-text {
          margin-top: 4px;
          display: inline-block;
          max-width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
                letter-spacing: -0.6px;

        }
   }
   .snftcontainright{
     font-size: 16px;
   }
   
}
.snftcontainer_left {
  display: flex;
  align-items: center;
}
.snftcontainer_left_container {
  display: flex;
  align-items: flex-start;
  margin-left: 14px;
}
.snftimg{
  width:40px;
  height:40px;
  margin-right: 5px;
  border-radius:50%;
}
</style>