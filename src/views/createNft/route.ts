// Casting NFT 
export default {
  path: "/createNft",
  name: "createNft",
  redirect: {name:'createNft-step1'},
  component: () => import("@/views/createNft/index.vue"),
  children: [
    {
      path: "/createNft/step1",
      name: "createNft-step1",
      component: () =>  import("@/views/createNft/pages/step1.vue"),
      meta: {
        auth:true,
      },
    },
    {
      path: "/createNft/step2",
      name: "createNft-step2",
      component:  () => import("@/views/createNft/pages/step2.vue"),
      meta: {
        auth:true,
      },
    },
    {
      path: "/createNft/step3",
      name: "createNft-step3",
      component: () =>  import("@/views/createNft/pages/step3.vue"),
      meta: {
        auth:true,
      },
    },
  ],
}