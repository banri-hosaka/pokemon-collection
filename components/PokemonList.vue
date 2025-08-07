<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800">ポケモン図鑑</h1>
    
    <!-- 検索バー -->
    <div class="mb-8">
      <UInput
        v-model="searchQuery"
        placeholder="ポケモン名で検索..."
        icon="i-heroicons-magnifying-glass-20-solid"
        size="lg"
        :ui="{ 
          wrapper: 'w-full',
          base: 'w-full'
        }"
      />
    </div>
    
    <!-- ポケモングリッド -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <UCard
        v-for="pokemon in displayedPokemons"
        :key="pokemon.id"
        class="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        @click="navigateToPokemon(pokemon.id)"
        :ui="{
          body: {
            padding: 'p-4'
          }
        }"
      >
        <template #default>
          <div class="text-center">
            <img 
              :src="pokemon.sprites.front_default" 
              :alt="pokemon.japaneseName"
              class="w-24 h-24 mx-auto mb-2"
            />
            <h3 class="font-semibold text-gray-800 mb-1">
              {{ pokemon.japaneseName }}
            </h3>
            <p class="text-sm text-gray-600 mb-2">
              No.{{ pokemon.id.toString().padStart(3, "0") }}
            </p>
            <div class="flex justify-center gap-1 flex-wrap">
              <UBadge
                v-for="type in pokemon.types"
                :key="type.slot"
                :color="getTypeColor(type.type.name)"
                variant="solid"
                size="xs"
                class="text-white"
              >
                {{ translateType(type.type.name) }}
              </UBadge>
            </div>
          </div>
        </template>
      </UCard>
    </div>
    
    <!-- ローディングインジケーター -->
    <div v-if="loading" class="flex justify-center mt-8">
      <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin h-8 w-8 text-primary" />
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

// タイプごとのカラー設定（Nuxt UI用）
function getTypeColor(type) {
  const colorMap = {
    normal: 'gray',
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    ice: 'cyan',
    fighting: 'orange',
    poison: 'purple',
    ground: 'amber',
    flying: 'sky',
    psychic: 'pink',
    bug: 'lime',
    rock: 'stone',
    ghost: 'violet',
    dragon: 'indigo',
    dark: 'slate',
    steel: 'zinc',
    fairy: 'rose',
  };
  return colorMap[type] || 'gray';
}
</script>
