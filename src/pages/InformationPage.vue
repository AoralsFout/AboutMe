<template>
  <div class="page about">
    <SpringSignboard side="left" board-image="/images/Nishikigi Chisato.png" />
    <SpringSignboard side="right" board-image="/images/Inoue Takina.png" />
    <div class="layer" :style="backStyle">
      <div class="bg-gradient" ref="backEl" />
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">INFORMATION</h1>
    </div>

    <div class="layer" :style="decoStyle">
      <div class="deco deco-ring-1" ref="d1" />
      <div class="deco deco-ring-2" ref="d2" />
      <div class="deco deco-diamond-1" ref="d3" />
      <div class="deco deco-diamond-2" ref="d4" />
      <div class="deco deco-dot-1" ref="d5" />
      <div class="deco deco-dot-2" ref="d6" />
      <div class="deco deco-cross" ref="d7" />
    </div>

    <div class="layer" :style="photoStyle">
      <div class="photo-deco photo-1" ref="photo1" />
      <div class="photo-deco photo-2" ref="photo2" />
      <div class="photo-deco photo-3" ref="photo3" />
    </div>

    <!-- 词云层 -->
    <div class="layer" :style="wordCloudStyle">
      <div class="word-cloud" ref="wordCloudEl">
        <span v-for="(w, i) in cloudWords" :key="i" class="cloud-word" :style="{
          '--r': 360 / cloudWords.length * i,
          '--orbit': w.orbit,
          '--size': w.size,
          '--op': w.opacity,
        }"><span class="cloud-word-fix"><span class="cloud-word-inner">{{ w.text }}</span></span></span>
      </div>
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="col" style="align-items: flex-end;">
        <div class="card tilt-l enter-top" ref="headerEl" style="width: 200px;">
          <h2 class="name-cn">宗柏屹</h2>
          <p class="name-en">Baiyi Zong</p>
          <p class="motto">「 代码即诗，架构即画 」</p>
        </div>

        <section class="card tilt-r enter-left" ref="eduEl" style="width: 400px;">
          <h3 class="card-title"><i class="fas fa-graduation-cap"></i> 教育经历 <span class="en">Education</span></h3>
          <div class="edu-item">
            <div class="edu-dot" />
            <div class="edu-info">
              <strong>无锡学院</strong>
              <span class="tag-time">2025 - 至今</span>
              <p>计算机科学与技术 · 本科</p>
              <p class="desc">算法协会成员 计算机协会成员</p>
            </div>
          </div>
        </section>

        <section class="card tilt-l enter-bottom" ref="linksEl" style="width: 300px;">
          <h3 class="card-title"><i class="fas fa-link"></i> 找到我 <span class="en">Links</span></h3>
          <div class="links-list">
            <a class="link-item" href="https://github.com/AoralsFout"><span>GitHub</span><span class="link-val">@AoralsFout</span></a>
            <a class="link-item" href="https://www.aoralsfout.top"><span>Blog</span><span class="link-val">aoralsfout.top</span></a>
            <a class="link-item" href=""><span>Email</span><span class="link-val">3250658422@qq.com</span></a>
            <a class="link-item" href=""><span>Email</span><span class="link-val">aoralsfout@gmail.com</span></a>
            <a class="link-item" href=""><span>QQ</span><span class="link-val">可 3250658422</span></a>
            <a class="link-item" href="https://steamcommunity.com/profiles/76561199198280801/"><span>Steam</span><span class="link-val">OniiCHANN</span></a>
            <a class="link-item" href="https://space.bilibili.com/345054137"><span>Bilibili</span><span class="link-val">sFout</span></a>
          </div>
        </section>
      </div>

      <div class="col">
        <section class="card tilt-r enter-top gallery-card" ref="galleryEl" style="width: 300px;">
          <h3 class="card-title"><i class="fas fa-camera"></i> 照片墙 <span class="en">Gallery</span></h3>
          <div class="carousel">
            <div class="carousel-track" :style="{ transform: `translateX(-${carouselIdx * 100}%)` }">
              <div class="carousel-slide" v-for="i in 4" :key="i" :style="{ background: slideColors[i - 1] }">
                <span>Photo {{ i }}</span>
              </div>
            </div>
            <div class="carousel-dots">
              <button v-for="i in 4" :key="i" class="carousel-dot" :class="{ active: carouselIdx === i - 1 }"
                @click="carouselIdx = i - 1" />
            </div>
          </div>
        </section>

        <section class="card tilt-l enter-right" ref="hobbyEl" style="width: 600px;">
          <h3 class="card-title"><i class="fas fa-palette"></i> 兴趣爱好 <span class="en">Hobbies</span></h3>
          <div class="hobby-list">
            <div class="hobby-item" v-for="h in hobbies" :key="h.name">
              <i class="hobby-icon" :class="h.icon" />
              <div class="hobby-body">
                <strong class="hobby-name">{{ h.name }}</strong>
                <p class="hobby-desc">{{ h.desc }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import SpringSignboard from '@/components/SpringSignboard.vue'

const backStyle = useParallax(0.15)
const titleStyle = useParallax(0.3)
const decoStyle = useParallax(0.5)
const photoStyle = useParallax(0.7)
const wordCloudStyle = useParallax(0.85)
const frontStyle = useParallax(1.0)

const cloudWords = [
  { text: 'Vue', orbit: 240, size: '32px', opacity: '0.3' },
  { text: 'TypeScript', orbit: 240, size: '22px', opacity: '0.24' },
  { text: 'React', orbit: 240, size: '26px', opacity: '0.26' },
  { text: 'Node.js', orbit: 240, size: '22px', opacity: '0.22' },
  { text: 'Three.js', orbit: 240, size: '21px', opacity: '0.24' },
  { text: 'Rust', orbit: 240, size: '28px', opacity: '0.28' },
  { text: 'Python', orbit: 240, size: '22px', opacity: '0.22' },
  { text: 'Canvas', orbit: 380, size: '21px', opacity: '0.2' },
  { text: 'Blender', orbit: 380, size: '21px', opacity: '0.18' },
  { text: 'CSS', orbit: 380, size: '26px', opacity: '0.22' },
  { text: '前端', orbit: 380, size: '28px', opacity: '0.26' },
  { text: '后端', orbit: 380, size: '26px', opacity: '0.22' },
  { text: '算法', orbit: 380, size: '26px', opacity: '0.24' },
  { text: '游戏', orbit: 380, size: '28px', opacity: '0.26' },
  { text: '动漫', orbit: 380, size: '22px', opacity: '0.22' },
  { text: 'Git', orbit: 380, size: '21px', opacity: '0.2' },
]

const slideColors = [
  'rgba(100, 160, 140, 0.12)',
  'rgba(140, 140, 180, 0.12)',
  'rgba(180, 140, 120, 0.12)',
  'rgba(120, 160, 180, 0.12)',
]

const hobbies = [
  { icon: 'fas fa-laptop-code', name: '代码', desc: '喜欢研究软件开发相关的技术，这是我的主要方向，目前偏向前端开发。后端开发略有涉猎。' },
  { icon: 'fas fa-torii-gate', name: '动漫', desc: '小学就开始看了，喜欢轻松愉快类型的。异世界似乎也不错，比如无职转生我很喜欢。最近的新番厕纸流水线有点多，不太喜欢看。谁推荐几个老番让我补补口牙。是车万人。平常基本痛衣出门。' },
  { icon: 'fas fa-gamepad', name: '游戏', desc: 'Counter-Strike 2 玩家，完美平台，5E平台B分段。Java版Minecraft。Muse Dash。更多详情请看Steam主页喵owo。' },
  { icon: 'fas fa-video', name: '媒体', desc: '能够使用Pr，Ps，Ae，Au等Adobe软件制作视频。研究过UTAU语音合成，Melodyne调音等人力调教相关技术。FlStudio音乐制作玩不明白orz。' },
  { icon: 'fas fa-cube', name: '3D', desc: '如果有时间希望深入学习Blender，使用过Blender辅助制作过Counter-Strike游戏击杀集锦，简单街道场景建模等。研究过3D渲染管线并使用Canvas画布简单实现，能够使用Three.js框架将3D结合到前端开发。其实我也很想做游戏，但是我的时间真的很少阿QwQ。' }
]

const carouselIdx = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null

const backEl = ref<HTMLElement | null>(null);
const titleEl = ref<HTMLElement | null>(null)
const d1 = ref<HTMLElement | null>(null);
const d2 = ref<HTMLElement | null>(null);
const d3 = ref<HTMLElement | null>(null);
const d4 = ref<HTMLElement | null>(null);
const d5 = ref<HTMLElement | null>(null);
const d6 = ref<HTMLElement | null>(null);
const d7 = ref<HTMLElement | null>(null);
const photo1 = ref<HTMLElement | null>(null);
const photo2 = ref<HTMLElement | null>(null);
const photo3 = ref<HTMLElement | null>(null);
const headerEl = ref<HTMLElement | null>(null);
const eduEl = ref<HTMLElement | null>(null);
const galleryEl = ref<HTMLElement | null>(null);
const linksEl = ref<HTMLElement | null>(null);
const hobbyEl = ref<HTMLElement | null>(null);
const wordCloudEl = ref<HTMLElement | null>(null);

const sequence = [
  { ref: headerEl, delay: 100 },
  { ref: eduEl, delay: 250 },
  { ref: linksEl, delay: 400 },
  { ref: hobbyEl, delay: 550 },
  { ref: galleryEl, delay: 700 },
]

onMounted(() => {
  requestAnimationFrame(() => {
    backEl.value?.classList.add('in')
    titleEl.value?.classList.add('in')
    d1.value?.classList.add('in'); d2.value?.classList.add('in')
    d3.value?.classList.add('in'); d4.value?.classList.add('in')
    d5.value?.classList.add('in'); d6.value?.classList.add('in')
    d7.value?.classList.add('in')
    photo1.value?.classList.add('in'); photo2.value?.classList.add('in')
    photo3.value?.classList.add('in')
    wordCloudEl.value?.classList.add('in')
  })

  sequence.forEach(({ ref, delay }) => {
    setTimeout(() => ref.value?.classList.add('in'), delay)
  })

  carouselTimer = setInterval(() => {
    carouselIdx.value = (carouselIdx.value + 1) % 4
  }, 3000)
})

onUnmounted(() => {
  if (carouselTimer) clearInterval(carouselTimer)
})

const allRefs = [
  backEl, titleEl, d1, d2, d3, d4, d5, d6, d7,
  photo1, photo2, photo3,
  headerEl, eduEl, galleryEl, linksEl, hobbyEl, wordCloudEl,
]

const unmount = () => {
  allRefs.forEach(r => r.value?.classList.remove('in'))
  titleEl.value?.classList.add('out')
  if (carouselTimer) clearInterval(carouselTimer)
}

defineExpose({ unmount, nextTransition: 'BlocksShift', prevTransition: 'StripesSwipe' })
</script>

<style scoped>
.about {
  background: linear-gradient(160deg, #f5faf8 0%, #edf5f1 40%, #f2f7f4 100%);
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

.layer-front {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  pointer-events: auto;
}

/* ===== 背景 ===== */
.bg-gradient {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(100, 160, 140, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 60%, rgba(80, 140, 120, 0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 1s ease-out;
}

.bg-gradient.in {
  opacity: 1;
}

/* ===== 水印 ===== */
.watermark {
  position: absolute;
  top: 4%;
  right: 5%;
  font-size: clamp(26px, 4.5vw, 56px);
  font-weight: 800;
  color: rgba(80, 140, 120, 0.07);
  line-height: 1.05;
  text-align: right;
  user-select: none;
  transform: translateX(400px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

.watermark.out {
  transform: translateX(-400px);
  opacity: 0;
}

/* ===== 装饰 (7个) ===== */
.deco {
  position: absolute;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.deco.in {
  opacity: 1;
}

.deco-ring-1 {
  top: 10%;
  left: 8%;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(100, 160, 140, 0.18);
  animation: orbit-float 10s linear infinite;
  transition-delay: 0.05s;
}

.deco-ring-2 {
  bottom: 18%;
  right: 12%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(100, 160, 140, 0.15);
  animation: orbit-float 8s linear infinite reverse;
  transition-delay: 0.1s;
}

@keyframes orbit-float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(22px, -12px) rotate(120deg);
  }

  66% {
    transform: translate(-12px, 18px) rotate(240deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.deco-diamond-1 {
  top: 42%;
  left: 5%;
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(100, 160, 140, 0.13);
  transform: rotate(45deg);
  animation: spin-drift 14s linear infinite;
  transition-delay: 0.15s;
}

.deco-diamond-2 {
  top: 28%;
  right: 22%;
  width: 11px;
  height: 11px;
  border: 1.2px solid rgba(100, 160, 140, 0.1);
  transform: rotate(22deg);
  animation: spin-drift 18s linear infinite reverse;
  transition-delay: 0.2s;
}

@keyframes spin-drift {
  to {
    transform: rotate(405deg);
  }
}

.deco-dot-1 {
  top: 16%;
  left: 38%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(100, 160, 140, 0.28);
  animation: dot-pulse 3.5s ease-in-out infinite;
  transition-delay: 0.25s;
}

.deco-dot-2 {
  bottom: 32%;
  left: 52%;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: rgba(100, 160, 140, 0.22);
  animation: dot-pulse 3.5s ease-in-out 1.2s infinite;
  transition-delay: 0.3s;
}

@keyframes dot-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(3);
    opacity: 0.9;
  }
}

.deco-cross {
  bottom: 14%;
  left: 28%;
  width: 18px;
  height: 18px;
  animation: cross-spin 6s ease-in-out infinite;
  transition-delay: 0.35s;
}

.deco-cross::before,
.deco-cross::after {
  content: '';
  position: absolute;
  background: rgba(100, 160, 140, 0.13);
}

.deco-cross::before {
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%);
}

.deco-cross::after {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
}

@keyframes cross-spin {

  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(90deg) scale(1.4);
  }
}

/* ===== 照片装饰层 ===== */
.photo-deco {
  position: absolute;
  border-radius: 10px;
  background: rgba(100, 160, 140, 0.05);
  border: 1px solid rgba(100, 160, 140, 0.08);
  opacity: 0;
  transition: opacity 0.6s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.photo-deco.in {
  opacity: 1;
}

.photo-1 {
  top: 7%;
  left: 2%;
  width: 65px;
  height: 80px;
  transform: rotate(-7deg) translateY(-15px);
  transition-delay: 0.4s;
}

.photo-1.in {
  transform: rotate(-7deg) translateY(0);
}

.photo-2 {
  bottom: 20%;
  right: 5%;
  width: 70px;
  height: 55px;
  transform: rotate(5deg) translateY(15px);
  transition-delay: 0.45s;
}

.photo-2.in {
  transform: rotate(5deg) translateY(0);
}

.photo-3 {
  bottom: 7%;
  left: 44%;
  width: 55px;
  height: 70px;
  transform: rotate(-4deg) translateY(25px);
  transition-delay: 0.5s;
}

.photo-3.in {
  transform: rotate(-4deg) translateY(0);
}

/* ===== 词云层 ===== */
.word-cloud {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  opacity: 0;
  transition: opacity 3s ease-out 0.3s;
  animation: cloud-orbit 30s linear infinite;
}

.word-cloud.in {
  opacity: 1;
}

.cloud-word {
  position: absolute;
  transform:
    rotate(calc(var(--r) * 1deg)) translateX(calc(var(--orbit) * 1px));
}

.cloud-word-fix {
  display: inline-block;
  transform: rotate(calc(var(--r) * -1deg));
}

.cloud-word-inner {
  display: inline-block;
  white-space: nowrap;
  font-weight: 600;
  color: rgba(80, 140, 120, var(--op, 0.2));
  font-size: var(--size, 13px);
  animation: word-counter 30s linear infinite;
}

@keyframes cloud-orbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes word-counter {
  to {
    transform: rotate(-360deg);
  }
}

/* ===== 前层 ===== */

/* 随意感：卡片微旋转，仅用于最终状态 */
.tilt-l {
  --tilt: -2deg;
  --ty: 6px;
}

.tilt-r {
  --tilt: 1.5deg;
  --ty: -4px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== 卡片 ===== */
.card {
  width: auto;
  padding: 15px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(100, 160, 140, 0.08);
  backdrop-filter: blur(6px);
  opacity: 0;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
}

/* 入场方向偏移 */
.enter-top {
  transform: translateY(-70px) rotate(var(--tilt, 0deg));
}

.enter-left {
  transform: translateX(-70px) rotate(var(--tilt, 0deg));
}

.enter-bottom {
  transform: translateY(70px) rotate(var(--tilt, 0deg));
}

.enter-right {
  transform: translateX(70px) rotate(var(--tilt, 0deg));
}

/* 入场完成：归位 */
.card.in {
  transform: translate(0, 0) rotate(0deg);
  opacity: 1;
}

.card-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: #3a5a50;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title .en {
  font-weight: 400;
  font-size: 10px;
  color: rgba(60, 100, 85, 0.35);
  letter-spacing: 1.5px;
  margin-left: auto;
}

/* ===== 姓名 ===== */
.name-cn {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #3a5a50;
  letter-spacing: 5px;
}

.name-en {
  margin: 2px 0 6px;
  font-size: 14px;
  color: rgba(60, 100, 85, 0.42);
  letter-spacing: 2px;
}

.motto {
  margin: 0;
  font-size: 11px;
  color: rgba(60, 100, 85, 0.32);
  letter-spacing: 1px;
}

/* ===== 教育 ===== */
.edu-item {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.edu-item:last-child {
  margin-bottom: 0;
}

.edu-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(100, 160, 140, 0.3);
  margin-top: 5px;
  flex-shrink: 0;
}

.edu-info strong {
  display: block;
  font-size: 13px;
  color: #3a5a50;
  margin-bottom: 1px;
}

.edu-info p {
  margin: 1px 0;
  font-size: 11px;
  color: rgba(60, 100, 85, 0.5);
}

.tag-time {
  font-size: 10px;
  color: rgba(60, 100, 85, 0.3);
}

.desc {
  font-size: 10px !important;
  color: rgba(60, 100, 85, 0.35) !important;
  line-height: 1.5;
  margin-top: 2px !important;
}

/* ===== 链接 ===== */
.links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 16px;
  background: rgba(100, 160, 140, 0.04);
  text-decoration: none;
  font-size: 11px;
  color: #3a5a50;
  transition: background 0.2s;
}

.link-item:hover {
  background: rgba(100, 160, 140, 0.12);
}

.link-val {
  color: rgba(60, 100, 85, 0.3);
  font-size: 10px;
}

/* ===== 轮播 ===== */
.gallery-card {
  padding-bottom: 12px;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.carousel-slide {
  min-width: 100%;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  color: rgba(60, 100, 85, 0.2);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(100, 160, 140, 0.15);
  cursor: pointer;
  transition: background 0.2s;
}

.carousel-dot.active {
  background: rgba(100, 160, 140, 0.45);
}

/* ===== 爱好 ===== */
.hobby-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hobby-item {
  display: flex;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.35);
}

.hobby-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.hobby-body {
  flex: 1;
  min-width: 0;
}

.hobby-name {
  display: block;
  font-size: 14px;
  color: #3a5a50;
  margin-bottom: 2px;
}

.hobby-desc {
  margin: 0;
  font-size: 12px;
  color: rgba(60, 100, 85, 0.38);
  line-height: 1.5;
}
</style>
