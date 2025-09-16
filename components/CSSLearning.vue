<template>
  <div class="css-learning">
    <h2>CSS メディアクエリ学習</h2>

    <!-- 基本概念 -->
    <section class="concept-section">
      <h3>📱 メディアクエリとは</h3>
      <p>
        <strong>メディアクエリ</strong>は、デバイスの画面サイズや特性に応じて
        異なるCSSスタイルを適用するCSS標準機能です。
      </p>

      <div class="framework-note">
        <h4>⚠️ 重要な区別</h4>
        <ul>
          <li><strong>メディアクエリ:</strong> CSS標準機能 <code>@media (max-width: 768px) { ... }</code></li>
          <li><strong>Bootstrap:</strong> CSSフレームワーク <code>col-xs-12, col-md-6</code></li>
          <li>メディアクエリを使ってBootstrapのようなフレームワークが作られています</li>
        </ul>
      </div>
    </section>

    <!-- 基本的な書き方 -->
    <section class="syntax-section">
      <h3>✍️ 基本的な書き方</h3>

      <div class="code-example">
        <h4>基本構文:</h4>
        <pre><code>/* デスクトップファースト（大きい画面から小さい画面へ） */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}

/* モバイルファースト（小さい画面から大きい画面へ） */
@media (min-width: 769px) {
  .container {
    padding: 20px;
  }
}</code></pre>
      </div>

      <div class="breakpoint-table">
        <h4>一般的なブレークポイント:</h4>
        <table>
          <thead>
            <tr>
              <th>デバイス</th>
              <th>幅</th>
              <th>メディアクエリ例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>モバイル</td>
              <td>〜768px</td>
              <td><code>@media (max-width: 768px)</code></td>
            </tr>
            <tr>
              <td>タブレット</td>
              <td>769px〜1024px</td>
              <td><code>@media (min-width: 769px) and (max-width: 1024px)</code></td>
            </tr>
            <tr>
              <td>デスクトップ</td>
              <td>1025px〜</td>
              <td><code>@media (min-width: 1025px)</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 実践例 -->
    <section class="demo-section">
      <h3>🎯 実践例：レスポンシブカード</h3>

      <div class="current-viewport">
        <h4>現在の画面情報:</h4>
        <p><strong>幅:</strong> {{ viewportWidth }}px</p>
        <p><strong>適用中のスタイル:</strong> {{ currentBreakpoint }}</p>
      </div>

      <div class="responsive-demo">
        <div class="demo-card">
          <h4>レスポンシブカード</h4>
          <p>画面サイズを変えてカードの見た目の変化を確認してください。</p>
          <div class="demo-grid">
            <div class="demo-item">アイテム1</div>
            <div class="demo-item">アイテム2</div>
            <div class="demo-item">アイテム3</div>
            <div class="demo-item">アイテム4</div>
          </div>
        </div>
      </div>

      <div class="code-explanation">
        <h4>上のカードに適用されているCSS:</h4>
        <pre><code>/* デフォルト（デスクトップ） */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

/* タブレット */
@media (max-width: 1024px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* モバイル */
@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}</code></pre>
      </div>
    </section>

    <!-- モバイルファースト vs デスクトップファースト -->
    <section class="approach-section">
      <h3>🔄 アプローチの違い</h3>

      <div class="approach-comparison">
        <div class="approach-item">
          <h4>モバイルファースト</h4>
          <div class="approach-code">
            <pre><code>/* ベース: モバイル */
.container {
  padding: 10px;
  font-size: 14px;
}

/* タブレット以上 */
@media (min-width: 769px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

/* デスクトップ以上 */
@media (min-width: 1025px) {
  .container {
    padding: 30px;
    font-size: 18px;
  }
}</code></pre>
          </div>
          <div class="approach-pros">
            <strong>メリット:</strong>
            <ul>
              <li>モバイル表示のパフォーマンスが良い</li>
              <li>現代的な開発手法</li>
              <li>段階的に機能を追加</li>
            </ul>
          </div>
        </div>

        <div class="approach-item">
          <h4>デスクトップファースト</h4>
          <div class="approach-code">
            <pre><code>/* ベース: デスクトップ */
.container {
  padding: 30px;
  font-size: 18px;
}

/* タブレット以下 */
@media (max-width: 1024px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

/* モバイル以下 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}</code></pre>
          </div>
          <div class="approach-pros">
            <strong>メリット:</strong>
            <ul>
              <li>既存サイトの改修時に使いやすい</li>
              <li>デスクトップ機能をベースに削減</li>
              <li>理解しやすい順序</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 実際のポケモン図鑑での活用例 -->
    <section class="pokemon-example">
      <h3>🔍 ポケモン図鑑での活用例</h3>

      <div class="pokemon-grid-demo">
        <h4>PokemonList.vueの実装例:</h4>
        <pre><code>/* 現在の実装（CSS Grid + auto-fill） */
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

/* メディアクエリを追加するなら */
@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}</code></pre>
      </div>
    </section>

    <!-- まとめ -->
    <section class="summary-section">
      <h3>📝 重要ポイント</h3>
      <ul class="key-points">
        <li><strong>メディアクエリ = CSS標準機能</strong>（Bootstrapとは別物）</li>
        <li><strong>基本構文:</strong> <code>@media (条件) { CSSルール }</code></li>
        <li><strong>モバイルファースト:</strong> <code>min-width</code> で段階的に拡張</li>
        <li><strong>デスクトップファースト:</strong> <code>max-width</code> で段階的に縮小</li>
        <li><strong>ブレークポイント:</strong> 768px, 1024px が一般的</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const viewportWidth = ref(0)
const currentBreakpoint = ref('')

function updateViewportInfo() {
  viewportWidth.value = window.innerWidth

  if (viewportWidth.value <= 768) {
    currentBreakpoint.value = 'モバイル'
  } else if (viewportWidth.value <= 1024) {
    currentBreakpoint.value = 'タブレット'
  } else {
    currentBreakpoint.value = 'デスクトップ'
  }
}

onMounted(() => {
  updateViewportInfo()
  window.addEventListener('resize', updateViewportInfo)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportInfo)
})
</script>

<style scoped>
.css-learning {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.concept-section, .syntax-section, .demo-section, .approach-section, .pokemon-example, .summary-section {
  margin: 30px 0;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.framework-note {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}

.framework-note ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.code-example pre, .code-explanation pre, .approach-code pre, .pokemon-grid-demo pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.4;
}

.breakpoint-table {
  margin: 20px 0;
}

.breakpoint-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.breakpoint-table th,
.breakpoint-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.breakpoint-table th {
  background: #f8f9fa;
  font-weight: bold;
}

.breakpoint-table code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
}

.current-viewport {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}

.current-viewport p {
  margin: 5px 0;
  font-weight: bold;
}

.responsive-demo {
  margin: 20px 0;
}

.demo-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin: 15px 0;
}

.demo-item {
  background: #007bff;
  color: white;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.approach-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.approach-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.approach-pros {
  margin: 15px 0;
}

.approach-pros ul {
  margin: 5px 0;
  padding-left: 20px;
}

.key-points {
  list-style: none;
  padding: 0;
}

.key-points li {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.key-points code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

/* レスポンシブ実装例 */
@media (max-width: 1024px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .approach-comparison {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .css-learning {
    padding: 15px;
  }

  .concept-section, .syntax-section, .demo-section, .approach-section, .pokemon-example, .summary-section {
    padding: 15px;
  }

  .breakpoint-table {
    overflow-x: auto;
  }
}
</style>