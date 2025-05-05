<template>
  <div class="pokemon-list">
    <h2>ポケモン図鑑</h2>
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ポケモン名で検索..."
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

.search-container {
  margin-bottom: 20px;
}

.search-container input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pokemon-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.pokemon-info h3 {
  margin: 10px 0 5px;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
}

.pokemon-types span {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 12px;
  color: white;
}

/* タイプ別の色設定 */
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
