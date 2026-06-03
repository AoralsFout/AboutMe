<template>
  <div @wheel="onWheel">
    <div class="pm-container">
      <div v-for="(slot, i) in slots" :key="i" class="pm-slot"
        :style="{ left: slot.left.value, zIndex: slot.zIndex.value }">
        <component :is="slot.component.value" :ref="(el: any) => slot.compRef.value = el" />
      </div>
    </div>
    <TransitionOverlay :transition-name="transition.name" :active="transition.active"
      @done="transition.active = false" />
    <ScrollIndicator />
    <RadioControls />
    <ToastNotification />
    <PageControls :pages="pages" :current-page-id="currentPageId" @switch="doSwitch" />
    <audio ref="audioEl" :src="radioSrc" crossorigin="anonymous" preload="none" volume="0.1" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, provide, reactive, ref, onMounted, onUnmounted } from 'vue'
import PageControls from './components/PageControls.vue'
import ScrollIndicator from './components/ScrollIndicator.vue'
import TransitionOverlay from './components/TransitionOverlay.vue'
import RadioControls from './components/RadioControls.vue'
import ToastNotification from './components/ToastNotification.vue'
import { usePageSwitcher, WHEEL_CONTROL_KEY } from './composables/usePageSwitcher'
import { RADIO_KEY } from './components/RadioControls.vue'

const componentsArray = [
  { id: 1, component: defineAsyncComponent(() => import('./pages/HomePage.vue')) },
  { id: 2, component: defineAsyncComponent(() => import('./pages/InformationPage.vue')) },
  { id: 3, component: defineAsyncComponent(() => import('./pages/TechStackPage.vue')) },
  { id: 4, component: defineAsyncComponent(() => import('./pages/ProjectsPage.vue')) },
  { id: 5, component: defineAsyncComponent(() => import('./pages/ACGNPage.vue')) },
  { id: 6, component: defineAsyncComponent(() => import('./pages/GamingPage.vue')) },
  { id: 7, component: defineAsyncComponent(() => import('./pages/PostscriptPage.vue')) },
]

const {
  slots, pages, currentPageId,
  switchToPage, setWheelEnabled, wheelEnabled,
  getCurrentTransition,
} = usePageSwitcher(componentsArray)

provide(WHEEL_CONTROL_KEY, { setWheelEnabled })

const transition = reactive({
  name: null as string | null,
  active: false,
})

function doSwitch(id: number) {
  if (id === currentPageId.value || transition.active) return
  const direction: 'next' | 'prev' = id > currentPageId.value ? 'next' : 'prev'
  transition.name = getCurrentTransition(direction)
  transition.active = true
  switchToPage(id)
}

function onWheel(e: WheelEvent) {
  if (!wheelEnabled.value || transition.active) return
  const sorted = [...pages].sort((a, b) => a.id - b.id)
  const idx = sorted.findIndex(p => p.id === currentPageId.value)
  if (e.deltaY > 0 && idx < sorted.length - 1) {
    doSwitch(sorted[idx + 1]!.id)
  } else if (e.deltaY < 0 && idx > 0) {
    doSwitch(sorted[idx - 1]!.id)
  }
}

// ---- 电台音频 ----
const radioSrc = 'https://radio.yunmoan.cn/radio/touhou/128k'
const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const analyser = ref<AnalyserNode | null>(null)

let audioCtx: AudioContext | null = null
let source: MediaElementAudioSourceNode | null = null

function initAudioContext() {
  if (audioCtx || !audioEl.value) return
  audioCtx = new AudioContext()
  source = audioCtx.createMediaElementSource(audioEl.value)
  const a = audioCtx.createAnalyser()
  a.fftSize = 256
  source.connect(a)
  a.connect(audioCtx.destination)
  analyser.value = a
}

function play() {
  if (!audioEl.value) return
  initAudioContext()
  if (audioCtx?.state === 'suspended') audioCtx.resume()
  audioEl.value.play().then(() => {
    playing.value = true
    if (audioEl.value) {
      // 从流末尾开始播放
      audioEl.value.currentTime = audioEl.value.duration
    }
  }).catch(() => { playing.value = false })
}

function pause() {
  audioEl.value?.pause()
  playing.value = false
}

function toggle() {
  playing.value ? pause() : play()
}

function onAudioPlay() { playing.value = true }
function onAudioPause() { playing.value = false }
function onAudioEnded() { playing.value = false }

onMounted(() => {
  audioEl.value?.addEventListener('play', onAudioPlay)
  audioEl.value?.addEventListener('pause', onAudioPause)
  audioEl.value?.addEventListener('ended', onAudioEnded)
})

onUnmounted(() => {
  audioEl.value?.removeEventListener('play', onAudioPlay)
  audioEl.value?.removeEventListener('pause', onAudioPause)
  audioEl.value?.removeEventListener('ended', onAudioEnded)
  if (audioCtx) audioCtx.close()
})

provide(RADIO_KEY, {
  audio: audioEl,
  playing,
  analyser,
  toggle,
  play,
  pause,
})
</script>

<style scoped>
.pm-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.pm-slot {
  position: absolute;
  width: 100vw;
  height: 100vh;
  transition: left 0.4s ease-in-out;
}
</style>
