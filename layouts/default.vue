<template>
  <div>
    <header>
      <nav class="navigation">
        <NuxtLink to="/" class="nav-button">ポケモン図鑑</NuxtLink>
        <NuxtLink to="debug" class="nav-button">デバッグデモ</NuxtLink>
        <NuxtLink to="button" class="nav-button">Figmaサンプル</NuxtLink>
        <!-- <NuxtLink to="/about" class="nav-button">アバウト</NuxtLink> -->
      </nav>
    </header>
    <main>
      <slot />
      <!-- ここにページコンテンツが表示される -->
    </main>
    <footer>
      <p>© 2025 pokemon-collection</p>
    </footer>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  justify-content: left;
  gap: 10px;
  padding: 15px;
}

.nav-button {
  display: inline-block;
  background: #19eace;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: #16cbb3;
}
</style>
