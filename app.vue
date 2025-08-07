<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ポケモンローダー -->
    <PokemonLoader :loading="isLoading" />
    
    <div class="font-sans antialiased">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
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
@import '@unocss/reset/tailwind.css';

/* ページ遷移アニメーション */
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-300;
}

.page-enter-from {
  @apply opacity-0 scale-90 translate-y-5;
}

.page-leave-to {
  @apply opacity-0 translate-y-2;
}
</style>
