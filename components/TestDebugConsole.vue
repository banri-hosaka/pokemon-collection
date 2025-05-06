<template>
  <div class="container">
    <!-- Elements タブでの検証用に異なるスタイルを持つ要素 -->
    <h1 class="title">Vue/Nuxt デバッグデモ</h1>
    <p class="subtitle">開発者ツールで以下の要素をLet's検証</p>

    <div class="card">
      <button class="button" @click="triggerConsoleLog">
        コンソールにログを出力
      </button>
      <button class="button primary" @click="fetchData">
        API リクエストを実行
      </button>
    </div>

    <!-- APIから取得したデータの表示 -->
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="error" class="error">エラー: {{ error }}</div>
    <div v-else-if="data" class="data-display">
      <h3>取得したデータ:</h3>
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
      loading: false,
      error: null,
    };
  },
  mounted() {
    // マウント時にコンソールにログを出力（Console タブで確認可能）
    console.log("コンポーネントがマウントされました");
    console.info("情報レベルのログ出力テスト");

    // 任意のオブジェクトを展開して表示
    console.dir(document.querySelector(".container"));
  },
  methods: {
    triggerConsoleLog() {
      // 様々なコンソールメソッドのデモ（Console タブで確認可能）
      console.log("ボタンがクリックされました");
      console.warn("これは警告メッセージです");
      console.error("これはエラーメッセージです");

      // デバッグ用にオブジェクトをログ出力
      console.table({
        name: "サンプルデータ",
        count: 42,
        isActive: true,
      });

      // パフォーマンス計測の例
      console.time("処理時間");
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      console.timeEnd("処理時間");
      console.log("計算結果:", sum);
    },
    async fetchData() {
      // API呼び出しの例（Network タブで確認可能）
      this.loading = true;
      this.error = null;
      this.data = false;

      try {
        console.log("APIリクエスト開始");
        // JSONPlaceholderの公開APIを使用
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/1");

        // レスポンスのステータスチェック
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        // レスポンスデータをJSONとして解析
        this.data = await response.json();
        console.log("APIレスポンス:", this.data);
      } catch (err) {
        this.error = err.message;
        console.error("APIリクエストエラー:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
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

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0;
  cursor: pointer;
  font-size: 14px;
}

.button:hover {
  background-color: #d0d0d0;
}

.button.primary {
  background-color: #41b883;
  color: white;
}

.button.primary:hover {
  background-color: #3aa876;
}

.loading {
  text-align: center;
  color: #888;
}

.error {
  color: #e74c3c;
  border-left: 4px solid #e74c3c;
  padding-left: 10px;
}

.data-display {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

pre {
  background-color: #35495e;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
