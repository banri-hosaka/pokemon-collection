<template>
  <div v-if="pokemon" class="pokemon-detail-page">
    <!-- 戻るボタン -->
    <button class="back-button" @click="router.back()">
      ← 戻る
    </button>

    <!-- ポケモンサークル表示 -->
    <div class="pokemon-circle-container">
      <div class="pokemon-circle" :data-type="pokemon.types[0]?.type.name">
        <div class="circle-background"></div>
        <div class="circle-inner">
          <img :src="pokemon.sprites.front_default" :alt="pokemon.japaneseName" />
        </div>
        <div class="circle-border"></div>
      </div>
      <div class="pokemon-info-header">
        <p class="pokemon-number">No.{{ pokemon.id.toString().padStart(3, "0") }}</p>
        <h1 class="pokemon-name">{{ pokemon.japaneseName }}</h1>
        <div class="pokemon-types">
          <span
            v-for="type in pokemon.types"
            :key="type.slot"
            :class="'type-badge type-' + type.type.name"
          >
            {{ translateType(type.type.name) }}
          </span>
        </div>
      </div>
    </div>

    <!-- ステータスカード -->
    <div class="stats-card">
      <h3 class="stats-title">ステータス</h3>
      <div class="stats-grid">
        <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
          <span class="stat-label">{{ translateStat(stat.stat.name) }}</span>
          <div class="stat-bar-container">
            <div class="stat-bar" :style="{ width: (stat.base_stat / 255 * 100) + '%' }"></div>
          </div>
          <span class="stat-value">{{ stat.base_stat }}</span>
        </div>
      </div>
      
      <!-- 身体情報 -->
      <div class="body-info">
        <div class="info-item">
          <span class="info-label">たかさ</span>
          <span class="info-value">{{ (pokemon.height / 10).toFixed(1) }}m</span>
        </div>
        <div class="info-item">
          <span class="info-label">おもさ</span>
          <span class="info-value">{{ (pokemon.weight / 10).toFixed(1) }}kg</span>
        </div>
      </div>
    </div>

    <!-- コレクションカード -->
    <div class="collection-card">
      <h3 class="collection-title">コレクション</h3>
      
      <div v-if="isInCollection" class="collection-form">
        <div class="form-group">
          <label>ニックネーム</label>
          <input
            v-model="collectionData.nickname"
            type="text"
            placeholder="ニックネームを入力"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>メモ</label>
          <textarea
            v-model="collectionData.memo"
            placeholder="メモを入力"
            rows="3"
            class="form-textarea"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="collectionData.isFavorite"
              type="checkbox"
              class="form-checkbox"
            />
            お気に入りに登録
          </label>
        </div>

        <div class="button-group">
          <button class="btn-save" @click="updateCollection">保存</button>
          <button class="btn-delete" @click="removeFromCollection">削除</button>
        </div>
      </div>

      <div v-else class="collection-empty">
        <p>このポケモンはまだコレクションに追加されていません</p>
        <button class="btn-add" @click="addToCollection">
          コレクションに追加
        </button>
      </div>
    </div>

    <!-- ステータスメッセージ -->
    <div v-if="statusMessage" :class="['status-message', messageType]">
      {{ statusMessage }}
    </div>
  </div>

  <!-- エラー表示 -->
  <div v-else-if="error" class="error-container">
    <div class="error-card">
      <h2>エラーが発生しました</h2>
      <p>{{ error }}</p>
      <button class="btn-home" @click="router.push('/')">
        トップページに戻る
      </button>
    </div>
  </div>

  <!-- ローディング -->
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>読み込み中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const pokemon = ref(null);
const error = ref(null);
const isInCollection = ref(false);
const collectionData = ref({
  id: null,
  nickname: "",
  memo: "",
  isFavorite: false,
});
const statusMessage = ref("");
const messageType = ref("success");

// ライフサイクルフック：マウント時
onMounted(async () => {
  console.log("ポケモン詳細ページがマウントされました");
  await fetchPokemonData();
  await checkCollectionStatus();
});

// routeのIDが変更された時に再取得
watch(
  () => route.params.id,
  async () => {
    await fetchPokemonData();
    await checkCollectionStatus();
  }
);

// ポケモンデータの取得
async function fetchPokemonData() {
  const id = route.params.id;
  try {
    const response = await fetch(`/api/pokemon/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("ポケモンが見つかりませんでした");
      }
      throw new Error("データの取得に失敗しました");
    }
    pokemon.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error("ポケモンデータ取得エラー:", err);
  }
}

// コレクションステータスの確認
async function checkCollectionStatus() {
  if (!pokemon.value) return;

  try {
    const userId = 1; // 開発用の仮ユーザーID
    const response = await fetch(`/api/collection?userId=${userId}`);
    if (!response.ok) throw new Error("コレクションデータの取得に失敗しました");

    const collection = await response.json();
    const foundPokemon = collection.find(
      (item) => item.pokemonId === pokemon.value.id
    );

    if (foundPokemon) {
      isInCollection.value = true;
      collectionData.value = {
        id: foundPokemon.id,
        nickname: foundPokemon.nickname || "",
        memo: foundPokemon.memo || "",
        isFavorite: foundPokemon.isFavorite,
      };
    } else {
      isInCollection.value = false;
      collectionData.value = {
        id: null,
        nickname: "",
        memo: "",
        isFavorite: false,
      };
    }
  } catch (err) {
    console.error("コレクションステータス確認エラー:", err);
  }
}

// コレクションに追加
async function addToCollection() {
  try {
    const response = await fetch("/api/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pokemonId: pokemon.value.id,
        userId: 1, // 開発用の仮ユーザーID
        nickname: "",
        memo: "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "コレクションへの追加に失敗しました"
      );
    }

    const data = await response.json();
    collectionData.value = {
      id: data.id,
      nickname: data.nickname || "",
      memo: data.memo || "",
      isFavorite: data.isFavorite,
    };
    isInCollection.value = true;

    showStatusMessage("コレクションに追加しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション追加エラー:", err);
  }
}

// コレクション情報の更新
async function updateCollection() {
  try {
    const response = await fetch(`/api/collection/${collectionData.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: collectionData.value.nickname,
        memo: collectionData.value.memo,
        isFavorite: collectionData.value.isFavorite,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "更新に失敗しました");
    }

    showStatusMessage("情報を更新しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション更新エラー:", err);
  }
}

// コレクションから削除
async function removeFromCollection() {
  if (!confirm("本当にコレクションから削除しますか？")) return;

  try {
    const response = await fetch(`/api/collection/${collectionData.value.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "削除に失敗しました");
    }

    isInCollection.value = false;
    collectionData.value = {
      id: null,
      nickname: "",
      memo: "",
      isFavorite: false,
    };

    showStatusMessage("コレクションから削除しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション削除エラー:", err);
  }
}

// ステータスメッセージの表示
function showStatusMessage(message, type) {
  statusMessage.value = message;
  messageType.value = type;

  setTimeout(() => {
    statusMessage.value = "";
  }, 3000);
}

// タイプ名の日本語変換
function translateType(type) {
  const typeMap = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね",
    fairy: "フェアリー",
  };
  return typeMap[type] || type;
}

// ステータス名の日本語変換
function translateStat(stat) {
  const statMap = {
    hp: "HP",
    attack: "こうげき",
    defense: "ぼうぎょ",
    "special-attack": "とくこう",
    "special-defense": "とくぼう",
    speed: "すばやさ",
  };
  return statMap[stat] || stat;
}
</script>

<style scoped>
/* ページ全体のレイアウト */
.pokemon-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'DotGothic16', monospace;
}

/* 戻るボタン */
.back-button {
  padding: 8px 16px;
  background-color: var(--color-gray-200);
  border: 2px solid var(--color-gray-400);
  border-radius: 6px;
  font-family: 'DotGothic16', monospace;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: var(--color-gray-300);
  transform: translateY(-2px);
}

/* ポケモンサークル表示 */
.pokemon-circle-container {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%);
  border: 6px solid #d4d4d4;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-circle {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.5);
}

.circle-background {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 248, 248, 0.95) 40%,
    rgba(235, 235, 235, 0.9) 100%
  );
}

/* タイプ別の背景グラデーション */
.pokemon-circle[data-type="grass"] .circle-background,
.pokemon-circle[data-type="くさ"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(183, 230, 165, 0.4) 0%,
    rgba(122, 199, 76, 0.6) 50%,
    rgba(92, 183, 55, 0.9) 100%
  );
}

.pokemon-circle[data-type="fire"] .circle-background,
.pokemon-circle[data-type="ほのお"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(255, 204, 153, 0.4) 0%,
    rgba(238, 129, 48, 0.6) 50%,
    rgba(229, 96, 32, 0.9) 100%
  );
}

.pokemon-circle[data-type="water"] .circle-background,
.pokemon-circle[data-type="みず"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(185, 207, 250, 0.4) 0%,
    rgba(99, 144, 240, 0.6) 50%,
    rgba(67, 112, 208, 0.9) 100%
  );
}

.pokemon-circle[data-type="electric"] .circle-background,
.pokemon-circle[data-type="でんき"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(247, 208, 44, 0.3) 0%,
    rgba(247, 208, 44, 0.5) 50%,
    rgba(240, 192, 24, 0.8) 100%
  );
}

.pokemon-circle[data-type="psychic"] .circle-background,
.pokemon-circle[data-type="エスパー"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(249, 85, 135, 0.3) 0%,
    rgba(249, 85, 135, 0.5) 50%,
    rgba(232, 64, 112, 0.8) 100%
  );
}

.pokemon-circle[data-type="normal"] .circle-background,
.pokemon-circle[data-type="ノーマル"] .circle-background {
  background: radial-gradient(
    circle at center,
    rgba(168, 167, 122, 0.3) 0%,
    rgba(168, 167, 122, 0.5) 50%,
    rgba(145, 141, 93, 0.8) 100%
  );
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.circle-inner img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25));
  transition: transform 0.3s ease;
}

.pokemon-circle:hover .circle-inner img {
  transform: scale(1.1);
}

.circle-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 6px solid #c8c8c8;
  box-shadow: 
    inset 0 0 0 2px rgba(255, 255, 255, 0.9),
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 3;
  pointer-events: none;
}

/* ポケモン情報ヘッダー */
.pokemon-info-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.pokemon-info-header .pokemon-name {
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--gbc-green-dark);
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
}

.pokemon-info-header .pokemon-number {
  font-size: 0.9rem;
  color: #666;
}

.pokemon-types {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* ステータスカード */
.stats-card {
  background: linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%);
  border: 6px solid #d4d4d4;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stats-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--gbc-green-dark);
  text-align: center;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  width: 80px;
  font-size: 0.85rem;
  color: #333;
}

.stat-bar-container {
  flex: 1;
  height: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #999;
  border-radius: 8px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  background: linear-gradient(to right, var(--gbc-green-light) 0%, var(--gbc-green) 100%);
  transition: width 0.5s ease;
}

.stat-value {
  width: 40px;
  text-align: right;
  font-weight: bold;
  color: #333;
}

.body-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-top: 15px;
  border-top: 2px solid #d4d4d4;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
}

.info-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

/* コレクションカード */
.collection-card {
  background: linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%);
  border: 6px solid #d4d4d4;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.collection-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--gbc-green-dark);
  text-align: center;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.collection-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 0.9rem;
  color: #555;
  font-weight: bold;
}

.form-input,
.form-textarea {
  padding: 8px 12px;
  border: 2px solid #d4d4d4;
  border-radius: 6px;
  font-family: 'DotGothic16', monospace;
  font-size: 0.9rem;
  background: white;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--gbc-green);
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-save,
.btn-delete,
.btn-add,
.btn-home {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-family: 'DotGothic16', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-save {
  background: var(--gbc-green);
  color: white;
  flex: 1;
}

.btn-save:hover {
  background: var(--gbc-green-dark);
  transform: translateY(-2px);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-add {
  background: var(--gbc-green);
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
}

.btn-add:hover {
  background: var(--gbc-green-dark);
  transform: translateY(-2px);
}

.collection-empty {
  text-align: center;
  padding: 20px;
}

.collection-empty p {
  margin-bottom: 15px;
  color: #666;
}

/* ステータスメッセージ */
.status-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.status-message.success {
  background: var(--gbc-green);
  color: white;
}

.status-message.error {
  background: #e74c3c;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* エラー表示 */
.error-container,
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.error-card {
  background: white;
  border: 4px solid #e74c3c;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
}

.error-card h2 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.error-card p {
  color: #666;
  margin-bottom: 20px;
}

.btn-home {
  background: var(--gbc-green);
  color: white;
}

.btn-home:hover {
  background: var(--gbc-green-dark);
  transform: translateY(-2px);
}

/* ローディング */
.loading-container {
  flex-direction: column;
  gap: 15px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--gbc-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 0.9rem;
}
</style>