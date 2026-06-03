<template>
  <div class="root" ref="root">
    <div
      v-for="i in 48" :key="i"
      class="block"
      :style="{
        '--col': (i - 1) % 8,
        '--row': Math.floor((i - 1) / 8),
        '--flip': (i % 3 - 1) * 180,
        '--drift': (i % 5 - 2) * 30,
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
  animation: fade-out 0.7s ease-out both;
}

.block {
  position: absolute;
  left: calc(4vw + var(--col) * 11.5vw);
  top: calc(3vh + var(--row) * 13.5vh);
  width: 22px; height: 22px;
  border: 2px solid rgba(210, 145, 160, 0.5);
  background: rgba(210, 145, 160, 0.1);
  animation: block-explode 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.15) both;
  animation-delay: calc((var(--col) + var(--row)) * 0.025s);
}

@keyframes block-explode {
  0%   {
    transform: translateY(-40px) rotateX(0deg) rotateZ(0deg) scale(0);
    opacity: 0;
  }
  25%  {
    transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1.5);
    opacity: 0.9;
    border-color: rgba(230, 160, 175, 0.8);
    box-shadow: 0 0 20px rgba(210, 145, 160, 0.4);
  }
  60%  {
    transform:
      translate(calc(var(--drift) * 1px), calc(var(--drift) * -0.5px))
      rotateX(calc(var(--flip) * 1deg))
      rotateZ(calc(var(--flip) * 0.5deg))
      scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform:
      translate(calc(var(--drift) * 4px), calc(var(--drift) * -2px))
      rotateX(calc(var(--flip) * 2deg))
      rotateZ(calc(var(--flip) * 1.5deg))
      scale(0);
    opacity: 0;
  }
}

@keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>
