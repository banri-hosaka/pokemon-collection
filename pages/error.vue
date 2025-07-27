<template>
  <div class="error-container">
    <h1>エラーが発生しました</h1>
    <div class="error-details">
      <div class="error-code">{{ error.statusCode }}</div>
      <div class="error-message">{{ error.message }}</div>
    </div>
    <button @click="handleError">トップページに戻る</button>
  </div>
</template>

<script setup>
// プロパティとして自動的にエラー情報が提供される
defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 500, message: '不明なエラー' })
  },
});

// クリアハンドラ - エラーをクリアして指定されたパスに移動
const handleError = () => {
  // Nuxtのエラークリア関数
  clearError({ redirect: "/" });
};
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
}

h1 {
  color: #f44336;
  margin-bottom: 20px;
}

.error-details {
  margin-bottom: 30px;
}

.error-code {
  font-size: 48px;
  font-weight: bold;
  color: #333;
}

.error-message {
  margin-top: 10px;
  color: #666;
}

button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
