<template>
  <div class="audio-control">
    <button class="audio-control-button" :class="{ playing: radio?.playing.value }"
      @click="radio?.toggle()" :title="radio?.playing.value ? '暂停' : '播放'">
      <span v-if="radio?.playing.value">⏸</span>
      <span v-else>▶</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

export interface RadioStream {
  audio: Ref<HTMLAudioElement | null>
  playing: Ref<boolean>
  analyser: Ref<AnalyserNode | null>
  toggle: () => void
  play: () => void
  pause: () => void
}

export const RADIO_KEY: InjectionKey<RadioStream> = Symbol('radio')
</script>

<script setup lang="ts">
import { inject } from 'vue'

const radio = inject(RADIO_KEY)
</script>

<style scoped>
.audio-control {
  position: fixed;
  right: 20px;
  bottom: 90px;
  z-index: 100;
}

.audio-control-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  user-select: none;
  padding: 0;
  transition: all 0.25s ease;
}

.audio-control-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.08);
}

.audio-control-button.playing {
  background: rgba(255, 182, 143, 0.2);
  border-color: rgba(255, 182, 143, 0.3);
  box-shadow: 0 0 16px rgba(255, 182, 143, 0.15);
}
</style>
