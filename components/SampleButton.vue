<template>
  <UButton
    :disabled="disabled"
    :variant="variant"
    :color="color"
    :size="size"
    :block="block"
    :loading="loading"
    :icon="icon"
    :trailing-icon="trailingIcon"
    class="custom-button"
    @click="handleClick"
  >
    <slot>サンプルボタン</slot>
  </UButton>
</template>

<script setup lang="ts">
// プロパティの定義
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as () => 'solid' | 'outline' | 'soft' | 'ghost' | 'link',
    default: 'solid',
  },
  color: {
    type: String,
    default: 'green', // Figmaのデザインに合わせて緑色
  },
  size: {
    type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    default: 'md',
  },
  block: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  trailingIcon: {
    type: String,
    default: '',
  },
});

// イベントの定義
const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<style scoped>
/* Figmaデザインに準拠したカスタムスタイル */
.custom-button {
  min-width: 128px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-button:deep(.nuxt-icon) {
  transition: transform 0.2s ease;
}

.custom-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.custom-button:active:not(:disabled) {
  transform: translateY(0);
}
</style>
