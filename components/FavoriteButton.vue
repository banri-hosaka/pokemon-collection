<!-- お気に入りボタン -->
<template>
  <button
    class="favorite-button"
    :class="{ active: isFavorite }"
    :title="isFavorite ? 'お気に入りから削除' : 'お気に入りに登録'"
    @click.stop="toggleFavorite"
  >
    <span v-if="isFavorite" class="heart-filled">♥</span>
    <span v-else class="heart-empty">🤍</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  pokemonId: {
    type: Number,
    required: true,
  },
});

const isFavorite = ref(false);
onMounted(() => {
  const favorites = JSON.parse(localStorage.getItem("pokemonFavorites")) || [];
  isFavorite.value = favorites.includes(props.pokemonId);
});

const toggleFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem("pokemonFavorites")) || [];
  if (isFavorite.value) {
    // お気に入りから削除
    const index = favorites.indexOf(props.pokemonId);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    isFavorite.value = false;
  } else {
    // お気に入りに追加
    favorites.push(props.pokemonId);
    isFavorite.value = true;
  }
  localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
};
</script>

<style scoped>
.favorite-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.favorite-button .heart-filled {
  color: red;
}

.favorite-button .heart-empty {
  color: gray;
}
</style>
