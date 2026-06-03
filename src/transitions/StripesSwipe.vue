<template>
  <div class="root" ref="root">
    <!-- 左上→右下斜线 -->
    <div
      v-for="i in 18" :key="'a-' + i"
      class="stripe stripe-a"
      :style="{ '--top': 1 + i * 5.3, '--d': (i % 6) * 0.04 }"
    />
    <!-- 右上→左下斜线 -->
    <div
      v-for="i in 18" :key="'b-' + i"
      class="stripe stripe-b"
      :style="{ '--top': 2 + i * 5.3, '--d': (i % 6) * 0.04 + 0.1 }"
    />
    <!-- 水平扫线 -->
    <div
      v-for="i in 10" :key="'h-' + i"
      class="stripe stripe-h"
      :style="{ '--top': 3 + i * 9.8, '--d': (i % 5) * 0.05 }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const emit = defineEmits<{ done: [] }>()
const root = ref<HTMLElement>()
onMounted(() => {
  root.value?.addEventListener('animationend', () => emit('done'), { once: true })
})
</script>

<style scoped>
.root {
  position: fixed; inset: 0; z-index: 999; pointer-events: none;
  overflow: hidden;
  animation: fade-out 0.8s ease-out both;
}

.stripe {
  position: absolute;
  top: calc(var(--top) * 1vh);
  height: 3px;
  background: rgba(210, 145, 160, 0.45);
  box-shadow: 0 0 8px rgba(210, 145, 160, 0.3);
}

.stripe-a { left: -50vw; width: 120vw; transform: rotate(-38deg); }
.stripe-b { left: -50vw; width: 120vw; transform: rotate(38deg); }
.stripe-h { left: -20vw; width: 140vw; }

@keyframes swipe-right {
  0%   { transform: translateX(-60vw); opacity: 0; }
  20%  { transform: translateX(10vw); opacity: 0.8; }
  60%  { transform: translateX(60vw); opacity: 0.5; }
  100% { transform: translateX(140vw); opacity: 0; }
}

.stripe-a      { animation: swipe-right 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.0) both; animation-delay: calc(var(--d) * 1s); }
.stripe-b      { animation: swipe-left  0.8s cubic-bezier(0.2, 0.9, 0.3, 1.0) both; animation-delay: calc(var(--d) * 1s); }
.stripe-h      { animation: swipe-right 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.0) both; animation-delay: calc(var(--d) * 1s); }

@keyframes swipe-left {
  0%   { transform: translateX(100vw); opacity: 0; }
  20%  { transform: translateX(30vw); opacity: 0.8; }
  60%  { transform: translateX(-30vw); opacity: 0.5; }
  100% { transform: translateX(-100vw); opacity: 0; }
}

@keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>
