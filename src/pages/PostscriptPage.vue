<template>
  <div class="page postscript">
    <div class="layer" :style="backStyle">
      <div class="bg-gradient" ref="backEl" />
    </div>

    <!-- 动态波浪背景 -->
    <div class="layer" :style="waveStyle">
      <svg class="wave-svg" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path class="wave wave-1" d="M0,400 C240,300 480,500 720,400 C960,300 1200,500 1440,400 L1440,800 L0,800 Z" />
        <path class="wave wave-2" d="M0,450 C300,550 600,350 900,450 C1100,520 1300,380 1440,450 L1440,800 L0,800 Z" />
        <path class="wave wave-3" d="M0,500 C200,400 500,600 800,500 C1050,420 1250,550 1440,500 L1440,800 L0,800 Z" />
      </svg>
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">POST<br />SCRIPT</h1>
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="flex-wrap">
        <div class="main-flex">
          <!-- 左列 -->
          <div class="col" ref="colL">
            <section class="card tilt-l enter-left" ref="c1">
              <h3 class="card-title"><i class="fas fa-lightbulb"></i> 开发后记 <span class="en">Dev Notes</span></h3>
              <p class="note-text">
                这是我的个人网站的一部分，用于展示个人项目、技术栈和兴趣爱好。前端基于 Vue 3 + TypeScript + Vite 构建，后端使用 Node.js + Express 提供 API 服务。
              </p>
              <p class="note-text">
                接下来是一些碎碎念...
              </p>
              <p class="note-text">
                开头的欢迎页面用了点小巧思，假装笨笨的不小心放出了AI的思考过程，把我真正想说的东西借这个假的AI思考过程放出来，或许会留个好印象？qwq。一直看最后会有个小彩蛋（应该能算是个彩蛋？）
              </p>
              <p class="note-text">
                我在前不久才知道有 Bangumi 这个神奇的网站，可以很方便记录追番数据，最重要的是它提供 API 接口，于是我花了点时间注册了 Bangumi
                账号，翻了400多页番剧，有一万部番剧，选出来四百个我看过的番剧，笨笨的方法，累到惹。
              </p>
              <p class="note-text">
                接下来吐槽 Steam Web API
                ，第一次调用规模比较大的API接口，主要就是条目太多了文档看不过来，没有响应示例，不知道响应结果含义什么的啦，接口返回的东西也特别多，之前的TypeScript小项目我都是老老实实定义好请求和响应的数据类型的，但是这个嘛...一堆any类型能跑就行了。说到底还是太菜惹wwww
              </p>
              <p class="note-text">
                没人发现 information 页的莉可丽丝可以拖动嘛，好久之前做的了，高中的时候学了运动合成和简谐振动，加个衰减系数塞一起就是弹簧效果qwq，底座和弹簧是拿 PS 画的，第一次觉得知识有点用。
              </p>
            </section>

            <section class="card tilt-r enter-left" ref="c2">
              <h3 class="card-title"><i class="fas fa-tools"></i> 实现细节 <span class="en">Implementation</span></h3>
              <div class="detail-list">
                <div class="detail-item">
                  <strong>视差滚动</strong>
                  <p>通过 useParallax(depth) 函数返回 computed
                    计算样式直接应用到视差层，参数depth控制视差深度。函数内部节流监听鼠标位置，根据当前位置、视差深度计算出transform位移属性。</p>
                </div>
                <div class="detail-item">
                  <strong>页面切换</strong>
                  <p>
                    监听滚轮事件触发页面切换，动态加载页面放在需要出现的位置，新页面被挂载时触发组件内部入场动画，并将页面移动到中心视口，调用旧页面执行出场动画函数，完成后卸载旧页面。同时提供外部接口供禁用鼠标滚动翻页，确保需要滚轮浏览的组件不会触发翻页。
                  </p>
                </div>
                <div class="detail-item">
                  <strong>模拟终端</strong>
                  <p>基于 ansi-to-html 渲染，命令注册表设计，支持参数解析、Tab 补全、历史记录和命令执行。我之前因为要还原 CS2
                    的控制台也做过模拟终端，但是纯纯的一坨switch-case+Dom，绷不住QAQ，这次用ai做了个更好的owo。</p>
                </div>
              </div>
            </section>
          </div>

          <!-- 右列 -->
          <div class="col" ref="colR">
            <section class="card tilt-r enter-right" ref="c3">
              <h3 class="card-title"><i class="fas fa-book"></i> 参阅的 API 文档 <span class="en">API References</span></h3>
              <div class="link-list">
                <a class="ref-link" href="https://bangumi.github.io/api/" target="_blank">
                  <span class="ref-name">Bangumi API</span>
                  <span class="ref-desc">动画/漫画/游戏 收藏数据</span>
                </a>
                <a class="ref-link" href="https://steamapi.xpaw.me/" target="_blank">
                  <span class="ref-name">第三方 Steam Web API 文档</span>
                  <span class="ref-desc">玩家信息、游戏库数据</span>
                </a>
                <a class="ref-link" href="https://partner.steamgames.com/doc/webapi" target="_blank">
                  <span class="ref-name">Steamworks Web API</span>
                  <span class="ref-desc">官方 Steam API 文档</span>
                </a>
              </div>
            </section>

            <section class="card tilt-l enter-right" ref="c4">
              <h3 class="card-title"><i class="fas fa-link"></i> 友情链接 <span class="en">Links</span></h3>
              <div class="link-list">
                <a class="ref-link" href="https://github.com/AoralsFout/AboutMe" target="_blank">
                  <span class="ref-name">开源地址</span>
                  <span class="ref-desc">Github</span>
                </a>
                <a class="ref-link" href="https://www.aoralsfout.top" target="_blank">
                  <span class="ref-name">我的博客</span>
                  <span class="ref-desc">Blog</span>
                </a>
                <a class="ref-link" href="https://thmr.yunmoan.cn/" target="_blank">
                  <span class="ref-name">东方音乐电台</span>
                  <span class="ref-desc">Radio</span>
                </a>
                <a class="ref-link" href="#" target="_blank">
                  <span class="ref-name">友链招租awa</span>
                  <span class="ref-desc">qwq</span>
                </a>
              </div>
            </section>

            <section class="card tilt-r enter-right" ref="c5">
              <h3 class="card-title"><i class="fas fa-comment"></i> 致谢 <span class="en">Thanks</span></h3>
              <p class="note-text">
                感谢 bangumi / Steam 提供的开放 API 和数据支持。
                感谢 Vue / Vite / TypeScript 社区提供的优秀工具链。
                感谢所有测试和反馈的朋油门。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'

document.title = "后记 | Postscript"

const backStyle = useParallax(0.1)
const waveStyle = useParallax(0.2)
const titleStyle = useParallax(0.25)
const frontStyle = useParallax(1.0)

const backEl = ref<HTMLElement | null>(null); const titleEl = ref<HTMLElement | null>(null)
const colL = ref<HTMLElement | null>(null); const colR = ref<HTMLElement | null>(null)
const c1 = ref<HTMLElement | null>(null); const c2 = ref<HTMLElement | null>(null)
const c3 = ref<HTMLElement | null>(null); const c4 = ref<HTMLElement | null>(null)
const c5 = ref<HTMLElement | null>(null)

const bgRefs = [backEl, titleEl]
const colRefs = [colL, colR]
const cardRefs = [c1, c2, c3, c4, c5]

onMounted(() => {
  requestAnimationFrame(() => {
    bgRefs.forEach(r => r.value?.classList.add('in'))
    colRefs.forEach(r => r.value?.classList.add('in'))
    cardRefs.forEach((r, i) => setTimeout(() => r.value?.classList.add('in'), 100 + i * 120))
  })
})

const unmount = () => {
  bgRefs.forEach(r => r.value?.classList.remove('in'))
  colRefs.forEach(r => r.value?.classList.remove('in'))
  cardRefs.forEach(r => r.value?.classList.remove('in'))
}

defineExpose({ unmount, nextTransition: 'ShatterWave', prevTransition: 'ShatterWave' })
</script>

<style scoped>
.postscript {
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f1629 100%);
  position: relative;
  width: 100%;
  height: 100%;
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

.bg-gradient {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse 60% 40% at 30% 50%, rgba(100, 140, 200, 0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 1s ease-out;
}

.bg-gradient.in {
  opacity: 1;
}

/* ===== 波浪 ===== */
.wave-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
}

.wave {
  fill: none;
  stroke-width: 1.5;
}

.wave-1 {
  stroke: rgba(100, 160, 220, 0.12);
  animation: wave-drift-1 8s ease-in-out infinite;
}

.wave-2 {
  stroke: rgba(120, 180, 230, 0.08);
  animation: wave-drift-2 10s ease-in-out infinite;
}

.wave-3 {
  stroke: rgba(140, 200, 240, 0.05);
  animation: wave-drift-3 12s ease-in-out infinite;
}

@keyframes wave-drift-1 {

  0%,
  100% {
    transform: translateY(0);
  }

  33% {
    transform: translateY(-12px);
  }

  66% {
    transform: translateY(8px);
  }
}

@keyframes wave-drift-2 {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(15px);
  }
}

@keyframes wave-drift-3 {

  0%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-8px);
  }

  75% {
    transform: translateY(12px);
  }
}

.watermark {
  position: absolute;
  top: 4%;
  left: 5%;
  font-size: clamp(36px, 6vw, 68px);
  font-weight: 800;
  color: rgba(100, 160, 220, 0.05);
  line-height: 1.05;
  user-select: none;
  transform: translateX(-40px);
  opacity: 0;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

/* ===== 前层 ===== */
.flex-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-flex {
  width: 80%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
}

.main-flex::-webkit-scrollbar {
  width: 4px;
}

.main-flex::-webkit-scrollbar-thumb {
  background: rgba(100, 160, 220, 0.1);
  border-radius: 2px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.col.in {
  opacity: 1;
  transform: translateY(0);
}

.card {
  padding: 18px 22px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(100, 160, 220, 0.08);
  backdrop-filter: blur(6px);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out;
}

.card.in {
  opacity: 1;
}

.tilt-l {
  --tilt: -1deg;
}

.tilt-r {
  --tilt: 0.8deg;
}

.enter-left {
  transform: translateX(-30px) rotate(var(--tilt));
}

.enter-right {
  transform: translateX(30px) rotate(var(--tilt));
}

.card.in.enter-left,
.card.in.enter-right {
  transform: translateX(0) rotate(0deg);
}

.card-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  color: #c8d8e8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title .en {
  font-size: 10px;
  font-weight: 400;
  color: rgba(200, 216, 232, 0.3);
  margin-left: auto;
  letter-spacing: 1.5px;
}

.note-text {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.8;
  color: rgba(180, 200, 220, 0.55);
}

.note-text:last-child {
  margin-bottom: 0;
}

/* 实现细节 */
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.detail-item strong {
  display: block;
  font-size: 13px;
  color: #a0c8e8;
  margin-bottom: 4px;
}

.detail-item p {
  margin: 0;
  font-size: 12px;
  color: rgba(180, 200, 220, 0.45);
  line-height: 1.6;
}

/* 链接列表 */
.link-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ref-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  text-decoration: none;
  transition: background 0.2s;
}

.ref-link:hover {
  background: rgba(100, 160, 220, 0.08);
}

.ref-name {
  font-size: 13px;
  color: #a0c8e8;
  font-weight: 500;
}

.ref-desc {
  font-size: 11px;
  color: rgba(180, 200, 220, 0.35);
}

@media (max-width: 768px) {
  .flex-wrap {
    align-items: flex-start;
  }

  .main-flex {
    width: 90%;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 40px;
    height: calc(100vh - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
  }

  .col {
    min-height: auto;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
  }

  .card:first-child {
    margin-top: 40px;
  }

  .col:last-child {
    margin-bottom: 80px;
  }
}
</style>
