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
      {
        path: "/generateNFT/ai-create",
        name: "ai-create",
        component:() =>  import('@/views/generateNFT/pages/aiCreate.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: "/generateNFT/success",
        name: "generateNFT-success",
        component:() =>  import('@/views/generateNFT/pages/success.vue'),
        meta: {
          auth: true,
        },
      },
    ],
  };
  