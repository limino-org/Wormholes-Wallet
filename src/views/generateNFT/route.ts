// Mnemonic module routing
export default {
    path: "/generateNFT",
    name: "generateNFT",
    redirect: { name: "generateNFT-ai" },
    component:() =>  import('@/views/generateNFT/index.vue'),
    children: [
      {
        path: "/generateNFT/ai",
        name: "generateNFT-ai",
        component:() =>  import('@/views/generateNFT/pages/ai.vue'),
        meta: {
          auth: true,
        },
      },
    ],
  };
  