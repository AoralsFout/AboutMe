<template>
  <div class="page home">
    <div class="layer" :style="backStyle">
      <div class="dot-grid" ref="backEl" />
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="title" ref="titleEl">ABOUT<br />ME</h1>
    </div>

    <div class="layer" :style="midStyle">
      <div class="deco deco-ring" ref="decoRing" />
      <div class="deco deco-orb" ref="decoOrb" />
      <div class="deco deco-diamond" ref="decoDiamond" />
      <div class="deco deco-dot-top" ref="decoDot1" />
      <div class="deco deco-dot-bottom" ref="decoDot2" />
      <div class="deco deco-corner" ref="decoCorner" />
    </div>

    <div class="layer" :style="charaStyle">
      <img class="bg-lineart" src="/bg1.png" alt="" ref="bgLineartEl" />
    </div>

    <!-- 前层：左头像 + 右介绍 -->
    <div class="layer layer-front" :style="frontStyle">
      <div class="front-row">
        <div class="avatar-wrap" ref="avatarEl" @click="spinAvatar">
          <div class="avatar" :class="{ spinning: avatarSpinning }">
            <img class="avatar-img" src="https://q1.qlogo.cn/g?b=qq&amp;nk=2168842137&amp;s=640" alt="">
          </div>
        </div>

        <div class="intro-col">
          <div class="intro-card" ref="introEl" @mouseenter="onIntroEnter" @mouseleave="onIntroLeave">
            <h2 class="intro-name">Welcome</h2>
            <p class="intro-title">AoralsFout</p>
            <p class="intro-desc">
              <span class="typewriter-text">{{ typewriterText }}</span>
              <span class="typewriter-cursor">|</span>
            </p>
          </div>

          <div class="radio-card" ref="radioEl" @mouseenter="onIntroEnter" @mouseleave="onIntroLeave">
          <div class="radio-header">
            <span class="radio-icon">🎵</span>
            <a class="radio-station" href="https://thmr.yunmoan.cn/" target="_blank"
              @click.stop="onRadioVisit">{{ radioData.stationName }}</a>
            <span class="radio-listeners">{{ radioData.listeners }} 听众</span>
          </div>
          <div class="radio-meta">
            <span class="radio-track" :title="radioData.trackTitle">{{ radioData.trackTitle }}</span>
            <span class="radio-artist">{{ radioData.artist }}</span>
          </div>
          <div class="radio-controls">
            <button class="radio-toggle" :class="{ playing }" @click.stop="onRadioToggle">
              <span v-if="playing">⏸</span>
              <span v-else>▶</span>
            </button>
            <div class="radio-spectrum" ref="spectrumEl">
              <span
                v-for="i in 16" :key="i"
                class="spectrum-bar"
                :style="{ height: spectrumBars[i - 1] + '%' }"
              />
            </div>
          </div>
          <div class="radio-error" v-if="radioData.error">{{ radioData.error }}</div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, watch, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import { WHEEL_CONTROL_KEY } from '@/composables/usePageSwitcher'
import { RADIO_KEY } from '@/components/RadioControls.vue'

const backStyle = useParallax(0.2)
const titleStyle = useParallax(0.4)
const midStyle = useParallax(0.6)
const charaStyle = useParallax(0.8)
const frontStyle = useParallax(1.2)

const wheelControl = inject(WHEEL_CONTROL_KEY)
const radio = inject(RADIO_KEY)
const playing = ref(false)
if (radio) playing.value = radio.playing.value

function onRadioToggle() {
  radio?.toggle()
}

function onRadioVisit() {
  radio?.pause()
}

function onIntroEnter() { wheelControl?.setWheelEnabled(false) }
function onIntroLeave() { wheelControl?.setWheelEnabled(true) }

// 电台 API
const radioData = ref({
  stationName: '东方音乐电台',
  trackTitle: '加载中...',
  artist: '',
  listeners: 0,
  error: '',
})

let radioTimer: ReturnType<typeof setInterval> | null = null

async function fetchRadioStatus() {
  try {
    const res = await fetch('https://radio.yunmoan.cn/api/stations/touhou/status')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    radioData.value = {
      stationName: data.station?.public?.title ?? '东方音乐电台',
      trackTitle: data.current?.title ?? '未知曲目',
      artist: data.current?.artist ?? '',
      listeners: data.totals?.listeners ?? 0,
      error: '',
    }
  } catch {
    radioData.value.error = '电台信息获取失败'
  }
}

// --- 打字机动画 ---
const sentences = [
  'Thinking...',
  '嗯，用户要求我写几段欢迎游客进入个人介绍网站的简短文案。用户要求语气可爱有活力，配上颜文字和括号内容表示心情想法，需要提示游客使用鼠标滚轮进行翻页。用户说他精通前端技术，后端开发只是一知半解，算法竞赛也没什么起色。接下来让我来按照用户要求来生成几段文案。',
  '欢迎泥来到窝的小世界 ( > ω < )！Welcome (高兴)',
  '专注前端技术，兼顾后端开发（心虚），游龙算法竞赛(并非)。',
  '嗯哼，总之就是这样，祝你接下来旅途顺利喵!',
  '使用鼠标滚轮翻页哦 owo。',
  '...',
  '...',
  '...',
  '我没什么说的了哦。',
  '真的没有了哦。',
  '...',
  '你就这么顽固么orz',
  '算了，你高兴就好喵。',
  '你 现在 可以 滚动 你的 鼠标 浏览 下一页 了。',
  '...',
  '不愿意走么？',
  '我只是一串代码而已，无需眷恋过多。',
  '接下来的世界很精彩，等着你去探索...',
  '期待与你的下一次见面......',
]

const typewriterText = ref('')
const avatarSpinning = ref(false)

function spinAvatar() {
  if (avatarSpinning.value) return
  avatarSpinning.value = true
  setTimeout(() => { avatarSpinning.value = false }, 800)
}

let rafId: number | null = null
let sentenceIdx = 0
let charIdx = 0
let deleting = false
let stopped = false
let lastTime = 0

function runTypewriter(now: number) {
  if (stopped) return
  if (!lastTime) lastTime = now

  const current = sentences[sentenceIdx]!
  const interval = deleting ? 40 : 80
  const elapsed = now - lastTime

  if (elapsed < interval) {
    rafId = requestAnimationFrame(runTypewriter)
    return
  }

  lastTime = now

  if (!deleting) {
    charIdx++
    typewriterText.value = current.slice(0, charIdx)
    if (charIdx >= current.length) {
      deleting = true
      lastTime = now + 2000                                                                                         
      rafId = requestAnimationFrame(runTypewriter)
      return
    }
  } else {
    charIdx--
    typewriterText.value = current.slice(0, charIdx)
    if (charIdx <= 0) {
      deleting = false
      sentenceIdx = (sentenceIdx + 1) % sentences.length
      lastTime = now + 400                                                                                          
      rafId = requestAnimationFrame(runTypewriter)
      return
    }
  }

  rafId = requestAnimationFrame(runTypewriter)
}

// --- 入场动画 ---
const backEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const decoRing = ref<HTMLElement | null>(null)
const decoOrb = ref<HTMLElement | null>(null)
const decoDiamond = ref<HTMLElement | null>(null)
const decoDot1 = ref<HTMLElement | null>(null)
const decoDot2 = ref<HTMLElement | null>(null)
const decoCorner = ref<HTMLElement | null>(null)
const avatarEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)
const bgLineartEl = ref<HTMLElement | null>(null)
const radioEl = ref<HTMLElement | null>(null)
const spectrumEl = ref<HTMLElement | null>(null)
const spectrumBars = ref<number[]>(Array.from({ length: 16 }, () => 0))

let spectrumRaf: number | null = null

function updateSpectrum() {
  const a = radio?.analyser.value
  if (a) {
    const data = new Uint8Array(a.frequencyBinCount)
    a.getByteFrequencyData(data)
    const bars: number[] = []
    const step = Math.floor(data.length / 16)
    for (let i = 0; i < 16; i++) {
      let sum = 0
      for (let j = 0; j < step; j++) sum += data[i * step + j]!
      bars.push(Math.min((sum / step / 255) * 100, 100))
    }
    spectrumBars.value = bars
  }
  spectrumRaf = requestAnimationFrame(updateSpectrum)
}

// --- 入场动画 ---
onMounted(() => {
  fetchRadioStatus()
  radioTimer = setInterval(fetchRadioStatus, 15000)

  // 同步播放状态
  if (radio) {
    playing.value = radio.playing.value
    watch(radio.playing, (v) => { playing.value = v })
  }

  setTimeout(() => {
    backEl.value?.classList.add('in')
    titleEl.value?.classList.add('in')
    decoRing.value?.classList.add('in')
    decoOrb.value?.classList.add('in')
    decoDiamond.value?.classList.add('in')
    decoDot1.value?.classList.add('in')
    decoDot2.value?.classList.add('in')
    decoCorner.value?.classList.add('in')
    avatarEl.value?.classList.add('in')
    introEl.value?.classList.add('in')
    bgLineartEl.value?.classList.add('in')
    radioEl.value?.classList.add('in')
    spectrumEl.value?.classList.add('in')
  }, 50)

  spectrumRaf = requestAnimationFrame(updateSpectrum)
  stopped = false
  lastTime = 0
  rafId = requestAnimationFrame(runTypewriter)
})

onUnmounted(() => {
  stopped = true
  if (rafId) cancelAnimationFrame(rafId)
  if (radioTimer) clearInterval(radioTimer)
  if (spectrumRaf) cancelAnimationFrame(spectrumRaf)
})

// --- 出场动画 ---
const unmount = () => {
  stopped = true
  if (rafId) cancelAnimationFrame(rafId)
  backEl.value?.classList.remove('in')
  titleEl.value?.classList.remove('in')
  titleEl.value?.classList.add('out')
  decoRing.value?.classList.remove('in')
  decoOrb.value?.classList.remove('in')
  decoDiamond.value?.classList.remove('in')
  decoDot1.value?.classList.remove('in')
  decoDot2.value?.classList.remove('in')
  decoCorner.value?.classList.remove('in')
  if (radioTimer) clearInterval(radioTimer)
  if (spectrumRaf) cancelAnimationFrame(spectrumRaf)
  avatarEl.value?.classList.remove('in')
  introEl.value?.classList.remove('in')
  bgLineartEl.value?.classList.remove('in')
  radioEl.value?.classList.remove('in')
  spectrumEl.value?.classList.remove('in')
}

defineExpose({ unmount, nextTransition: 'ShatterWave', prevTransition: 'VortexField' })
</script>

<style scoped>
.home {
  background: linear-gradient(160deg, #fef5f5 0%, #fde8ec 40%, #fdf0f3 100%);
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ===== 背景层 - 点阵网格 ===== */
.dot-grid {
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='10' y1='0' x2='110' y2='0' stroke='%23a8b8c8' stroke-width='1.5'/%3E%3Cline x1='0' y1='10' x2='0' y2='110' stroke='%23a8b8c8' stroke-width='1.5'/%3E%3Cline x1='10' y1='10' x2='110' y2='110' stroke='%23c8d0db' stroke-width='1' stroke-dasharray='4,4'/%3E%3Cline x1='110' y1='10' x2='10' y2='110' stroke='%23c8d0db' stroke-width='1' stroke-dasharray='4,4'/%3E%3Ccircle cx='0' cy='0' r='2' fill='%2347566b'/%3E%3Ccircle cx='120' cy='0' r='2' fill='%2347566b'/%3E%3Ccircle cx='0' cy='120' r='2' fill='%2347566b'/%3E%3Ccircle cx='120' cy='120' r='2' fill='%2347566b'/%3E%3C/svg%3E");
  background-size: 120px 120px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%);
  opacity: 0;
  transition: opacity 0.8s ease-out;
}

.dot-grid.in {
  opacity: 0.6;
}

/* ===== 背景线稿层 ===== */
.bg-lineart {
  position: absolute;
  right: -20%;
  bottom: -5%;
  height: 90%;
  width: auto;
  pointer-events: none;
  user-select: none;
  opacity: 0;
  transform: translateX(200px);

  transition: opacity 1s ease-out,
    transform 2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bg-lineart.in {
  opacity: 1;
  transform: translateX(0);
}

/* ===== 中层 - 标题 ===== */
.title {
  position: absolute;
  top: 10%;
  left: 8%;
  font-size: clamp(36px, 7vw, 80px);
  font-weight: 800;
  color: rgba(180, 120, 135, 0.12);
  letter-spacing: 4px;
  line-height: 1.1;
  user-select: none;
  transform: translateY(-400px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 2s ease-out;
}

.title.in {
  transform: translateY(0px);
  opacity: 1;
}

.title.out {
  transform: translateY(400px);
  opacity: 0;
}

/* ===== 中层 - 装饰元素 ===== */
.deco {
  position: absolute;
  transition: opacity 0.6s ease-out;
  opacity: 0;
}

.deco.in {
  opacity: 1;
}

/* -- ring -- */
.deco-ring {
  top: 22%;
  right: 30%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(210, 145, 160, 0.3);
  animation: orbit-large 12s linear infinite;
  transition-delay: 0.1s;
}

@keyframes orbit-large {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(40px, -20px) rotate(90deg);
  }

  50% {
    transform: translate(0, -50px) rotate(180deg);
  }

  75% {
    transform: translate(-40px, -20px) rotate(270deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

/* -- orb -- */
.deco-orb {
  bottom: 28%;
  left: 12%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, rgba(220, 150, 165, 0.45), rgba(200, 130, 150, 0.08));
  box-shadow: 0 0 30px rgba(200, 140, 155, 0.2);
  animation: float-orb 8s ease-in-out infinite;
  transition-delay: 0.2s;
}

@keyframes float-orb {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.3);
  }

  66% {
    transform: translate(-20px, -15px) scale(0.9);
  }
}

/* -- diamond -- */
.deco-diamond {
  top: 55%;
  right: 20%;
  width: 18px;
  height: 18px;
  border: 1.5px solid rgba(210, 140, 155, 0.25);
  transform: rotate(45deg);
  animation: spin-slow 20s linear infinite;
  transition-delay: 0.15s;
}

@keyframes spin-slow {
  to {
    transform: rotate(405deg);
  }
}

/* -- dots -- */
.deco-dot-top {
  top: 15%;
  left: 25%;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: rgba(210, 140, 155, 0.45);
  animation: dot-pulse 4s ease-in-out infinite;
  transition-delay: 0.25s;
}

.deco-dot-bottom {
  bottom: 20%;
  right: 45%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(200, 130, 150, 0.35);
  animation: dot-pulse 4s ease-in-out 1.5s infinite;
  transition-delay: 0.3s;
}

/* -- corner -- */
.deco-corner {
  bottom: 12%;
  right: 10%;
  width: 50px;
  height: 50px;
  /* border-right: 3px solid rgba(210, 145, 160, 0.25);
  border-bottom: 3px solid rgba(210, 145, 160, 0.25); */
  background: linear-gradient(135deg, rgba(220, 150, 165, 0.3), rgba(190, 120, 140, 0.12));
  animation: corner-float 6s ease-in-out infinite;
  transition-delay: 0.35s;
}

@keyframes corner-float {
  0% {
    transform: translate(0, 0) rotate(0);
  }

  50% {
    transform: translate(-8px, -8px);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes dot-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(2.5);
    opacity: 0.9;
  }
}

/* ===== 前层 - 头像 + 介绍 ===== */
.front-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  height: 100%;
  padding: 0 10%;
  pointer-events: auto;
  transform: translate(-200px,50px);
}

.intro-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

/* -- 头像 -- */
.avatar-wrap {
  flex-shrink: 0;
  transform: translateX(-200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s ease-out;
}

.avatar-wrap.in {
  transform: translateX(0);
  opacity: 1;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 150, 165, 0.3), rgba(190, 120, 140, 0.12));
  border: 2px solid rgba(210, 145, 160, 0.3);
  box-shadow: 0 0 40px rgba(200, 140, 155, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar.spinning {
  animation: avatar-spin 0.5s ease;
}

@keyframes avatar-spin {
  0% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.2) rotate(180deg);
  }

  100% {
    transform: scale(1) rotate(360deg);
  }
}

/* -- 介绍卡片 -- */
.intro-card {
  max-width: 400px;
  padding: 28px 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(210, 150, 160, 0.18);
  backdrop-filter: blur(2px);
  overflow-y: auto;
  max-height: 280px;
  transform: translateY(400px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s,
    opacity 0.6s ease-out 0.15s;
}

.intro-card.in {
  transform: translateY(0);
  opacity: 1;
}

.intro-card::-webkit-scrollbar {
  width: 3px;
}

.intro-card::-webkit-scrollbar-thumb {
  background: rgba(200, 140, 155, 0.3);
  border-radius: 2px;
}

.intro-name {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: rgba(55, 25, 35, 0.85);
}

.intro-title {
  margin: 0 0 16px;
  font-size: 14px;
  color: rgba(185, 100, 120, 0.7);
  letter-spacing: 1px;
}

.intro-desc {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(100, 50, 65, 0.6);
  min-height: 50px;
}

.typewriter-cursor {
  color: rgba(200, 110, 130, 0.7);
  font-weight: 300;
  animation: cursor-blink 0.53s step-end infinite;
}

@keyframes cursor-blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* ===== 电台卡片 ===== */
.radio-card {
  width: 260px;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(200, 150, 160, 0.1);
  backdrop-filter: blur(6px);
  opacity: 0;
  transform: translateY(20px);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.6s ease-out 0.5s;
}

.radio-card.in {
  transform: translateY(0);
  opacity: 1;
}

.radio-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.radio-icon { font-size: 14px; }

.radio-station {
  font-size: 12px;
  font-weight: 600;
  color: #6b4060;
  text-decoration: none;
  transition: color 0.2s;
}

.radio-station:hover {
  color: #c65a69;
  text-decoration: underline;
}

.radio-listeners {
  margin-left: auto;
  font-size: 10px;
  color: rgba(100, 50, 65, 0.35);
}

.radio-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.radio-track {
  font-size: 13px;
  font-weight: 600;
  color: rgba(100, 50, 65, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.radio-artist {
  font-size: 11px;
  color: rgba(100, 50, 65, 0.45);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.radio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(200, 150, 160, 0.2);
  background: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  color: rgba(100, 50, 65, 0.55);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.radio-toggle:hover {
  background: rgba(200, 150, 160, 0.1);
}

.radio-toggle.playing {
  background: rgba(210, 140, 155, 0.15);
  border-color: rgba(210, 140, 155, 0.25);
  color: rgba(160, 80, 100, 0.7);
}

.radio-spectrum {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 28px;
  opacity: 0;
  transition: opacity 0.4s ease-out 0.6s;
}

.radio-spectrum.in {
  opacity: 1;
}

.spectrum-bar {
  flex: 1;
  min-height: 2px;
  border-radius: 1px;
  background: linear-gradient(to top, rgba(200, 130, 150, 0.6), rgba(220, 160, 175, 0.3));
  transition: height 0.08s ease;
}

.radio-error {
  margin-top: 6px;
  font-size: 10px;
  color: rgba(180, 80, 80, 0.5);
}
</style>
