<!-- components/PokemonLoader.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";

// ポケモンデータ（IDと名前の配列）
const pokemons = [
  { id: 25, name: "ピカチュウ" },
  { id: 1, name: "フシギダネ" },
  { id: 4, name: "ヒトカゲ" },
  { id: 7, name: "ゼニガメ" },
  { id: 133, name: "イーブイ" },
  // 好きなポケモンを追加
];

const randomPokemon = ref(pokemons[0]);

onMounted(() => {
  // ランダムなポケモンを選択
  randomPokemon.value = pokemons[Math.floor(Math.random() * pokemons.length)];
});

defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div v-if="loading" class="pokemon-loader">
    <div class="pokemon-container">
      <img
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.id}.png`"
        :alt="randomPokemon.name"
        class="pokemon-image"
      />
      <div class="pokemon-name">{{ randomPokemon.name }}</div>
      <div class="loading-text">Now Loading...</div>
      <div class="pokeball-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.pokemon-container {
  text-align: center;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  animation: bounce 1.5s infinite alternate;
}

.pokemon-name {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
}

.loading-text {
  margin-top: 8px;
  font-size: 18px;
  color: #666;
}

.pokeball-spinner {
  width: 50px;
  height: 50px;
  margin: 20px auto 0;
  background: linear-gradient(
    to bottom,
    #ff0000 0%,
    #ff0000 50%,
    #ffffff 50%,
    #ffffff 100%
  );
  border-radius: 50%;
  border: 3px solid #333;
  position: relative;
  animation: spin 1.5s linear infinite;
}

.pokeball-spinner::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 2px solid #333;
}
</style>
