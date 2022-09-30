export default {
    path: "/doc",
    name: "doc",
    redirect: { name: "TermsOfUse" },
    component: () => import("@/views/doc/index.vue"),
    meta:{auth: false},
    children: [
      {
        path: "/doc/termsOfUse",
        name: "termsOfUse",
        component: () => import("@/views/doc/pages/termsOfUse/index.vue"),
        meta: {
          auth: false,
          keepAlive: false,
        },
      },
      {
        path: "/doc/privacyNotice",
        name: "privacyNotice",
        component: () => import("@/views/doc/pages/privacyNotice/index.vue"),
        meta: {
          auth: false,
          keepAlive: false,
        },
      },
    ],
  }