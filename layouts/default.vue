<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">ホーム</NuxtLink>
        <NuxtLink to="/about">アバウト</NuxtLink>
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
