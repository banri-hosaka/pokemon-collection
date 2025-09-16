<template>
  <div class="async-learning">
    <h2>非同期処理の3つのパターン学習</h2>

    <div class="buttons">
      <button @click="fetchWithPromise">1. Promiseパターン</button>
      <button @click="fetchWithAsyncAwait">2. async/awaitパターン</button>
      <button @click="fetchWithThenCatch">3. then/catchパターン</button>
    </div>

    <div class="results">
      <h3>結果:</h3>
      <pre>{{ result }}</pre>
    </div>

    <div v-if="error" class="error">
      <h3>エラー:</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const result = ref('')
const error = ref('')

// 1. Promiseパターン（基本形）
function fetchWithPromise() {
  result.value = '読み込み中...'
  error.value = ''

  // Promiseオブジェクトを直接作成
  const promise = new Promise((resolve, reject) => {
    // 実際のAPI呼び出しをシミュレート
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70%の確率で成功
      if (success) {
        resolve({ id: 1, name: 'フシギダネ', type: 'くさ' })
      } else {
        reject(new Error('API呼び出しに失敗しました'))
      }
    }, 1000)
  })

  promise
    .then(data => {
      result.value = `Promise成功: ${JSON.stringify(data, null, 2)}`
    })
    .catch(err => {
      error.value = `Promise失敗: ${err.message}`
    })
}

// 2. async/awaitパターン（推奨）
async function fetchWithAsyncAwait() {
  result.value = '読み込み中...'
  error.value = ''

  try {
    // fetchを使った実際のAPI呼び出し
    const response = await fetch('/api/pokemon/1')

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    result.value = `async/await成功:\n${JSON.stringify(data, null, 2)}`

  } catch (err) {
    error.value = `async/await失敗: ${err.message}`
  }
}

// 3. then/catchパターン（fetchと組み合わせ）
function fetchWithThenCatch() {
  result.value = '読み込み中...'
  error.value = ''

  fetch('/api/pokemon/25') // ピカチュウを取得
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      return response.json() // ここでもPromiseを返す
    })
    .then(data => {
      result.value = `then/catch成功:\n${JSON.stringify(data, null, 2)}`
    })
    .catch(err => {
      error.value = `then/catch失敗: ${err.message}`
    })
}
</script>

<style scoped>
.async-learning {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

button {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.results, .error {
  margin: 20px 0;
  padding: 15px;
  border-radius: 5px;
}

.results {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>