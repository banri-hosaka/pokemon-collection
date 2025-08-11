<template>
  <div class="pokemon-list">
    <h1>ポケモン図鑑</h1>
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ポケモン名で検索..."
        class="search-input"
      />
    </div>
    <div class="pokemon-grid">
      <div
        v-for="pokemon in displayedPokemons"
        :key="pokemon.id"
        class="pokemon-card"
        :data-type="pokemon.types[0]?.type.name"
        @click="navigateToPokemon(pokemon.id)"
      >
        <div class="pokemon-card-inner">
          <!-- カードヘッダー -->
          <div class="card-header">
            <span class="pokemon-number">No.{{ pokemon.id.toString().padStart(3, "0") }}</span>
            <span class="pokemon-name">{{ pokemon.japaneseName }}</span>
          </div>
          
          <!-- イラスト枠 -->
          <div class="card-artwork">
            <img :src="pokemon.sprites.front_default" :alt="pokemon.japaneseName" />
          </div>
          
          <!-- タイプバッジ部分 -->
          <div class="card-footer">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const pokemons = ref([]);
const searchQuery = ref("");
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 20;
const isScrollListenerActive = ref(true);

// ライフサイクルフック：コンポーネントのマウント時
onMounted(async () => {
  console.log("PokemonList コンポーネントがマウントされました");
  try {
    await loadInitialPokemons();
    window.addEventListener("scroll", handleScroll);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// ライフサイクルフック：コンポーネントのアンマウント前
onBeforeUnmount(() => {
  console.log("PokemonList コンポーネントがアンマウントされます");
  window.removeEventListener("scroll", handleScroll);
});

// 検索結果の計算プロパティ
const displayedPokemons = computed(() => {
  if (!searchQuery.value) return pokemons.value;

  const query = searchQuery.value.toLowerCase();
  return pokemons.value.filter(
    (pokemon) =>
      pokemon.japaneseName.includes(query) ||
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.id.toString() === query
  );
});

// 初期ポケモンデータの読み込み
async function loadInitialPokemons() {
  const loadedPokemons = [];

  for (let i = 1; i <= itemsPerPage; i++) {
    try {
      const response = await fetch(`/api/pokemon/${i}`);
      if (!response.ok) throw new Error("ポケモン取得に失敗しました");
      const data = await response.json();
      loadedPokemons.push(data);
    } catch (err) {
      console.error(`ポケモンID ${i} の取得中にエラー:`, err);
    }
  }

  pokemons.value = loadedPokemons;
}

// 無限スクロール用の処理
async function loadMorePokemons() {
  if (loading.value || !isScrollListenerActive.value) return;

  loading.value = true;
  currentPage.value++;

  const startIndex = (currentPage.value - 1) * itemsPerPage + 1;
  const endIndex = currentPage.value * itemsPerPage;

  for (let i = startIndex; i <= endIndex; i++) {
    try {
      const response = await fetch(`/api/pokemon/${i}`);
      if (!response.ok) {
        // 404の場合はもうポケモンがない可能性が高いので、リスナーを無効化
        if (response.status === 404) {
          isScrollListenerActive.value = false;
          break;
        }
        throw new Error("ポケモン取得に失敗しました");
      }
      const data = await response.json();
      pokemons.value.push(data);
    } catch (err) {
      console.error(`ポケモンID ${i} の取得中にエラー:`, err);
    }
  }

  loading.value = false;
}

// スクロールイベントハンドラ
function handleScroll() {
  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;

  if (
    scrollPosition >= pageHeight - 500 &&
    !loading.value &&
    isScrollListenerActive.value
  ) {
    loadMorePokemons();
  }
}

// ポケモン詳細ページへの遷移
function navigateToPokemon(id) {
  router.push(`/pokemon/${id}`);
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

// タイプの絵文字を取得
function getTypeEmoji(type) {
  const emojiMap = {
    normal: "⭐",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "👊",
    poison: "☠️",
    ground: "⛰️",
    flying: "🦅",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐲",
    dark: "🌙",
    steel: "⚙️",
    fairy: "✨",
  };
  return emojiMap[type] || "⭐";
}
</script>

<style scoped>
.pokemon-list {
  padding: 20px;
}

.pokemon-list h1 {
  font-family: 'DotGothic16', monospace;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--gbc-green-dark);
  text-shadow: 2px 2px 0px var(--gbc-green-light);
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-300);
  font-size: 16px;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

/* シンプルなポケモンカード風スタイル */
.pokemon-card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px 6px 0 0;
  font-size: 0.65rem;
  font-weight: bold;
  border-bottom: 2px solid #d4d4d4;
}

.pokemon-number {
  font-family: 'DotGothic16', monospace;
  font-size: 0.6rem;
  color: #555;
}

.pokemon-name {
  flex: 1;
  font-family: 'DotGothic16', monospace;
  font-size: 0.75rem;
  color: #000;
}

.card-artwork {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
  padding: 8px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(245, 245, 245, 0.6) 100%
  );
  border: 4px solid #d4d4d4;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.pokemon-card img {
  width: 100%;
  height: 100%;
  max-width: 110px;
  max-height: 110px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.15));
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 2px solid #d4d4d4;
  border-radius: 0 0 6px 6px;
}

.pokemon-types {
  display: flex;
  gap: 4px;
}

.type-badge {
  font-family: 'DotGothic16', monospace;
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* グローバルCSSのタイプスタイルを使用 */
</style>
