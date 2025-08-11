<template>
  <div>
    <!-- ポケモンローダー -->
    <PokemonLoader :loading="isLoading" />
    
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
/* ページ遷移アニメーション */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
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
