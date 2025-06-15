<template>
  <button class="sample-button" @click="handleClick">
    <slot>サンプルボタン</slot>
  </button>
</template>

<script setup lang="ts">
// プロパティの定義
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

// イベントの定義
const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};
</script>

<style scoped>
.sample-button {
  /* Figmaからコピーしたスタイル */
  box-sizing: border-box;

  /* オートレイアウト */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 8px;

  position: relative;
  width: 128px;
  height: 40px;

  background: #14ae5c;
  border: 1px solid #2c2c2c;
  border-radius: 8px;

  /* 追加スタイル */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-button:hover {
  background: #12a055;
  transform: translateY(-1px);
}

.sample-button:active {
  transform: translateY(0);
}

.sample-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}
</style>
