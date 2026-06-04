<template>
  <div class="page stack">
    <div class="layer" :style="backStyle">
      <div class="bg-gradient" ref="backEl" />
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">TECH<br />STACK</h1>
    </div>

    <div class="layer" :style="iconStyle">
      <img v-for="icon in floatingIcons" :key="icon.name" :src="'/icons/' + icon.file" class="float-icon" :style="{
        '--x': icon.x + '%', '--y': icon.y + '%',
        '--s': icon.size, '--op': icon.opacity,
        '--dx': icon.driftX + 'px', '--dy': icon.driftY + 'px',
        '--dur': icon.duration + 's', '--delay': icon.delay + 's',
      }" :alt="icon.name" />
    </div>

    <!-- 代码片段背景层 -->
    <div class="layer" :style="codeStyle">
      <pre v-for="snip in codeSnippets" :key="snip.lang" class="code-snip" :style="{
        '--x': snip.x + '%', '--y': snip.y + '%',
        '--r': snip.rotate + 'deg',
        '--dx': snip.driftX + 'px', '--dy': snip.driftY + 'px',
        '--dur': snip.duration + 's', '--delay': snip.delay + 's',
      }"><code>{{ snip.code }}</code></pre>
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="main-grid">
        <div class="col col-left">
          <section class="card tilt-l enter-left" ref="langEl">
            <h3 class="card-title"><i class="fas fa-laptop-code"></i> 编程语言 <span class="en">Languages</span></h3>
            <div class="tag-group">
              <span class="tag tag-lg">TypeScript</span>
              <span class="tag tag-lg">JavaScript</span>
              <span class="tag tag-md">C / C++</span>
              <span class="tag tag-md">Dart</span>
              <span class="tag tag-md">Java</span>
              <span class="tag">Python</span>
              <span class="tag">Rust</span>
            </div>
          </section>

          <section class="card tilt-r enter-left" ref="frontendEl">
            <h3 class="card-title"><i class="fas fa-globe"></i> 前端 <span class="en">Frontend</span></h3>
            <div class="tag-group">
              <span class="tag tag-lg">Vue 3</span>
              <span class="tag tag-md">ElementPlus</span>
              <span class="tag tag-md">Flutter</span>
              <span class="tag">Uniapp</span>
              <span class="tag">Electron</span>
              <span class="tag">Tauri</span>
              <span class="tag">Vite</span>
              <span class="tag">Pinia</span>
              <span class="tag">Three.js</span>
            </div>
          </section>

          <section class="card tilt-l enter-left" ref="backendEl">
            <h3 class="card-title"><i class="fas fa-wrench"></i> 后端<span class="en">Backend</span></h3>
            <div class="tag-group">
              <span class="tag tag-lg">Node.js</span>
              <span class="tag tag-md">Express</span>
              <span class="tag tag-md">MySQL</span>
              <span class="tag">SpringBoot</span>
              <span class="tag">Nginx</span>
            </div>
          </section>

          <section class="card tilt-r enter-left" ref="envEl">
            <h3 class="card-title"><i class="fas fa-laptop-code"></i> 开发环境 <span class="en">Environment</span></h3>
            <div class="env-list">
              <div class="env-row">
                <span class="env-icon"><i class="fas fa-pen"></i></span>
                <div class="env-body">
                  <strong>开发工具</strong>
                  <p>VS Code / IDEA / DataGrip</p>
                </div>
              </div>
              <div class="env-row">
                <span class="env-icon"><i class="fas fa-folder"></i></span>
                <div class="env-body">
                  <strong>操作系统</strong>
                  <p>Arch Linux / Windows 11</p>
                </div>
              </div>
              <div class="env-row">
                <span class="env-icon"><i class="fas fa-search"></i></span>
                <div class="env-body">
                  <strong>硬件</strong>
                  <p>Intel i7-11800H / 40GB DDR4 / RTX 3050 Ti Moblie</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col col-right">
          <section class="card terminal-card tilt-r enter-right" ref="terminalEl" @mouseenter="onTerminalEnter"
            @mouseleave="onTerminalLeave">
            <MockTerminal auto-run="fastfetch" />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import { WHEEL_CONTROL_KEY } from '@/composables/usePageSwitcher'
import MockTerminal from '@/components/MockTerminal.vue'

document.title = "技术栈 | Tech Stack"

const wheelControl = inject(WHEEL_CONTROL_KEY)
function onTerminalEnter() { wheelControl?.setWheelEnabled(false) }
function onTerminalLeave() { wheelControl?.setWheelEnabled(true) }

const backStyle = useParallax(0.15)
const titleStyle = useParallax(0.25)
const iconStyle = useParallax(0.45)
const codeStyle = useParallax(0.35)
const frontStyle = useParallax(1.0)

const codeSnippets = [
  {
    lang: 'Vue', x: 60, y: 14, rotate: -3, driftX: 12, driftY: 10, duration: 18, delay: 0,
    code: `<template>\n  <div class="app">\n    <h1>{{ title }}</h1>\n  </div>\n</template>`
  },
  {
    lang: 'TS', x: 15, y: 36, rotate: 2, driftX: -14, driftY: -8, duration: 20, delay: 2,
    code: `interface User {\n  name: string\n  age: number\n}\nconst u: User = { ... }`
  },
  {
    lang: 'Rust', x: 95, y: 50, rotate: -2, driftX: 16, driftY: -12, duration: 22, delay: 1,
    code: `fn main() {\n  let msg = "Hello";\n  println!("{}", msg);\n}`
  },
  {
    lang: 'Python', x: 15, y: 65, rotate: 4, driftX: -10, driftY: 12, duration: 19, delay: 3,
    code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`
  },
  {
    lang: 'JS', x: 80, y: 20, rotate: -1, driftX: -12, driftY: -10, duration: 16, delay: 0.5,
    code: `const arr = [1, 2, 3]\nconst doubled = arr\n  .map(x => x * 2)\n  .filter(x => x > 2)`
  },
  {
    lang: 'C++', x: 48, y: 85, rotate: 3, driftX: 14, driftY: -8, duration: 21, delay: 2.5,
    code: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  std::cout << "Hi";\n  return 0;\n}`
  },
  {
    lang: 'SQL', x: 85, y: 80, rotate: -4, driftX: -16, driftY: 8, duration: 17, delay: 1.5,
    code: `SELECT u.name, COUNT(*)\nFROM users u\nJOIN orders o\n  ON u.id = o.user_id\nGROUP BY u.name`
  },
  {
    lang: 'HTML', x: 35, y: 10, rotate: 2, driftX: 10, driftY: 12, duration: 15, delay: 3.5,
    code: `<head>\n  <meta charset="UTF-8">\n  <link rel="stylesheet"\n    href="style.css">\n</head>`
  },
]

const floatingIcons = [
  { file: 'Vue.svg', name: 'Vue', x: 50, y: 20, size: '48px', opacity: '0.32', driftX: 18, driftY: 14, duration: 12, delay: 0 },
  { file: 'C++.svg', name: 'C++', x: 40, y: 93, size: '40px', opacity: '0.24', driftX: -16, driftY: 12, duration: 10, delay: 4 },
  { file: 'ArchLinux.svg', name: 'ArchLinux', x: 55, y: 5, size: '36px', opacity: '0.22', driftX: 14, driftY: 16, duration: 11, delay: 3.8 },
  { file: 'JavaScript.svg', name: 'JavaScript', x: 78, y: 13, size: '44px', opacity: '0.26', driftX: -14, driftY: 14, duration: 11, delay: 3 },
  { file: 'MySQL.svg', name: 'MySQL', x: 76, y: 86, size: '38px', opacity: '0.23', driftX: -18, driftY: 12, duration: 12, delay: 0.3 },
  { file: 'Nodejs.svg', name: 'Node.js', x: 93, y: 92, size: '46px', opacity: '0.3', driftX: 16, driftY: -10, duration: 14, delay: 3.5 },
  { file: 'VScode.svg', name: 'VSCode', x: 4, y: 48, size: '36px', opacity: '0.25', driftX: 14, driftY: 12, duration: 13, delay: 0.6 },
  { file: 'Python.svg', name: 'Python', x: 2, y: 70, size: '38px', opacity: '0.25', driftX: 12, driftY: -14, duration: 13, delay: 2 },
  { file: 'Flutter.svg', name: 'Flutter', x: 93, y: 25, size: '36px', opacity: '0.22', driftX: -16, driftY: -12, duration: 13, delay: 2.2 },
  { file: 'HTML.svg', name: 'HTML', x: 23, y: 12, size: '36px', opacity: '0.22', driftX: -14, driftY: 10, duration: 12, delay: 2.5 },
  { file: 'Electron.svg', name: 'Electron', x: 94, y: 72, size: '38px', opacity: '0.23', driftX: -12, driftY: -14, duration: 11, delay: 0.8 },
  { file: 'Java.svg', name: 'Java', x: 10, y: 90, size: '38px', opacity: '0.24', driftX: 14, driftY: -16, duration: 16, delay: 1 },
  { file: 'Linux.svg', name: 'Linux', x: 32, y: 92, size: '42px', opacity: '0.28', driftX: -12, driftY: -14, duration: 14, delay: 1.2 },
  { file: 'TypeScript.svg', name: 'TypeScript', x: 12, y: 31, size: '42px', opacity: '0.28', driftX: 16, driftY: -12, duration: 14, delay: 1.5 },
  { file: 'Tauri.svg', name: 'Tauri', x: 64, y: 88, size: '34px', opacity: '0.21', driftX: -14, driftY: -12, duration: 10, delay: 1.8 },
  { file: 'Rust.svg', name: 'Rust', x: 90, y: 60, size: '50px', opacity: '0.3', driftX: -16, driftY: -14, duration: 15, delay: 0.5 },
  { file: 'SpringBoot.svg', name: 'SpringBoot', x: 8, y: 88, size: '40px', opacity: '0.24', driftX: -14, driftY: 10, duration: 15, delay: 4.2 },
  { file: 'C.svg', name: 'C', x: 88, y: 38, size: '30px', opacity: '0.2', driftX: -12, driftY: 12, duration: 10, delay: 2.8 },
]

const backEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const langEl = ref<HTMLElement | null>(null)
const frontendEl = ref<HTMLElement | null>(null)
const backendEl = ref<HTMLElement | null>(null)
const envEl = ref<HTMLElement | null>(null)
const terminalEl = ref<HTMLElement | null>(null)

const allRefs = [backEl, titleEl, langEl, frontendEl, backendEl, envEl, terminalEl]

const sequence = [
  { ref: langEl, delay: 100 },
  { ref: frontendEl, delay: 220 },
  { ref: backendEl, delay: 340 },
  { ref: envEl, delay: 460 },
  { ref: terminalEl, delay: 200 },
]

onMounted(() => {
  requestAnimationFrame(() => {
    backEl.value?.classList.add('in'); titleEl.value?.classList.add('in')
  })
  sequence.forEach(({ ref, delay }) => {
    setTimeout(() => ref.value?.classList.add('in'), delay)
  })
})

const unmount = () => allRefs.forEach(r => r.value?.classList.remove('in'))

defineExpose({ unmount, nextTransition: 'StripesSwipe', prevTransition: 'StripesSwipe' })
</script>

<style scoped>
.stack {
  background: linear-gradient(160deg, #fdf8f2 0%, #faf3e8 40%, #fdf6ef 100%);
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.layer-front {
  pointer-events: auto;
}

/* ===== 背景 ===== */
.bg-gradient {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 80% 60% at 15% 40%, rgba(180, 140, 90, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 75% 50%, rgba(160, 120, 70, 0.04) 0%, transparent 60%);
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
  left: 5%;
  font-size: clamp(28px, 5vw, 64px);
  font-weight: 800;
  color: rgba(140, 100, 60, 0.08);
  line-height: 1.05;
  user-select: none;
  transform: translateX(-100px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

/* ===== 浮动图标背景 ===== */
.float-icon {
  position: absolute;
  left: calc(var(--x) - var(--s) / 2);
  top: calc(var(--y) - var(--s) / 2);
  width: var(--s);
  height: var(--s);
  opacity: var(--op);
  filter: grayscale(0.5) brightness(1.05);
  pointer-events: none;
  user-select: none;
  animation: icon-drift calc(var(--dur) * 1s) ease-in-out infinite;
  animation-delay: calc(var(--delay) * 1s);
  transition: opacity 2s ease-out;
}

@keyframes icon-drift {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(var(--dx), var(--dy)) rotate(6deg);
  }

  50% {
    transform: translate(calc(var(--dx) * -2), calc(var(--dy) * -3.2)) rotate(-4deg);
  }

  75% {
    transform: translate(calc(var(--dx) * -1.2), calc(var(--dy) * 2.4)) rotate(2deg);
  }
}

/* ===== 代码片段背景 ===== */
.code-snip {
  position: absolute;
  left: calc(var(--x) - 10%);
  top: calc(var(--y) - 5%);
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(60, 50, 40, 0.06);
  border: 1px solid rgba(100, 80, 60, 0.08);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 10px;
  line-height: 1.55;
  color: rgba(80, 60, 40, 0.35);
  white-space: pre;
  pointer-events: none;
  user-select: none;
  animation: code-drift calc(var(--dur) * 1s) ease-in-out infinite;
  animation-delay: calc(var(--delay) * 1s);
  transform: rotate(var(--r));
}

@keyframes code-drift {

  0%,
  100% {
    transform: rotate(var(--r)) translate(0, 0);
  }

  33% {
    transform: rotate(calc(var(--r) + 1.5deg)) translate(var(--dx), var(--dy));
  }

  66% {
    transform: rotate(calc(var(--r) - 1deg)) translate(calc(var(--dx) * -0.6), calc(var(--dy) * -0.7));
  }
}

/* ===== 前层 ===== */
.main-grid {
  width: 80%;
  height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 5rem;
  padding: 40px 5% 30px;
  align-content: center;
}

@media (max-width: 768px) {
  .main-grid {
    width: 90%;
    gap: 14px;
    margin-top: 40px;
    align-content: flex-start;
    height: calc(100dvh - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
  }
}

.col {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &:last-child {
    padding-bottom: 80px;
  }
}

.col-right {
  justify-content: center;
}

/* ===== 卡片 ===== */
.card {
  padding: 18px 22px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(180, 130, 70, 0.08);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
}

.card.in {
  opacity: 1;
}

.tilt-l {
  --tilt: -1.8deg;
  --ty: 5px;
}

.tilt-r {
  --tilt: 1.2deg;
  --ty: -4px;
}

.enter-left {
  transform: translateX(-60px) rotate(var(--tilt, 0deg));
}

.enter-right {
  transform: translateX(60px) rotate(var(--tilt, 0deg));
}

.card.in {
  transform: translate(0, 0) rotate(0deg);
  opacity: 1;
}

.card-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  color: #6b4c2a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title .en {
  font-weight: 400;
  font-size: 10px;
  color: rgba(100, 70, 30, 0.35);
  letter-spacing: 1.5px;
  margin-left: auto;
}

/* ===== 标签 ===== */
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  color: rgba(100, 70, 30, 0.6);
  background: rgba(180, 130, 70, 0.07);
  border: 1px solid rgba(180, 130, 70, 0.1);
}

.tag-lg {
  font-size: 14px;
  padding: 6px 16px;
  font-weight: 600;
  color: rgba(100, 70, 30, 0.7);
  background: rgba(180, 130, 70, 0.1);
}

.tag-md {
  font-size: 13px;
  font-weight: 500;
}

/* ===== 环境列表 ===== */
.env-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.env-row {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.35);
}

.env-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.env-body strong {
  display: block;
  font-size: 12px;
  color: #6b4c2a;
  margin-bottom: 2px;
}

.env-body p {
  margin: 0;
  font-size: 11px;
  color: rgba(100, 70, 30, 0.45);
}

.terminal-card {
  padding: 0;
  background: transparent;
  overflow: hidden;
  height: 500px;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .col-left,
  .col-right {
    width: 100%;
  }
}
</style>
