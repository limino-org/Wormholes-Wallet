// Send NFT module route
export default {
  path: "/sendNft",
  name: "sendNft",
  component:() =>  import("@/views/sendNft/index.vue"),
  children: [
    {
      path: "/sendNft/step1",
      name: "sendNft-step1",
      component:() =>  import("@/views/sendNft/pages/step1.vue"),
      meta: {
        auth: true,
      },
    },
    {
      path: "/sendNft/step2",
      name: "sendNft-step2",
      component:() =>  import("@/views/sendNft/pages/step2.vue"),
      meta: {
        auth: true,
      },
    },
    
  ],
};
