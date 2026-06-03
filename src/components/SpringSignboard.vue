<template>
  <div class="signboard" :class="side">
    <div class="spring-movable" :style="{ transform: `rotate(${rotation}deg)` }">
      <div class="board" :style="{ backgroundImage: `url('${boardImage}')` }" @mousedown="startDrag" @mouseup="endDrag" />
      <div class="top" />
      <div class="spring-el" :style="{ height: `${springHeight}px` }" />
    </div>
    <div class="base" ref="baseEl" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

defineProps<{
  side: 'left' | 'right'
  boardImage: string
}>()

const MAX_STRETCH = 200
const MAX_ROTATION = 80
const SPRING_LENGTH = 96
const DAMPING = 0.95
const SPRING_CONSTANT = 0.1
const ROTATION_CONSTANT = 0.05

const baseEl = ref<HTMLDivElement | null>(null)
const rotation = ref(0)
const stretch = ref(0)
const springHeight = ref(SPRING_LENGTH)
const stretchVelocity = ref(0)
const rotationVelocity = ref(0)
const animationId = ref<number | null>(null)
const isDragging = ref(false)

let dragStartX = 0
let dragStartY = 0

function startDrag(e: MouseEvent) {
  e.preventDefault()
  isDragging.value = true
  dragStartX = e.clientX
  dragStartY = e.clientY

  if (animationId.value) cancelAnimationFrame(animationId.value)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
}

function onDrag(e: MouseEvent) {
  e.preventDefault()
  if (!isDragging.value || !baseEl.value) return

  const rect = baseEl.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = e.clientX - centerX
  const dy = e.clientY - centerY

  const targetAngle = Math.atan2(dx, -dy) * (180 / Math.PI)
  rotation.value = Math.min(Math.max(targetAngle, -MAX_ROTATION), MAX_ROTATION)

  const deltaX = e.clientX - dragStartX
  const deltaY = e.clientY - dragStartY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  stretch.value = Math.min(deltaY < 0 ? distance : -distance, MAX_STRETCH)
  springHeight.value = SPRING_LENGTH + stretch.value
}

function endDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  startAnimation()
}

function startAnimation() {
  const animate = () => {
    stretchVelocity.value += -SPRING_CONSTANT * stretch.value
    stretchVelocity.value *= DAMPING
    stretch.value += stretchVelocity.value

    rotationVelocity.value += -ROTATION_CONSTANT * rotation.value
    rotationVelocity.value *= DAMPING
    rotation.value += rotationVelocity.value

    springHeight.value = SPRING_LENGTH + stretch.value

    const stopped =
      Math.abs(stretchVelocity.value) < 0.1 && Math.abs(stretch.value) < 0.1 &&
      Math.abs(rotationVelocity.value) < 0.1 && Math.abs(rotation.value) < 0.1

    if (stopped && !isDragging.value) {
      stretch.value = 0
      rotation.value = 0
      stretchVelocity.value = 0
      rotationVelocity.value = 0
      springHeight.value = SPRING_LENGTH
      return
    }

    animationId.value = requestAnimationFrame(animate)
  }

  animationId.value = requestAnimationFrame(animate)
}

onUnmounted(() => {
  if (animationId.value) cancelAnimationFrame(animationId.value)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
.signboard {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 15vw;
  z-index: 5;
  bottom: 0;
}
.signboard.left  { left: 2.5vw; }
.signboard.right { right: 2.5vw; }

.spring-movable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: bottom center;
  transition: transform 0.1s ease-out;
}

.board {
  width: 15vw;
  height: 15vw;
  background-size: 100% 100%;
  cursor: grab;
}
.board:active { cursor: grabbing; }

.top {
  width: 4vw;
  height: 0.5vw;
  background-image: url('/images/base.png');
  background-size: 100% 100%;
  z-index: 1;
}

.base {
  width: 4vw;
  height: 0.5vw;
  background-image: url('/images/base.png');
  background-size: 100% 100%;
  z-index: 1;
}

.spring-el {
  width: 3vw;
  height: 6vw;
  background-image: url('/images/spring.png');
  background-size: 100% 100%;
  z-index: 0;
  transition: height 0.1s ease-out;
}
</style>
