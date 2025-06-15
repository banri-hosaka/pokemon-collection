<template>
  <div class="container">
    <h1 class="title">Figmaサンプル表示</h1>
    <p class="subtitle">開発者ツールでボタンが押されたことを表示する</p>

    <div class="card">
      <SampleButton @click="handleCustomClick"> カスタム </SampleButton>
    </div>

    <div class="navigation">
      <NuxtLink to="/" class="back-link">トップページに戻る</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// ページメタデータの設定
definePageMeta({
  title: "サンプルボタンページ",
});

// イベントハンドラー
const handleCustomClick = () => {
  console.log("カスタムボタンがクリックされました");
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  color: #41b883; /* Vue.jsの色 */
  text-align: center;
}

.subtitle {
  color: #35495e; /* Vue.jsの色 */
  text-align: center;
  margin-bottom: 30px;
}

.card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.navigation {
  text-align: center;
  margin-top: 3rem;
}

.back-link {
  color: #14ae5c;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #14ae5c;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: #14ae5c;
  color: white;
}
</style>
