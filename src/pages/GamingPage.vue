<template>
  <div class="page steam">
    <div class="layer" :style="backStyle">
      <div class="bg-pattern" ref="backEl" />
    </div>
    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">STEAM<br />GAMING</h1>
    </div>
    <div class="layer" :style="decoStyle">
      <div class="deco deco-ring-1" ref="d1" />
      <div class="deco deco-ring-2" ref="d2" />
      <div class="deco deco-dot-1" ref="d3" />
      <div class="deco deco-dot-2" ref="d4" />
    </div>
    <div class="layer" :style="steamIconStyle">
      <img class="steam-icon-bg" ref="steamIconEl" src="/icons/Steam.svg" alt="" />
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="grid-wrap">
        <div class="main-grid">
          <!-- 左列：游戏库 -->
          <div class="col col-left" ref="colL">
            <section class="card tilt-l enter-left card-games" ref="c1">
              <h3 class="card-title"><i class="fas fa-book"></i> 游玩过的游戏 <span class="en">Library</span></h3>
              <div class="games-header">
                <span v-if="gameCards.length">{{ gameCards.length }} 款 · {{ totalHours }}h</span>
              </div>
              <div class="games-grid" v-if="gameCards.length" @mouseenter="onGamesEnter" @mouseleave="onGamesLeave">
                <div class="game-card" v-for="g in gameCards" :style="{ backgroundImage: `url(${g.header})` }">
                  <div class="game-card-overlay" />
                  <span class="game-card-name">{{ g.name }}</span>
                  <span class="game-card-time">{{ g.hours.toFixed(1) }}h</span>
                </div>
              </div>
              <div class="skel-games" v-else>
                <div class="skel-card" v-for="n in 12" :key="n">
                  <div class="skel-box" /><span class="skel-line" />
                </div>
              </div>
            </section>
          </div>

          <!-- 右列：信息 -->
          <div class="col col-right" ref="colR">
            <section class="card tilt-r enter-right profile-card" ref="c2"
              :style="profileBg ? { backgroundImage: `url(${profileBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
              <video v-if="profileVideo" class="profile-video" :src="profileVideo" autoplay muted loop playsinline />
              <div class="profile-bg-overlay" />
              <h3 class="card-title"><i class="fas fa-user"></i> 玩家信息 <span class="en">Profile</span></h3>
              <div class="profile-row" v-if="playerSummaries?.response?.players?.[0]">
                <div class="avatar-wrap">
                  <img class="avatar" :src="playerSummaries.response.players[0].avatarfull" alt="" />
                  <img v-if="avatarFrame" class="avatar-frame" :src="avatarFrame" alt="" />
                </div>
                <div class="profile-info">
                  <strong class="profile-name">{{ playerSummaries.response.players[0].personaname }}</strong>
                  <span class="profile-id">STEAM_ID:{{ playerSummaries.response.players[0].steamid }}</span>
                  <span class="profile-years">已加入 Steam {{ accountYears }} 年</span>
                </div>
                <div class="level-badge" v-if="steamLevel?.response">
                  <span class="level-num">{{ steamLevel.response.player_level }}</span>
                  <span class="level-label">Steam Level</span>
                </div>
              </div>
              <div class="skel-row" v-else>
                <div class="skel-avatar" />
                <div class="skel-info"><span class="skel-line" /><span class="skel-line short" /></div>
              </div>
              <span class="playing"
                v-if="playerSummaries?.response?.players?.[0] && playerSummaries.response.players[0].gameextrainfo">
                正在玩 {{ playerSummaries.response.players[0].gameextrainfo }}
              </span>
            </section>

            <section class="card tilt-r enter-right" ref="c3">
              <a v-if="playerSummaries?.response?.players?.[0]" class="steam-profile-btn"
                :href="`https://steamcommunity.com/profiles/${playerSummaries.response.players[0].steamid}`"
                target="_blank" rel="noopener">查看 Steam 个人资料</a>
            </section>

            <section class="card tilt-l enter-right" ref="c4">
              <h3 class="card-title"><i class="fas fa-gamepad"></i> 最近游玩 <span class="en">Recent</span></h3>
              <div class="recent-list" v-if="recentlyPlayedGames?.response?.games">
                <div class="recent-item" v-for="g in recentlyPlayedGames.response.games">
                  <img class="game-icon"
                    :src="`https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`"
                    :alt="g.name" />
                  <div class="game-info">
                    <strong class="game-name">{{ g.name }}</strong>
                    <span class="game-time">2周 {{ (g.playtime_2weeks / 60).toFixed(1) }}h · 总计 {{ (g.playtime_forever /
                      60).toFixed(1) }}h</span>
                  </div>
                </div>
              </div>
              <div class="skel-list" v-else>
                <div class="skel-item" v-for="n in 3" :key="n">
                  <div class="skel-icon" />
                  <div class="skel-info"><span class="skel-line" /><span class="skel-line short" /></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import { WHEEL_CONTROL_KEY } from '@/composables/usePageSwitcher'
import { steamApi, api } from '@/api/client'

document.title = "游戏 | Gaming"

const wheelControl = inject(WHEEL_CONTROL_KEY)
function onGamesEnter() { wheelControl?.setWheelEnabled(false) }
function onGamesLeave() { wheelControl?.setWheelEnabled(true) }

const playerSummaries = ref<any>(null)
const playerSummaries1 = ref<any>(null)
const recentlyPlayedGames = ref<any>(null)
const ownedGames = ref<any>(null)
const steamLevel = ref<any>(null)
const profileBg = ref('')
const profileVideo = ref('')
const avatarFrame = ref('')
const appDetails = ref<any>(null)
const lastPlayed = ref<any>(null)
const gameCards = ref<{ appid: number; name: string; header: string; hours: number }[]>([])

const accountYears = computed(() => {
  const ts = playerSummaries.value?.response?.players?.[0]?.timecreated
  if (!ts) return '?'
  return new Date().getFullYear() - new Date(ts * 1000).getFullYear()
})

const totalHours = computed(() => {
  if (!gameCards.value.length) return 0
  return gameCards.value.reduce((s, g) => s + g.hours, 0).toFixed(1)
})

const backStyle = useParallax(0.15)
const titleStyle = useParallax(0.25)
const decoStyle = useParallax(0.4)
const steamIconStyle = useParallax(0.08)
const frontStyle = useParallax(1.0)

const backEl = ref<HTMLElement | null>(null); const titleEl = ref<HTMLElement | null>(null)
const d1 = ref<HTMLElement | null>(null); const d2 = ref<HTMLElement | null>(null)
const d3 = ref<HTMLElement | null>(null); const d4 = ref<HTMLElement | null>(null)
const steamIconEl = ref<HTMLElement | null>(null)
const colL = ref<HTMLElement | null>(null); const colR = ref<HTMLElement | null>(null)
const c1 = ref<HTMLElement | null>(null);
const c2 = ref<HTMLElement | null>(null);
const c3 = ref<HTMLElement | null>(null);
const c4 = ref<HTMLElement | null>(null)
const c5 = ref<HTMLElement | null>(null)

const bgRefs = [backEl, titleEl, d1, d2, d3, d4, steamIconEl]
const colRefs = [colL, colR]
const cardRefs = [c1, c2, c3, c4, c5]

async function fetchAll() {
  const results = await Promise.allSettled([
    steamApi('player-summaries'),
    steamApi('recently-played-games?count=5'),
    steamApi('owned-games'),
    steamApi('steam-level'),
    steamApi('profile-background').catch(() => null),
    steamApi('avatar-frame').catch(() => null),
    steamApi('last-played-times'),
  ])
  const [summaries, recent, owned, level, bg, frame, lp] = results

  if (summaries.status === 'fulfilled') {
    playerSummaries.value = summaries.value.data
    const gameId = summaries.value.data?.response?.players?.[0]?.gameid
    if (gameId) {
      api.get(`/api/steam/app-details?appids=${gameId}`).then(r => { appDetails.value = r.data }).catch(() => { })
    }
  }
  if (recent.status === 'fulfilled') recentlyPlayedGames.value = recent.value.data
  if (owned.status === 'fulfilled') ownedGames.value = owned.value.data
  if (level.status === 'fulfilled') steamLevel.value = level.value.data
  if (bg.status === 'fulfilled' && bg.value?.data) {
    const pb = bg.value.data?.response?.profile_background
    if (pb?.movie_webm) {
      profileVideo.value = `https://shared.st.dl.eccdnx.com/community_assets/images/${pb.movie_webm}`
      profileBg.value = `https://shared.st.dl.eccdnx.com/community_assets/images/${pb.image_large}`
    }
  }
  if (frame.status === 'fulfilled' && frame.value?.data) {
    const f = frame.value.data?.response?.avatar_frame
    if (f?.image_small) avatarFrame.value = `https://shared.st.dl.eccdnx.com/community_assets/images/${f.image_small}`
  }
  if (lp.status === 'fulfilled') {
    lastPlayed.value = lp.value.data
    const games: any[] = (lp.value.data?.response?.games ?? [])
      .sort((a: any, b: any) => (b.last_playtime || 0) - (a.last_playtime || 0))
    if (games.length) {
      const details = await Promise.allSettled(
        games.map(g => api.get(`/api/steam/app-details?appids=${g.appid}`).catch(() => null))
      )
      gameCards.value = games.map((g, i) => {
        const d = details[i]
        const name = d?.status === 'fulfilled' ? d.value?.data?.[g.appid]?.data?.name : null
        const header = d?.status === 'fulfilled' ? d.value?.data?.[g.appid]?.data?.header_image : ''
        return {
          appid: g.appid,
          name: name ?? `App ${g.appid}`,
          header,
          hours: g.playtime_forever / 60,
        }
      })
    }
  }
}

onMounted(() => {
  fetchAll().then(() => {
    console.log('Player Summaries:', playerSummaries.value)
    console.log('Recently Played:', recentlyPlayedGames.value)
    console.log('Steam Level:', steamLevel.value)
    console.log('Owned Games:', ownedGames.value)
    console.log('Last Played:', lastPlayed.value)
    console.log('Profile BG:', profileBg.value)
    console.log('Profile Video:', profileVideo.value)
    console.log('Avatar Frame:', avatarFrame.value)
    console.log('App Details:', appDetails.value)
    console.log('Game Cards:', gameCards.value)
  })
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
@import url("https://fontsapi.zeoseven.com/925/main/result.css");

.steam {
  font-family: "Ark Pixel 12px Prop latin";
  background: linear-gradient(160deg, #1b2838 0%, #171a21 40%, #1a1e26 100%);
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

.bg-pattern {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse 60% 40% at 20% 30%, rgba(102, 192, 244, 0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 60%, rgba(102, 140, 180, 0.03) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 1s ease-out;
}

.bg-pattern.in {
  opacity: 1;
}

.watermark {
  position: absolute;
  bottom: 4%;
  right: 5%;
  font-size: clamp(32px, 6vw, 68px);
  font-weight: 800;
  color: rgba(102, 192, 244, 0.05);
  line-height: 1.05;
  text-align: right;
  user-select: none;
  transform: translateX(200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

.deco {
  position: absolute;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.deco.in {
  opacity: 1;
}

.deco-ring-1 {
  top: 12%;
  left: 8%;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(102, 192, 244, 0.12);
  animation: orbit-float 10s linear infinite;
  transition-delay: 0.05s;
}

.deco-ring-2 {
  bottom: 18%;
  right: 10%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(102, 192, 244, 0.1);
  animation: orbit-float 8s linear infinite reverse;
  transition-delay: 0.1s;
}

@keyframes orbit-float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(18px, -10px) rotate(120deg);
  }

  66% {
    transform: translate(-10px, 14px) rotate(240deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.deco-dot-1 {
  top: 16%;
  right: 30%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(102, 192, 244, 0.2);
  animation: dot-pulse 3.5s ease-in-out infinite;
  transition-delay: 0.15s;
}

.deco-dot-2 {
  bottom: 28%;
  left: 25%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(102, 192, 244, 0.16);
  animation: dot-pulse 3.5s ease-in-out 1.2s infinite;
  transition-delay: 0.2s;
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

.grid-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-grid {
  width: 88%;
  height: 90%;
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 20px;
  padding: 15px 0;
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
  padding: 16px 20px;
  border-radius: 12px;
  background-color: #202327;
  border: 1px solid rgba(102, 192, 244, 0.08);
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
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: #c7d5e0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title .en {
  font-size: 10px;
  font-weight: 400;
  color: rgba(199, 213, 224, 0.3);
  margin-left: auto;
  letter-spacing: 1.5px;
}

/* 游戏库卡片 */
.card-games {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  background-image: url("/icons/Steam.svg");
  background-size: 200px;
  background-repeat: no-repeat;
  background-position: center center;

  scrollbar-width: 2px;
  scrollbar-color: rgba(102, 192, 244, 0.15) rgba(255, 255, 255, 0.02);
  scrollbar-track-color: transparent;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.games-header {
  margin-bottom: 10px;
  font-size: 11px;
  color: rgba(102, 192, 244, 0.4);
}

.games-grid {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: max-content;
  gap: 8px;
  align-content: start;
  padding-right: 4px;
  scrollbar-gutter: stable;
}

.games-grid::-webkit-scrollbar {
  width: 5px;
}

.games-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
}

.games-grid::-webkit-scrollbar-thumb {
  background: rgba(102, 192, 244, 0.15);
  border-radius: 3px;
}

.game-card {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  aspect-ratio: 460/215;
  overflow: hidden;
}

.game-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, transparent 60%);
}

.game-card-name {
  position: absolute;
  bottom: 6px;
  left: 8px;
  right: 8px;
  font-size: 11px;
  font-weight: bold;
  color: #c7d5e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-card-time {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  text-align: right;
  border-radius: 0 0 0 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 3px 8px;
}

/* 玩家信息 */
.profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: none;
}

.profile-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.profile-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(27, 40, 56, 0.85) 0%, rgba(27, 40, 56, 0.6) 100%);
  z-index: 0;
}

.profile-card .card-title,
.profile-card .profile-row {
  position: relative;
  z-index: 1;
}

.profile-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar-wrap {
  position: relative;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 2px solid rgba(102, 192, 244, 0.2);
}

.avatar-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  pointer-events: none;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  color: #e8f0f8;
}

.profile-id {
  font-size: 11px;
  color: rgba(199, 213, 224, 0.5);
  font-family: monospace;
}

.profile-loc,
.profile-years {
  font-size: 11px;
  color: rgba(102, 192, 244, 0.7);
}

.playing {
  font-size: 12px;
  font-weight: 600;
  color: #a4d16f;
  margin-top: 3px;
  text-shadow: 0 0 6px rgba(164, 209, 111, 0.3);
  z-index: 1;
}

.level-badge {
  text-align: center;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(102, 192, 244, 0.15) 0%, rgba(102, 192, 244, 0.05) 100%);
  border: 1px solid rgba(102, 192, 244, 0.25);
  box-shadow: 0 0 12px rgba(102, 192, 244, 0.1), inset 0 1px 0 rgba(102, 192, 244, 0.1);
}

.level-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #66c0f4;
  line-height: 1;
  text-shadow: 0 0 8px rgba(102, 192, 244, 0.4);
}

.level-label {
  display: block;
  font-size: 7px;
  color: rgba(102, 192, 244, 0.5);
  letter-spacing: 3px;
  margin-top: 1px;
  text-transform: uppercase;
}

/* 最近游玩 */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.game-icon {
  width: 26px;
  height: 26px;
  border-radius: 4px;
}

.game-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.game-name {
  font-size: 12px;
  color: #c7d5e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-time {
  font-size: 10px;
  color: rgba(102, 192, 244, 0.4);
}

/* 骨架 */
.skel-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.skel-avatar {
  width: 46px;
  height: 46px;
  border-radius: 4px;
}

.skel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skel-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skel-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.skel-icon {
  width: 26px;
  height: 26px;
  border-radius: 4px;
}

.skel-games {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.skel-card {
  border-radius: 8px;
  aspect-ratio: 460/215;
}

.skel-box {
  width: 100%;
  height: 70%;
  border-radius: 8px;
}

.skel-avatar,
.skel-icon,
.skel-line,
.skel-card,
.skel-box {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 75%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skel-line {
  height: 12px;
  width: 100%;
}

.skel-line.short {
  width: 50%;
}

/* Steam 背景图标 */
.steam-icon-bg {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 500px;
  height: 500px;
  opacity: 0;
  transform: rotate(-15deg);
  transition: opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.steam-icon-bg.in {
  opacity: 0.1;
  transform: rotate(-15deg) scale(1);
}

/* Steam Profile 按钮 */
/* 从steam原封不动复制的哈哈哈 */
.steam-profile-btn {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 0;
  font: inherit;
  overflow: visible;
  padding: 0;
  margin: 2px 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  display: block;
  line-height: 32px;
  color: #dfe3e6;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  border-radius: 2px;
  cursor: pointer;
  width: 100%;
  transition-property: opacity, background, color, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease-out;
  background: #3d4450;
  background-position: 99% 1%;
  background-size: 300% 300%;
  position: relative;
}

.steam-profile-btn:hover {
  background: #464d58;
  color: white;
}

@keyframes skel-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
