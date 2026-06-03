<template>
  <div class="scroll-indicator" aria-hidden="true">
    <div class="arrows">
      <div class="arrow-wrap">
        <div class="arrow" />
      </div>
      <div class="arrow-wrap">
        <div class="arrow" />
      </div>
    </div>
    <span class="hint-text">滚轮浏览</span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.scroll-indicator {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  user-select: none;
}

.arrows {
  display: flex;
  gap: 6px;
}

.arrow-wrap {
  animation: arrow-bounce 1.6s ease-in-out infinite;
}

/* .arrow-Frap:last-child { */
/* animation-delay: 0.2s; */
/* } */

.arrow {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid rgba(168, 180, 255, 0.55);
  border-bottom: 1.5px solid rgba(168, 180, 255, 0.55);
  transform: rotate(45deg);
}

.hint-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 2px;
}

@keyframes arrow-bounce {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-4px);
    opacity: 0.9;
  }
}
</style>
