<template>
  <div v-if="pokemon" class="pokemon-detail">
    <div class="back-button" @click="router.back()">← 戻る</div>

    <div class="pokemon-header">
      <div class="pokemon-image">
        <img :src="pokemon.sprites.front_default" :alt="pokemon.japaneseName" />
      </div>
      <div class="pokemon-basic-info">
        <h1>{{ pokemon.japaneseName }}</h1>
        <p class="pokemon-id">
          No.{{ pokemon.id.toString().padStart(3, "0") }}
        </p>
        <div class="pokemon-types">
          <span
            v-for="type in pokemon.types"
            :key="type.slot"
            :class="'type-' + type.type.name"
          >
            {{ translateType(type.type.name) }}
          </span>
        </div>
      </div>
    </div>

    <div class="detail-tabs">
      <button
        :class="{ active: activeTab === 'info' }"
        @click="activeTab = 'info'"
      >
        詳細情報
      </button>
      <button
        :class="{ active: activeTab === 'collection' }"
        @click="activeTab = 'collection'"
      >
        コレクション
      </button>
    </div>

    <div v-if="activeTab === 'info'" class="info-tab">
      <div class="stats-section">
        <h3>ステータス</h3>
        <div class="stat-bars">
          <div
            v-for="stat in pokemon.stats"
            :key="stat.stat.name"
            class="stat-item"
          >
            <div class="stat-name">{{ translateStat(stat.stat.name) }}</div>
            <div class="stat-bar-container">
              <div
                class="stat-bar"
                :style="{ width: `${(stat.base_stat / 255) * 100}%` }"
              ></div>
            </div>
            <div class="stat-value">{{ stat.base_stat }}</div>
          </div>
        </div>
      </div>

      <div class="physical-info">
        <div class="info-item">
          <h4>たかさ</h4>
          <p>{{ (pokemon.height / 10).toFixed(1) }}m</p>
        </div>
        <div class="info-item">
          <h4>おもさ</h4>
          <p>{{ (pokemon.weight / 10).toFixed(1) }}kg</p>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'collection'" class="collection-tab">
      <div v-if="isInCollection" class="collection-data">
        <h3>コレクション情報</h3>

        <div class="form-group">
          <label for="nickname">ニックネーム:</label>
          <input
            id="nickname"
            v-model="collectionData.nickname"
            placeholder="ニックネームを入力"
          />
        </div>

        <div class="form-group">
          <label for="memo">メモ:</label>
          <textarea
            id="memo"
            v-model="collectionData.memo"
            placeholder="メモを入力"
          />
        </div>

        <div class="form-group checkbox">
          <input
            type="checkbox"
            id="favorite"
            v-model="collectionData.isFavorite"
          />
          <label for="favorite">お気に入りに登録</label>
        </div>

        <div class="collection-actions">
          <button class="save-button" @click="updateCollection">保存</button>
          <button class="delete-button" @click="removeFromCollection">
            コレクションから削除
          </button>
        </div>
      </div>

      <div v-else class="collection-empty">
        <p>このポケモンはまだコレクションに追加されていません。</p>
        <button class="add-button" @click="addToCollection">
          コレクションに追加
        </button>
      </div>
    </div>

    <div class="status-message" :class="messageType" v-if="statusMessage">
      {{ statusMessage }}
    </div>
  </div>

  <div v-else-if="error" class="error-container">
    <h2>エラーが発生しました</h2>
    <p>{{ error }}</p>
    <button @click="router.push('/')">トップページに戻る</button>
  </div>

  <div v-else class="loading-container">
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
const activeTab = ref("info");
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
.pokemon-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.pokemon-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.pokemon-image {
  width: 150px;
  height: 150px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.pokemon-image img {
  width: 120px;
  height: 120px;
}

.pokemon-basic-info h1 {
  margin: 0;
  font-size: 2rem;
}

.pokemon-id {
  font-size: 1.2rem;
  color: #666;
  margin: 5px 0;
}

.pokemon-types {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.pokemon-types span {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  color: white;
}

.detail-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.detail-tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.detail-tabs button.active {
  opacity: 1;
  border-bottom: 3px solid #2196f3;
}

.stats-section {
  margin-bottom: 30px;
}

.stat-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-name {
  width: 100px;
}

.stat-bar-container {
  flex-grow: 1;
  height: 15px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 10px;
}

.stat-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 10px;
}

.stat-value {
  width: 30px;
  text-align: right;
}

.physical-info {
  display: flex;
  justify-content: space-around;
}

.info-item {
  text-align: center;
}

.collection-tab {
  padding: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  width: auto;
  margin-right: 10px;
}

.collection-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-button,
.add-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.status-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  z-index: 100;
}

.status-message.success {
  background-color: #4caf50;
}

.status-message.error {
  background-color: #f44336;
}

.error-container,
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

/* タイプ別の色設定（前述と同じ） */
.type-normal {
  background-color: #a8a878;
}
.type-fire {
  background-color: #f08030;
}
.type-water {
  background-color: #6890f0;
}
.type-electric {
  background-color: #f8d030;
}
.type-grass {
  background-color: #78c850;
}
.type-ice {
  background-color: #98d8d8;
}
.type-fighting {
  background-color: #c03028;
}
.type-poison {
  background-color: #a040a0;
}
.type-ground {
  background-color: #e0c068;
}
.type-flying {
  background-color: #a890f0;
}
.type-psychic {
  background-color: #f85888;
}
.type-bug {
  background-color: #a8b820;
}
.type-rock {
  background-color: #b8a038;
}
.type-ghost {
  background-color: #705898;
}
.type-dragon {
  background-color: #7038f8;
}
.type-dark {
  background-color: #705848;
}
.type-steel {
  background-color: #b8b8d0;
}
.type-fairy {
  background-color: #ee99ac;
}
</style>
