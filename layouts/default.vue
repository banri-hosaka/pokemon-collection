<template>
  <div>
    <header>
      <nav class="navigation">
        <NuxtLink to="/" class="nav-button">ポケモン図鑑</NuxtLink>
        <NuxtLink to="/debug" class="nav-button">デバッグデモ</NuxtLink>
        <NuxtLink to="/button" class="nav-button">Figmaサンプル</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
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
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.nav-button {
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: #45a049;
}

main {
  min-height: calc(100vh - 120px);
  padding: 20px;
}

footer {
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  color: #666;
}
</style>
