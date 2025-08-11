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
        @click="navigateToPokemon(pokemon.id)"
      >
        <img :src="pokemon.sprites.front_default" :alt="pokemon.japaneseName" />
        <div class="pokemon-info">
          <h3>{{ pokemon.japaneseName }}</h3>
          <p>No.{{ pokemon.id.toString().padStart(3, "0") }}</p>
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

/* ポケモンカードはグローバルスタイルを活用 */
.pokemon-card {
  background-color: var(--color-gray-50);
}

.pokemon-card img {
  width: 96px;
  height: 96px;
  margin: 0 auto;
}

.pokemon-info h3 {
  margin: 10px 0 5px;
  font-family: 'DotGothic16', monospace;
  font-weight: 600;
  color: var(--gbc-green-darkest);
  position: relative;
  z-index: 2;
}

.pokemon-info p {
  font-family: 'DotGothic16', monospace;
  color: var(--retro-brown);
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  position: relative;
  z-index: 2;
}

/* タイプバッジにレトロ風のボーダー */
.pokemon-types span {
  font-family: 'DotGothic16', monospace;
  font-size: 0.7rem;
  padding: 2px 6px;
  border: 2px solid var(--gbc-green-darkest);
  box-shadow: 
    2px 2px 0px var(--gbc-green-dark),
    inset 1px 1px 0px rgba(255, 255, 255, 0.3);
}

/* グローバルCSSのタイプスタイルを使用するため、個別定義は削除 */
</style>
