<template>
  <div class="page projects">
    <div class="layer" :style="backStyle">
      <div class="bg-gradient" ref="backEl" />
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">PROJECTS</h1>
    </div>

    <div class="layer" :style="backgroundStyle">
      <div class="evergarden" ref="evergardenEl">
        <img src="/images/evergarden.png" />
      </div>
      <div class="violet" ref="violetEl">
        <span>エヴァーガーデン</span>
        <span>ヴァイオレット</span>
      </div>
    </div>

    <div class="layer" :style="decoStyle">
      <div class="deco deco-ring-1" ref="d1" />
      <div class="deco deco-ring-2" ref="d2" />
      <div class="deco deco-dot-1" ref="d3" />
      <div class="deco deco-dot-2" ref="d4" />
      <div class="deco deco-dot-3" ref="d5" />
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="flex-wrap">
        <div class="main-flex">
          <!-- 左侧：项目列表 -->
          <div class="col-left" ref="listCol" @mouseenter="onListEnter" @mouseleave="onListLeave">
            <div v-for="(proj, i) in projects" :key="proj.name" class="proj-item"
              :class="{ active: activeIdx === i, in: entered }" :style="{ '--enter-delay': i * 0.06 + 's' }"
              @click="activeIdx = i">
              <span class="proj-dot" />
              <strong class="proj-name">{{ proj.name }}</strong>
              <span class="proj-brief">{{ proj.brief }}</span>
            </div>
          </div>

          <!-- 右侧：项目详情 -->
          <div class="col-right" ref="detailCol">
            <Transition name="detail-switch" mode="out-in">
              <div class="detail-card" :key="activeIdx" :class="{ 'has-img': active.images.length }" ref="detailEl">
                <div class="detail-header">
                  <h2 class="detail-name">{{ active.name }}</h2>
                  <div class="detail-tags">
                    <span class="dtag" v-for="t in active.tags" :key="t">{{ t }}</span>
                  </div>
                </div>
                <div class="detail-desc" v-html="active.desc"></div>
                <div class="detail-links" v-if="active.links.length">
                  <a v-for="lk in active.links" :key="lk.label" class="detail-link" :href="lk.url" target="_blank">{{
                    lk.label }}</a>
                </div>
                <div class="detail-images" v-if="active.images.length" :style="'columns:' + active.columns">
                  <img v-for="(img, i) in active.images" :key="i" class="detail-img" :src="'/images/projects/' + img"
                    :alt="active.name + '-' + i" />
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, inject } from 'vue'
import { WHEEL_CONTROL_KEY } from '@/composables/usePageSwitcher'
import { useParallax } from '@/composables/useParallax'

const wheelControl = inject(WHEEL_CONTROL_KEY)
function onListEnter() { wheelControl?.setWheelEnabled(false) }
function onListLeave() { wheelControl?.setWheelEnabled(true) }

const backStyle = useParallax(0.15)
const titleStyle = useParallax(0.25)
const backgroundStyle = useParallax(0.3)
const decoStyle = useParallax(0.4)
const frontStyle = useParallax(1.0)

const projects = [
  {
    name: 'Blog V1.0',
    brief: 'HTML 静态页',
    tags: ['HTML', 'CSS'],
    desc: '<del>百度和 CSDN 上东拼西凑的产物，</del>纯 HTML 静态页面，各种学到的标签都往里塞，<del>甚至样式全部内联</del>。',
    links: [],
    images: ['BlogVersion1.0.png'],
    columns: 1,
  },
  {
    name: 'Blog V2.0',
    brief: 'HTML 静态页',
    tags: ['HTML', 'CSS', 'JavaScript'],
    desc: '重新设计了布局，学会引用外部资源和 JavaScript，加入了外部看板娘和音乐盒组件，实现了背景切换动画，部署在 GitHub Pages。',
    links: [],
    images: ['BlogVersion2.0.png'],
    columns: 1,
  },
  {
    name: 'Blog V3.0',
    brief: '重构 + 评论系统',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    desc: `学会外联样式后全部重写，学会调用api，背景是调用api的，天气是api，啥都是api。现在仍部署在Github Pages上，您可以通过下方链接进入。
          <br>V3.1 增加 Twikoo 评论并部署 Vercel，第一次学会看文档。
          <br>V3.2 Vercel 被墙，不懂发生了什么只是一味自己写重新写评论页面，当时也不懂后端什么的，所以写出来个空壳。
          <br>V3.3 <del>高人指点</del>学习 PHP + MySQL，完成简易用户系统和评论后端。`,
    links: [{ label: 'Github Pages', url: 'https://aoralsfout.github.io/Home.html' }],
    images: ['BlogVersion3.0.png', 'BlogVersion3.1.jpg'],
    columns: 2,
  },
  {
    name: 'Blog V4.0',
    brief: '自建服务端',
    tags: ['PHP', 'MySQL', 'JavaScript'],
    desc: '<del>高人指点</del>购买域名和服务器，使用 PHP + MySQL 构建完整后端服务，包含全屏头图、打字机动画、用户系统、评论系统和自制的音乐盒组件。',
    links: [],
    images: ['BlogVersion4.0(1).png', 'BlogVersion4.0(2).png'],
    columns: 2,
  },
  {
    name: 'Blog V5.0',
    brief: '前后端分离架构',
    tags: ['Vue 3', 'Node.js', 'MySQL'],
    desc: '学会 Vue 3 和 Node.js 前后端分离架构，使用新技术栈重写整个网站。开始研究各种动画实现。新增文章系统，开始轻度结合 AI 开发。',
    links: [],
    images: ['BlogVersion5.0(1).png', 'BlogVersion5.0(2).png'],
    columns: 2,
  },
  {
    name: 'NeoBlog (Blog V6.0)',
    brief: '全栈现代化博客',
    tags: ['Vue 3', 'TypeScript', 'Node.js', 'Prisma', 'MySQL'],
    desc: '使用 Vue 3 + TypeScript + Prisma 重写。用户可自定义主题配色、布局与圆角。外部认证服务，评论系统，一站式文章编辑发布。AI Agent 大量辅助开发。',
    links: [{ label: 'Website', url: 'https://www.aoralsfout.top' }, { label: 'GitHub', url: 'https://github.com/AoralsFout/NeoBlog' }],
    images: ['NeoBlog(BlogVersion6.0).png'],
    columns: 1,
  },
  {
    name: 'Music Player',
    brief: 'Web 音乐播放器',
    tags: ['Vue 3', 'TypeScript', 'JavaScript'],
    desc: '三个版本的音乐播放器，功能一致，实现基础播放功能，播放队列，lrc歌词解析，播放模式，音频频谱，随前端技术进步不断美化外观并优化内部架构。',
    links: [],
    images: ['MusicPlayerV1.0.png', 'MusicPlayerV2.0.png', 'MusicPlayerV3.0.png'],
    columns: 3,
  },
  {
    name: 'MarketMaster',
    brief: 'CS2 市场投资挑战平台',
    tags: ['Vue 3', 'Node.js', 'MySQL'],
    desc: '根据挑战任务和初始资金对饰品进行虚拟投资，爬取网易 Buff 实时价格数据，按收益排名。解包游戏源文件获取基础数据，饰品和价格记录数据达近千万条。含用户系统、饰品预览与走势图表。',
    links: [],
    images: ['MarketMaster(1).png', 'MarketMaster(2).png', 'MarketMaster(3).png'],
    columns: 2,
  },
  {
    name: 'CS2 Inventory',
    brief: 'CS2 虚拟库存',
    tags: ['JavaScript', 'Three.js'],
    desc: '高仿游戏内库存页面，Three.js 实现物品 3D 检视，支持库存增删改。解包游戏源文件获取全物品模型与贴图数据。',
    links: [{ label: 'GitHub', url: 'https://github.com/AoralsFout/CS2VirtualInventory' }],
    images: ['CS2VirtualInventory(1).png', 'CS2VirtualInventory(2).png', 'CS2VirtualInventory(3).png', 'CS2VirtualInventory(4).png'],
    columns: 2,
  },
  {
    name: 'CSTools',
    brief: 'CS2 工具箱',
    tags: ['JavaScript'],
    desc: 'Counter-Strike 2 辅助工具集，包含音乐盒试听、花体名称生成等功能。',
    links: [],
    images: ['CSTools(1).png', 'CSTools(2).png'],
    columns: 2,
  },
  {
    name: 'XiaoSheQu',
    brief: '小社区平台',
    tags: ['Vue 3', 'Uniapp', 'Express', 'MySQL'],
    desc: 'Uniapp 试水项目，实现基础布局、用户系统与在线聊天功能，探索跨平台开发。',
    links: [],
    images: ['XiaoSheQu(1).png', 'XiaoSheQu(2).png'],
    columns: 4,
  },
  {
    name: 'CWXU Algo',
    brief: '算法竞赛数据追踪',
    tags: ['TypeScript', 'Vue 3'],
    desc: '追踪协会成员在各大 OJ 平台的竞赛数据，负责前端开发。',
    links: [{ label: 'GitHub', url: 'https://github.com/WXUProjects/CWXU-Algo-Frontend' }, { label: 'Website', url: 'https://algo.zhiyuansofts.cn' }],
    images: ['Algo(1).png', 'Algo(2).png', 'Algo(3).png', 'Algo(4).png'],
    columns: 2,
  },
  {
    name: 'MyRadio',
    brief: '在线音乐电台',
    tags: ['Vue 3', 'Node.js', 'Web Audio'],
    desc: '简洁的在线音乐播放器，支持音频播放与基础曲目管理。',
    links: [{ label: 'GitHub', url: 'https://github.com/AoralsFout/MyRadio' }, { label: 'Website', url: 'https://radio.aoralsfout.top' }],
    images: ['MyRadio.png'],
    columns: 2,
  },
  {
    name: 'ZhiYuan',
    brief: '志远大创团队首页',
    tags: ['Vue 3', 'JavaScript'],
    desc: '探索横向滚动布局，设计自定义页面切换流程，融入大量交互动画。',
    links: [],
    images: ['ZhiYuan(1).png', 'ZhiYuan(2).png'],
    columns: 2,
  },
  {
    name: 'AFID',
    brief: 'OAuth 2.0 认证服务',
    tags: ['Vue', 'Node.js', 'MySQL'],
    desc: '实现 OAuth 2.0 协议全流程：注册应用、授权码获取、Token 交换与用户信息读取。',
    links: [{ label: 'GitHub', url: 'https://github.com/AoralsFout/afid' }],
    images: ['AFID.png'],
    columns: 2,
  },
  {
    name: 'Flchann',
    brief: '来自 FL Studio 的水果娘哦',
    tags: ['JavaScript'],
    desc: '可拖动水果娘互动小组件，前端小作品。',
    links: [{ label: 'GitHub', url: 'https://github.com/AoralsFout/HTML-Dragable-FruitChan' }],
    images: ['Flchann.png'],
    columns: 2,
  },
  {
    name: 'LIVE',
    brief: '直播推流平台',
    tags: ['Vue 3', 'Nginx', 'Node.js'],
    desc: '实现 HLS 直播推流、支持实时互动。',
    links: [],
    images: ['LIVE.png'],
    columns: 2,
  },
  {
    name: 'NextDesktop',
    brief: 'Web 桌面环境原型',
    tags: ['Vue 3', 'Electron'],
    desc: 'Electron 试水项目，实现窗口管理、桌面小组件等基础桌面环境功能。',
    links: [{ label: 'GitHub', url: 'https://github.com/AoralsFout/next-desktop' }],
    images: ['NextDesktop.png'],
    columns: 2,
  },
]

const activeIdx = ref(0)
const active = computed(() => projects[activeIdx.value]!)

const backEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const evergardenEl = ref<HTMLElement | null>(null)
const violetEl = ref<HTMLElement | null>(null)
const d1 = ref<HTMLElement | null>(null)
const d2 = ref<HTMLElement | null>(null)
const d3 = ref<HTMLElement | null>(null)
const d4 = ref<HTMLElement | null>(null)
const d5 = ref<HTMLElement | null>(null)
const listCol = ref<HTMLElement | null>(null)
const detailCol = ref<HTMLElement | null>(null)
const detailEl = ref<HTMLElement | null>(null)
const entered = ref(false)

const allRefs = [backEl, titleEl, evergardenEl, violetEl, d1, d2, d3, d4, d5, listCol, detailCol]

onMounted(() => {
  requestAnimationFrame(() => {
    allRefs.forEach(r => r.value?.classList.add('in'))
    entered.value = true
  })
})

const unmount = () => {
  allRefs.forEach(r => r.value?.classList.remove('in'))
  listCol.value?.classList.add('out')
  entered.value = false
}

defineExpose({ unmount, nextTransition: 'StripesSwipe', prevTransition: 'DotsWave' })
</script>

<style scoped>
.projects {
  background: linear-gradient(160deg, #f6f4fa 0%, #f0edf6 40%, #f4f1f8 100%);
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
  background:
    radial-gradient(ellipse 70% 60% at 25% 50%, rgba(120, 90, 160, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 50% 70% at 70% 40%, rgba(100, 70, 140, 0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 1s ease-out;
}

.bg-gradient.in {
  opacity: 1;
}

.evergarden {
  position: absolute;
  left: -5%;
  height: 120%;
  transform: translateX(-200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;

  >img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.evergarden.in {
  transform: translateX(0);
  opacity: 0.2;
}

.violet {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  position: absolute;
  bottom: 5%;
  right: 5%;

  >span {
    font-size: 3rem;
    /* 竖排文字 */
    writing-mode: vertical-rl;
  }

  >span:nth-child(2) {
    transform: translateY(-3rem);
  }

  transform: translateY(-200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1),
  opacity 0.8s ease-out;
}

.violet.in {
  transform: translateY(0px);
  opacity: 1;
}

.watermark {
  position: absolute;
  bottom: 4%;
  left: 5%;
  font-size: clamp(32px, 6vw, 72px);
  font-weight: 800;
  color: rgba(100, 70, 140, 0.07);
  line-height: 1.05;
  text-align: right;
  user-select: none;
  transform: translateX(-200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

/* ===== 装饰 ===== */
.deco {
  position: absolute;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.deco.in {
  opacity: 1;
}

.deco-ring-1 {
  top: 14%;
  left: 8%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(120, 90, 160, 0.18);
  animation: orbit-float 10s linear infinite;
  transition-delay: 0.05s;
}

.deco-ring-2 {
  bottom: 22%;
  right: 10%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(120, 90, 160, 0.15);
  animation: orbit-float 8s linear infinite reverse;
  transition-delay: 0.1s;
}

@keyframes orbit-float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(20px, -10px) rotate(120deg);
  }

  66% {
    transform: translate(-10px, 16px) rotate(240deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.deco-dot-1 {
  top: 16%;
  right: 30%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(120, 90, 160, 0.28);
  animation: dot-pulse 3.5s ease-in-out infinite;
  transition-delay: 0.15s;
}

.deco-dot-2 {
  bottom: 30%;
  left: 25%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(120, 90, 160, 0.22);
  animation: dot-pulse 3.5s ease-in-out 1.2s infinite;
  transition-delay: 0.2s;
}

.deco-dot-3 {
  top: 50%;
  right: 15%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(120, 90, 160, 0.2);
  animation: dot-pulse 4s ease-in-out 0.6s infinite;
  transition-delay: 0.25s;
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
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 24px;
  padding: 20px 0;
}

.col-left {
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 600px;
  overflow-y: auto;
  gap: 8px;
  opacity: 0;
  transform: translateY(-200px);
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
  mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 90%, transparent 100%);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(120, 90, 160, 0.8);
    border-radius: 2px;
  }

  scrollbar-width: 4px;
  scrollbar-color: rgba(120, 90, 160, 0.8) transparent;
}

.col-left.in {
  transform: translateX(0);
  opacity: 1;
}

.col-left.out {
  transform: translateY(200px);
  opacity: 0;
}


/* ===== 项目列表项 ===== */
.proj-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(120, 90, 160, 0.06);
  cursor: pointer;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.proj-item.in {
  animation: item-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: var(--enter-delay, 0s);
  opacity: 1;
  transform: translateX(0);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

@keyframes item-enter {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}


.proj-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(120, 90, 160, 0.15);
}

.proj-item.active {
  background: rgba(140, 110, 180, 0.1);
  border-color: rgba(140, 110, 180, 0.2);
  box-shadow: 0 2px 12px rgba(120, 90, 160, 0.08);
}

.proj-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(120, 90, 160, 0.25);
  flex-shrink: 0;
  transition: background 0.3s;
}

.proj-item.active .proj-dot {
  background: rgba(140, 100, 180, 0.5);
}

.proj-name {
  display: block;
  font-size: 14px;
  color: #504070;
  margin-bottom: 2px;
}

.proj-brief {
  font-size: 11px;
  color: rgba(80, 60, 110, 0.4);
}

/* ===== 右侧详情 ===== */
.col-right {
  width: 75%;
  opacity: 0;
  transform: translateX(30px);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.6s ease-out 0.1s;
}

.col-right.in {
  transform: translateX(0);
  opacity: 1;
}

/* 详情切换过渡 */
.detail-switch-enter-active {
  animation: detail-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.detail-switch-leave-active {
  animation: detail-out 0.2s ease-in;
}

@keyframes detail-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes detail-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.detail-card {
  padding: 28px 30px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.5);
  background-image: url("/images/bg.png");
  background-size: 250px;
  background-repeat: no-repeat;
  background-position: bottom right;
  border: 1px solid rgba(120, 90, 160, 0.08);
  backdrop-filter: blur(6px);
  min-height: 300px;
}

.detail-name {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 700;
  color: #504070;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.dtag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 11px;
  color: rgba(100, 70, 140, 0.5);
  background: rgba(120, 90, 160, 0.06);
  border: 1px solid rgba(120, 90, 160, 0.08);
}

.detail-desc {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(80, 60, 110, 0.5);
}

.detail-links {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.detail-link {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: rgba(120, 90, 160, 0.55);
  background: rgba(120, 90, 160, 0.06);
  border: 1px solid rgba(120, 90, 160, 0.1);
  text-decoration: none;
  transition: all 0.2s;
}

.detail-link:hover {
  background: rgba(120, 90, 160, 0.12);
}

.detail-images {
  columns: 3;
  column-gap: 10px;
  margin-top: 12px;
}

.detail-img {
  width: 100%;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(100, 70, 140, 0.08);
  transition: transform 0.3s;
  break-inside: avoid;
}

.detail-img:hover {
  transform: scale(1.03);
}
</style>
