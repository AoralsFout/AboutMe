<template>
  <div class="page-controls">
    <div class="controls-panel">
      <button v-for="page in pages" :key="page.id" class="page-btn" :class="{ active: page.id === currentPageId }"
        @click="$emit('switch', page.id)" :title="`切换到页面 ${page.id}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  pages: { id: number; component: Component }[]
  currentPageId: number
}>()

defineEmits<{
  switch: [id: number]
}>()
</script>

<style scoped>
.page-controls {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.controls-panel {
  --btn-gap: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--btn-gap);
  padding: 16px 12px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.03);
}

.page-btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  position: relative;
}

.page-btn:not(:first-child)::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(var(--btn-gap) - 6px);
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.page-btn::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: transparent;
  transition: box-shadow 0.3s ease;
}

.page-btn:hover {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.2);
}

.page-btn:hover::after {
  box-shadow: 0 0 14px rgba(168, 180, 255, 0.5);
}

.page-btn.active {
  border-color: rgba(168, 180, 255, 0.9);
  background: rgba(168, 180, 255, 0.55);
  box-shadow: 0 0 10px rgba(168, 180, 255, 0.5);
  transform: scale(1.15);
}

.page-btn.active::after {
  box-shadow: 0 0 18px rgba(168, 180, 255, 0.6);
  animation: active-pulse 2s ease-in-out infinite;
}

@keyframes active-pulse {

  0%,
  100% {
    box-shadow: 0 0 12px rgba(168, 180, 255, 0.4);
  }

  50% {
    box-shadow: 0 0 24px rgba(168, 180, 255, 0.75);
  }
}
</style>
