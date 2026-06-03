<template>
  <div class="root" ref="root">
    <div
      v-for="i in 100" :key="i"
      class="dot"
      :style="{
        '--col': (i - 1) % 10,
        '--row': Math.floor((i - 1) / 10),
        '--dist': Math.abs(4.5 - (i - 1) % 10) + Math.abs(4.5 - Math.floor((i - 1) / 10)),
      }"
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
  animation: fade-out 0.85s ease-out both;
}

.dot {
  position: absolute;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(210, 145, 160, 0.6);
  box-shadow: 0 0 12px rgba(210, 145, 160, 0.4);
  left: calc(1vw + var(--col) * 9.8vw);
  top: calc(1vh + var(--row) * 10vh);
  animation: dot-tsunami 0.85s cubic-bezier(0.2, 0.9, 0.3, 1.0) both;
  animation-delay: calc(var(--dist) * 0.04s);
}

@keyframes dot-tsunami {
  0%   { transform: scale(0.2); opacity: 0; }
  10%  { transform: scale(3.5); opacity: 0.9; box-shadow: 0 0 30px rgba(210, 145, 160, 0.7); }
  35%  { transform: scale(0.6); opacity: 0.5; }
  55%  { transform: scale(2.2); opacity: 0.35; }
  80%  { transform: scale(0.8); opacity: 0.15; }
  100% { transform: scale(0); opacity: 0; }
}

@keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>
