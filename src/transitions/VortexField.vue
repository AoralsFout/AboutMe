<template>
  <div class="root" ref="root">
    <svg class="stage" viewBox="0 0 1000 600">
      <!-- 5 个涡旋中心 -->
      <g v-for="v in 5" :key="'v-' + v">
        <!-- 膨胀环 -->
        <circle
          v-for="r in 4" :key="'ring-' + r"
          class="v-ring"
          :cx="vx(v)" :cy="vy(v)" :r="25 + r * 22"
          :style="{ '--v': v, '--r': r }"
        />
        <!-- 轨道点 (3 层 × 12 = 36 per vortex) -->
        <circle
          v-for="d in 36" :key="'dot-' + d"
          class="v-dot"
          :cx="vx(v)" :cy="vy(v)" r="3"
          :style="{
            '--v': v,
            '--orbit': 30 + Math.floor((d - 1) / 12) * 24,
            '--angle': ((d - 1) % 12) * 30,
          }"
        />
      </g>
      <!-- 涡旋间连接线 -->
      <line
        v-for="(pair, pi) in vortexPairs" :key="'ln-' + pi"
        class="v-line"
        :x1="pair.x1" :y1="pair.y1"
        :x2="pair.x2" :y2="pair.y2"
        :style="{ '--pi': pi }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const emit = defineEmits<{ done: [] }>()
const root = ref<HTMLElement>()

const vx = (v: number) => [160, 500, 840, 300, 700][v - 1]!
const vy = (v: number) => [180, 120, 200, 420, 400][v - 1]!

const vortexPairs = [
  { x1: 160, y1: 180, x2: 500, y2: 120 },
  { x1: 500, y1: 120, x2: 840, y2: 200 },
  { x1: 160, y1: 180, x2: 300, y2: 420 },
  { x1: 300, y1: 420, x2: 700, y2: 400 },
  { x1: 700, y1: 400, x2: 840, y2: 200 },
  { x1: 500, y1: 120, x2: 700, y2: 400 },
]

onMounted(() => {
  root.value?.addEventListener('animationend', () => emit('done'), { once: true })
})
</script>

<style scoped>
.root {
  position: fixed; inset: 0; z-index: 999; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  animation: fade-out 0.8s ease-out both;
}
.stage { width: 100vw; height: 100vh; }

/* --- 膨胀环 --- */
.v-ring {
  fill: none;
  stroke: rgba(210, 145, 160, 0.45);
  stroke-width: 1.5;
  animation: vortex-ring 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.1) both;
  animation-delay: calc(var(--r) * 0.05s + var(--v) * 0.03s);
}

@keyframes vortex-ring {
  0%   { transform: scale(0.1); opacity: 0; stroke-width: 3; }
  25%  { transform: scale(4.5); opacity: 0.8; }
  100% { transform: scale(10); opacity: 0; stroke-width: 0.3; }
}

/* --- 轨道点 --- */
.v-dot {
  fill: rgba(210, 145, 160, 0.65);
  animation: vortex-orbit 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.0) both;
  animation-delay: calc(
    var(--orbit) * 0.003s +
    var(--angle) * 0.001s +
    var(--v) * 0.02s
  );
}

@keyframes vortex-orbit {
  0%   {
    transform:
      rotate(calc(var(--angle) * 1deg))
      translateX(calc(var(--orbit) * 1px))
      scale(0);
    opacity: 0;
  }
  25%  {
    transform:
      rotate(calc(var(--angle) * 1deg + 180deg))
      translateX(calc(var(--orbit) * 2.5px))
      scale(2);
    opacity: 1;
  }
  60%  {
    transform:
      rotate(calc(var(--angle) * 1deg + 420deg))
      translateX(calc(var(--orbit) * 5px))
      scale(1);
    opacity: 0.4;
  }
  100% {
    transform:
      rotate(calc(var(--angle) * 1deg + 600deg))
      translateX(calc(var(--orbit) * 8px))
      scale(0);
    opacity: 0;
  }
}

/* --- 连接线 --- */
.v-line {
  stroke: rgba(210, 145, 160, 0.2);
  stroke-width: 1;
  stroke-dasharray: 15 30;
  animation: vline-flash 0.8s ease-out both;
  animation-delay: calc(var(--pi) * 0.06s);
}

@keyframes vline-flash {
  0%   { opacity: 0; stroke-dashoffset: 0; stroke-width: 2; }
  30%  { opacity: 0.6; }
  100% { opacity: 0; stroke-dashoffset: -60; }
}

@keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>
