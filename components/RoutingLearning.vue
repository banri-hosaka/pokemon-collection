<template>
  <div class="routing-learning">
    <h2>Nuxt.js ルーティング学習</h2>

    <!-- 基本概念 -->
    <section class="concept-section">
      <h3>📁 ファイルベースルーティング</h3>
      <div class="route-examples">
        <div class="route-item">
          <strong>通常ルート:</strong>
          <code>pages/about.vue</code> → <code>/about</code>
        </div>
        <div class="route-item">
          <strong>動的ルート:</strong>
          <code>pages/pokemon/[id].vue</code> → <code>/pokemon/1</code>, <code>/pokemon/25</code>
        </div>
        <div class="route-item">
          <strong>ネストルート:</strong>
          <code>pages/user/[id]/profile.vue</code> → <code>/user/123/profile</code>
        </div>
      </div>
    </section>

    <!-- 動的パラメータの取得 -->
    <section class="params-section">
      <h3>🔗 動的パラメータの取得方法</h3>

      <div class="current-route-info">
        <h4>現在のルート情報:</h4>
        <div class="route-data">
          <p><strong>パス:</strong> {{ currentRoute.path }}</p>
          <p><strong>名前:</strong> {{ currentRoute.name }}</p>
          <p><strong>パラメータ:</strong> {{ JSON.stringify(currentRoute.params) }}</p>
          <p><strong>クエリ:</strong> {{ JSON.stringify(currentRoute.query) }}</p>
        </div>
      </div>

      <div class="code-example">
        <h4>コード例:</h4>
        <pre><code>// pages/pokemon/[id].vue
import { useRoute } from 'vue-router'

const route = useRoute()
const pokemonId = route.params.id  // URLの[id]部分を取得</code></pre>
      </div>
    </section>

    <!-- 実際の動的ルート体験 -->
    <section class="demo-section">
      <h3>🚀 動的ルート体験</h3>

      <div class="navigation-demo">
        <h4>ポケモン詳細ページに移動:</h4>
        <div class="pokemon-links">
          <button
            v-for="pokemonId in [1, 25, 150]"
            :key="pokemonId"
            @click="navigateToPokemon(pokemonId)"
            class="pokemon-link-btn"
          >
            ポケモン {{ pokemonId }}
          </button>
        </div>

        <div class="custom-navigation">
          <input
            v-model="customId"
            type="number"
            placeholder="ポケモンID入力"
            min="1"
            max="1010"
          >
          <button
            @click="navigateToPokemon(customId)"
            :disabled="!customId || customId < 1"
            class="custom-nav-btn"
          >
            移動
          </button>
        </div>
      </div>
    </section>

    <!-- パラメータバリデーション -->
    <section class="validation-section">
      <h3>✅ パラメータバリデーション</h3>

      <div class="validation-example">
        <h4>現在のIDの検証結果:</h4>
        <div class="validation-result">
          <p><strong>ID値:</strong> {{ currentId }}</p>
          <p><strong>数値か:</strong> {{ isValidNumber ? '✅' : '❌' }}</p>
          <p><strong>範囲内か(1-1010):</strong> {{ isInValidRange ? '✅' : '❌' }}</p>
          <p><strong>総合判定:</strong> {{ isValidId ? '✅ 有効' : '❌ 無効' }}</p>
        </div>

        <div class="validation-code">
          <h4>バリデーション実装例:</h4>
          <pre><code>// パラメータの検証
const id = route.params.id
const isValidNumber = /^\d+$/.test(id)
const numericId = parseInt(id)
const isInValidRange = numericId >= 1 && numericId <= 1010

if (!isValidNumber || !isInValidRange) {
  // エラーハンドリング
  throw createError({
    statusCode: 404,
    statusMessage: 'ポケモンが見つかりません'
  })
}</code></pre>
        </div>
      </div>
    </section>

    <!-- 使い分けの判断基準 -->
    <section class="summary-section">
      <h3>📝 ルーティングの使い分け</h3>
      <ul class="guidelines">
        <li><strong>通常ルート:</strong> 固定ページ（about, contact, settings など）</li>
        <li><strong>動的ルート:</strong> ID や slug による個別リソース（記事、ユーザー、商品詳細）</li>
        <li><strong>ネストルート:</strong> 階層的な関係（ユーザー → プロフィール、設定など）</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const customId = ref('')

// 現在のルート情報
const currentRoute = computed(() => ({
  path: route.path,
  name: route.name,
  params: route.params,
  query: route.query
}))

// 現在のIDとその検証
const currentId = computed(() => route.params.id || 'なし')

const isValidNumber = computed(() => {
  const id = route.params.id
  return id ? /^\d+$/.test(id) : false
})

const isInValidRange = computed(() => {
  const id = route.params.id
  if (!id) return false
  const numericId = parseInt(id)
  return numericId >= 1 && numericId <= 1010
})

const isValidId = computed(() => isValidNumber.value && isInValidRange.value)

// ナビゲーション関数
function navigateToPokemon(id) {
  if (!id || id < 1) return
  router.push(`/pokemon/${id}`)
}
</script>

<style scoped>
.routing-learning {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.concept-section, .params-section, .demo-section, .validation-section, .summary-section {
  margin: 30px 0;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.route-examples {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.route-item {
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.route-item code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

.current-route-info {
  margin: 20px 0;
}

.route-data {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.route-data p {
  margin: 8px 0;
  font-family: monospace;
}

.code-example, .validation-code {
  margin: 20px 0;
}

.code-example pre, .validation-code pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
}

.pokemon-links {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.pokemon-link-btn {
  padding: 8px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pokemon-link-btn:hover {
  background: #218838;
}

.custom-navigation {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  align-items: center;
}

.custom-navigation input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
}

.custom-nav-btn {
  padding: 8px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.custom-nav-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.custom-nav-btn:not(:disabled):hover {
  background: #0056b3;
}

.validation-result {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
}

.validation-result p {
  margin: 8px 0;
  font-family: monospace;
}

.guidelines {
  list-style: none;
  padding: 0;
}

.guidelines li {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}
</style>