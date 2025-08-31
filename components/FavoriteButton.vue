<!-- お気に入りボタン -->
<template>
  <a>♥</a>
</template>

<script setup>
import { ref } from "vue";

const isFavorite = ref(false);

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
}
</script>

<style scoped>
a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
</style>
