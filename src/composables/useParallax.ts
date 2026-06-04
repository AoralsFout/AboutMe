// 计算视差直接返回样式字符串

import { ref, computed, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
let listeners = 0
let rafId: number | null = null
let pendingX = 0
let pendingY = 0

function onMouseMove(e: MouseEvent) {
  pendingX = (e.clientX / window.innerWidth) * 2 - 1
  pendingY = (e.clientY / window.innerHeight) * 2 - 1
  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      mouseX.value = pendingX
      mouseY.value = pendingY
      rafId = null
    })
  }
}

export function useParallax(depth: number = 1) {
  onMounted(() => {
    if (listeners === 0) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }
    listeners++
  })

  onUnmounted(() => {
    listeners--
    if (listeners === 0) {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  })

  const maxOffset = 30
  const enabled = computed(() => window.innerWidth >= 768 ? 1 : 0);

  return computed(() => ({
    transform: `translate3d(${mouseX.value * depth * maxOffset * enabled.value}px, ${mouseY.value * depth * maxOffset * enabled.value}px, 0)`,
    transition: 'transform 0.15s ease-out',
  }))
}
