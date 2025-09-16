<template>
  <div>
    <h1>デバッグページ</h1>

    <!-- 非同期処理学習セクション -->
    <section>
      <AsyncLearningExample />
    </section>

    <!-- Composition API学習セクション -->
    <section>
      <CompositionAPILearning />
    </section>

    <!-- ルーティング学習セクション -->
    <section>
      <RoutingLearning />
    </section>

    <!-- CSS学習セクション -->
    <section>
      <CSSLearning />
    </section>

    <!-- 既存のデバッグコンソール -->
    <section>
      <TestDebugConsole />
    </section>
  </div>
</template>

<script setup>
import AsyncLearningExample from '~/components/AsyncLearningExample.vue'
import CompositionAPILearning from '~/components/CompositionAPILearning.vue'
import RoutingLearning from '~/components/RoutingLearning.vue'
import CSSLearning from '~/components/CSSLearning.vue'
import TestDebugConsole from '~/components/TestDebugConsole.vue'
</script>
