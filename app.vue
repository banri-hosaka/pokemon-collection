<template>
  <div>
    <!-- ポケモンローダー -->
    <PokemonLoader :loading="isLoading" />
  </div>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const nuxtApp = useNuxtApp();
const isLoading = ref(true);
const isFirstVisit = ref(true);

// 初回訪問時のみポケモンローダーを表示
if (import.meta.client) {
  // ページ遷移開始時
  nuxtApp.hook("page:start", () => {
    if (isFirstVisit.value) {
      isLoading.value = true;
    }
  });

  // ページ遷移完了時
  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      isLoading.value = false;
      isFirstVisit.value = false;
    }, 1500); // ポケモンを少し長く表示するため遅延を設定
  });
}
</script>

<style>
/* グローバルCSS */
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 5px;
  padding: 5px;
  background-color: #fafafa;
}

/* ページ遷移アニメーション */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
