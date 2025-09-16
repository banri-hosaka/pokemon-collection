<template>
  <div class="composition-api-learning">
    <h2>Vue.js Composition API学習</h2>

    <!-- ref の例 -->
    <section class="example-section">
      <h3>1. ref（プリミティブ値に最適）</h3>
      <div class="controls">
        <input v-model="userName" placeholder="名前を入力">
        <button @click="userAge++">年齢+1</button>
        <button @click="resetUser">リセット</button>
      </div>
      <div class="result">
        <p>名前: {{ userName }}</p>
        <p>年齢: {{ userAge }}</p>
      </div>
      <div class="code-explanation">
        <strong>なぜrefを使う？</strong><br>
        文字列や数値などのプリミティブ値を扱うとき。
        <code>.value</code>でアクセスする必要がある。
      </div>
    </section>

    <!-- reactive の例 -->
    <section class="example-section">
      <h3>2. reactive（オブジェクト構造に最適）</h3>
      <div class="controls">
        <input v-model="pokemonData.name" placeholder="ポケモン名">
        <input v-model.number="pokemonData.level" placeholder="レベル">
        <button @click="addType">タイプ追加</button>
        <button @click="resetPokemon">リセット</button>
      </div>
      <div class="result">
        <p>名前: {{ pokemonData.name }}</p>
        <p>レベル: {{ pokemonData.level }}</p>
        <p>タイプ: {{ pokemonData.types.join(', ') }}</p>
      </div>
      <div class="code-explanation">
        <strong>なぜreactiveを使う？</strong><br>
        オブジェクトや配列など、複数の関連するプロパティをまとめて管理したいとき。
        <code>.value</code>は不要。
      </div>
    </section>

    <!-- computed の例 -->
    <section class="example-section">
      <h3>3. computed（計算プロパティ・キャッシュあり）</h3>
      <div class="controls">
        <input v-model.number="baseStats.hp" placeholder="HP">
        <input v-model.number="baseStats.attack" placeholder="攻撃">
        <input v-model.number="baseStats.defense" placeholder="防御">
      </div>
      <div class="result">
        <p>総合力: {{ totalStats }}</p>
        <p>評価: {{ battleRating }}</p>
        <p>計算回数: {{ computedCallCount }}回</p>
      </div>
      <div class="code-explanation">
        <strong>なぜcomputedを使う？</strong><br>
        他のリアクティブな値に依存する計算結果をキャッシュしたいとき。
        依存する値が変わらない限り、再計算されない（パフォーマンス向上）。
      </div>
    </section>

    <!-- 使い分けの判断基準 -->
    <section class="summary-section">
      <h3>📝 使い分けの判断基準</h3>
      <ul>
        <li><strong>ref</strong>: 文字列、数値、真偽値など単一の値</li>
        <li><strong>reactive</strong>: オブジェクト、配列など複数の値をまとめて管理</li>
        <li><strong>computed</strong>: 他の値から計算される値（キャッシュが欲しい）</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// ref の例：プリミティブ値
const userName = ref('')
const userAge = ref(20)

function resetUser() {
  userName.value = ''
  userAge.value = 20
}

// reactive の例：オブジェクト
const pokemonData = reactive({
  name: 'ピカチュウ',
  level: 1,
  types: ['でんき']
})

function addType() {
  const types = ['ほのお', 'みず', 'くさ', 'ひこう', 'エスパー']
  const randomType = types[Math.floor(Math.random() * types.length)]
  if (!pokemonData.types.includes(randomType)) {
    pokemonData.types.push(randomType)
  }
}

function resetPokemon() {
  pokemonData.name = 'ピカチュウ'
  pokemonData.level = 1
  pokemonData.types = ['でんき']
}

// computed の例：計算プロパティ
const baseStats = reactive({
  hp: 100,
  attack: 80,
  defense: 60
})

let totalStatsCallCount = 0
let battleRatingCallCount = 0

// computed は依存する値が変わった時のみ再計算される
const totalStats = computed(() => {
  totalStatsCallCount++
  console.log('totalStats が再計算されました:', totalStatsCallCount)
  return baseStats.hp + baseStats.attack + baseStats.defense
})

const battleRating = computed(() => {
  battleRatingCallCount++
  console.log('battleRating が再計算されました:', battleRatingCallCount)
  if (totalStats.value >= 300) return 'S級'
  if (totalStats.value >= 250) return 'A級'
  if (totalStats.value >= 200) return 'B級'
  return 'C級'
})

// 表示用のカウンター（リアクティブでない）
const computedCallCount = computed(() => totalStatsCallCount + battleRatingCallCount)
</script>

<style scoped>
.composition-api-learning {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.example-section {
  margin: 30px 0;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.controls input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls button {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #0056b3;
}

.result {
  padding: 15px;
  background: white;
  border-radius: 4px;
  margin-bottom: 15px;
}

.result p {
  margin: 5px 0;
  font-weight: bold;
}

.code-explanation {
  padding: 10px;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 14px;
}

.code-explanation code {
  background: #f8f9fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.summary-section {
  margin: 30px 0;
  padding: 20px;
  background: #d1ecf1;
  border-radius: 8px;
}

.summary-section ul {
  list-style: none;
  padding: 0;
}

.summary-section li {
  margin: 10px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
}
</style>