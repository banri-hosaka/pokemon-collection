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
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}

/* nav-buttonクラスはグローバルCSSで定義済み */

main {
  min-height: calc(100vh - 120px);
  padding: 20px;
}

footer {
  background-color: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-200);
  padding: 15px;
  text-align: center;
  color: var(--color-gray-600);
}
</style>
