<template>
  <div class="root" ref="root">
    <div
      v-for="i in 81" :key="i"
      class="shard"
      :style="{
        '--col': (i - 1) % 9,
        '--row': Math.floor((i - 1) / 9),
        '--dist': Math.abs(4 - (i - 1) % 9) + Math.abs(4 - Math.floor((i - 1) / 9)),
        '--angle': (i * 37) % 360,
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
  animation: fade-out 0.75s ease-out both;
}

.shard {
  position: absolute;
  left: calc(2vw + var(--col) * 10.7vw);
  top: calc(2vh + var(--row) * 10.7vh);
  width: 18px; height: 18px;
  border: 1.8px solid rgba(210, 145, 160, 0.5);
  background: rgba(210, 145, 160, 0.08);
  transform: rotate(45deg);
  animation: shard-blast 0.75s cubic-bezier(0.2, 0.9, 0.3, 1.15) both;
  animation-delay: calc(var(--dist) * 0.035s);
}

@keyframes shard-blast {
  0%   {
    transform: rotate(45deg) scale(0);
    opacity: 0;
    border-color: rgba(210, 145, 160, 0.2);
  }
  20%  {
    transform: rotate(calc(45deg + var(--angle) * 0.5deg)) scale(2.5);
    opacity: 0.95;
    border-color: rgba(230, 160, 180, 0.9);
    box-shadow:
      0 0 16px rgba(210, 145, 160, 0.5),
      inset 0 0 8px rgba(210, 145, 160, 0.2);
    background: rgba(210, 145, 160, 0.2);
  }
  55%  {
    transform:
      rotate(calc(45deg + var(--angle) * 1deg))
      translate(calc((var(--col) - 4) * 8px), calc((var(--row) - 4) * 8px))
      scale(1.4);
    opacity: 0.5;
    box-shadow: 0 0 8px rgba(210, 145, 160, 0.2);
  }
  100% {
    transform:
      rotate(calc(45deg + var(--angle) * 2deg))
      translate(calc((var(--col) - 4) * 24px), calc((var(--row) - 4) * 24px))
      scale(0);
    opacity: 0;
  }
}

@keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>
