import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: (_routes) => [
    {
      name: "home",
      path: "/",
      component: () => import("~/pages/index.vue"),
    },
    // 他のルート設定
  ],
} satisfies RouterConfig;
