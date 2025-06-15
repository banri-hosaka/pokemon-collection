<template>
  <div class="sample-page">
    <h1>サンプルボタンページ</h1>
    <!-- 複数画像の比較表示 -->
    <div class="comparison-section">
      <h2>デザイン比較</h2>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h4>Figmaデザイン</h4>
          <div class="image-item">
            <NuxtImg
              src="/images/figma-button-sample.svg"
              alt="Figmaボタンデザイン"
              width="128"
              height="40"
              quality="100"
              loading="lazy"
            />
          </div>
        </div>
        <div class="comparison-item">
          <h4>実装結果</h4>
          <div class="implemented-buttons">
            <SampleButton @click="handleCustomClick">デモボタン</SampleButton>
          </div>
        </div>
      </div>
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
.sample-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c2c2c;
  margin-bottom: 2rem;
  text-align: center;
}

/* 画像表示セクション */
.image-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.image-item {
  text-align: center;
}

.image-item h3 {
  margin-bottom: 1rem;
  color: #2c2c2c;
  font-size: 1.1rem;
}

.figma-image {
  height: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 比較セクション */
.comparison-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.comparison-item {
  text-align: center;
}

.comparison-item h4 {
  margin-bottom: 1rem;
  color: #2c2c2c;
  font-size: 1rem;
}

.comparison-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.implemented-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .image-gallery,
  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .sample-page {
    padding: 1rem;
  }
}

/* 既存のスタイル */
.button-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.button-section h2 {
  margin-bottom: 1rem;
  color: #2c2c2c;
  font-size: 1.2rem;
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
