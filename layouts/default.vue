<template>
  <div class="min-h-screen flex flex-col">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <UContainer>
        <nav class="flex items-center gap-4 py-4">
          <UButton 
            to="/" 
            variant="solid"
            color="primary"
            size="md"
          >
            ポケモン図鑑
          </UButton>
          <UButton 
            to="/debug" 
            variant="ghost"
            color="gray"
            size="md"
          >
            デバッグデモ
          </UButton>
          <UButton 
            to="/button" 
            variant="ghost"
            color="gray"
            size="md"
          >
            Figmaサンプル
          </UButton>
        </nav>
      </UContainer>
    </header>
    
    <!-- メインコンテンツ -->
    <main class="flex-1">
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </main>
    
    <!-- フッター -->
    <footer class="bg-gray-100 border-t border-gray-200">
      <UContainer>
        <div class="py-4 text-center text-sm text-gray-600">
          © 2025 pokemon-collection
        </div>
      </UContainer>
    </footer>
  </div>
</template>
