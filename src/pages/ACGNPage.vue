<template>
  <div class="page acgn">
    <div class="layer" :style="backStyle">
      <div class="bg-gradient" ref="backEl" />
    </div>

    <div class="layer" :style="titleStyle">
      <h1 class="watermark" ref="titleEl">ACGN</h1>
    </div>

    <div class="layer" :style="sceneryStyle">
      <img class="scenery" src="/images/scenery.png" />
    </div>

    <div class="layer" :style="decoStyle">
      <div class="deco deco-ring-1" ref="d1" />
      <div class="deco deco-ring-2" ref="d2" />
      <div class="deco deco-dot-1" ref="d3" />
      <div class="deco deco-dot-2" ref="d4" />
      <div class="deco deco-dot-3" ref="d5" />
    </div>

    <!-- 弹幕层 -->
    <div class="layer" :style="danmakuStyle">
      <div class="danmaku-layer" ref="danmakuEl">
        <span v-for="dm in danmakuList" :key="dm.id" class="danmaku" :style="{
          '--y': dm.y + '%',
          '--dur': dm.duration + 's',
          '--delay': dm.delay + 's',
          '--op': dm.opacity,
          '--size': dm.size + 'px',
        }">{{ dm.text }}</span>
      </div>
    </div>

    <div class="layer layer-front" :style="frontStyle">
      <div class="grid-wrap">
        <div class="main-grid">
          <!-- 左列：Anime -->
          <div class="col col-left" ref="colA">
            <div class="section-card tilt-l enter-left" ref="animeEl" :style="{ transitionDelay: '0.1s' }">
              <h2 class="section-title">
                <span class="sec-icon"><i class="fas fa-film"></i></span> Anime <span class="en">动画</span>
              </h2>

              <!-- 生涯数据 -->
              <div class="stat-row">
                <div class="stat-item">
                  <span class="stat-val">{{ careerStats.watching }}</span>
                  <span class="stat-label">正在看</span>
                </div>
                <div class="stat-item">
                  <span class="stat-val">{{ careerStats.watched }}</span>
                  <span class="stat-label">看过</span>
                </div>
                <div class="stat-item">
                  <span class="stat-val">{{ careerStats.want }}</span>
                  <span class="stat-label">想看</span>
                </div>
                <div class="stat-item">
                  <span class="stat-val">{{ careerStats.postpone }}</span>
                  <span class="stat-label">搁置</span>
                </div>
                <div class="stat-item">
                  <span class="stat-val">{{ careerStats.abandoned }}</span>
                  <span class="stat-label">抛弃</span>
                </div>
              </div>

              <!-- 最喜欢 -->
              <h3 class="sub-title"><i class="fas fa-heart"></i> 最喜欢</h3>
              <div class="anime-grid">
                <template v-if="animeLoading">
                  <div class="anime-card skeleton" v-for="n in 20" :key="'sk1-' + n">
                    <div class="anime-cover skel-box" />
                    <div class="anime-card-info">
                      <span class="skel-line" />
                      <span class="skel-line short" />
                    </div>
                  </div>
                </template>
                <div class="anime-card" v-for="(a, index) in favoriteAnime" v-else
                  :style="`animation-delay: calc(0.05s * ${index} )`">
                  <img class="anime-cover" :src="a.subject.images.small" :alt="a.subject.name" loading="lazy" />
                  <div class="anime-card-info">
                    <span class="anime-card-name">{{ a.subject.name_cn || a.subject.name }}</span>
                    <span class="anime-card-score"><i class="fas fa-star"></i> {{ a.subject.score || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- 最近在看 -->
              <h3 class="sub-title"><i class="fas fa-eye"></i> 最近在看</h3>
              <div class="anime-grid">
                <template v-if="animeLoading">
                  <div class="anime-card skeleton" v-for="n in 10" :key="'sk2-' + n">
                    <div class="anime-cover skel-box" />
                    <div class="anime-card-info">
                      <span class="skel-line" />
                      <span class="skel-line short" />
                    </div>
                  </div>
                </template>
                <div class="anime-card" v-for="(a, index) in watchingAnime" v-else
                  :style="`animation-delay: calc(0.05s * ${index} )`">
                  <img class="anime-cover" :src="a.subject.images.small" :alt="a.subject.name" loading="lazy" />
                  <div class="anime-card-info">
                    <span class="anime-card-name">{{ a.subject.name_cn || a.subject.name }}</span>
                    <span class="anime-card-score"><i class="fas fa-star"></i> {{ a.subject.score || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- 想要看 -->
              <h3 class="sub-title"><i class="fas fa-eye"></i> 想要看</h3>
              <div class="anime-grid">
                <template v-if="animeLoading">
                  <div class="anime-card skeleton" v-for="n in 10" :key="'sk3-' + n">
                    <div class="anime-cover skel-box" />
                    <div class="anime-card-info">
                      <span class="skel-line" />
                      <span class="skel-line short" />
                    </div>
                  </div>
                </template>
                <div class="anime-card" v-for="(a, index) in wantAnime" v-else
                  :style="`animation-delay: calc(0.05s * ${index} )`">
                  <img class="anime-cover" :src="a.subject.images.small" :alt="a.subject.name" loading="lazy" />
                  <div class="anime-card-info">
                    <span class="anime-card-name">{{ a.subject.name_cn || a.subject.name }}</span>
                    <span class="anime-card-score"><i class="fas fa-star"></i> {{ a.subject.score || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右列：CGN -->
          <div class="col col-right">
            <!-- Comic -->
            <div class="section-card tilt-r enter-right" ref="comicEl">
              <h2 class="section-title">
                <span class="sec-icon"><i class="fas fa-book"></i></span> Comic <span class="en">漫画</span>
              </h2>
              <div class="inline-list">
                <div class="inline-item" v-for="c in comicList" :key="c.title">
                  <strong>{{ c.title }}</strong>
                  <span>{{ c.author }} · {{ c.note }}</span>
                </div>
              </div>
            </div>

            <!-- Galgame -->
            <div class="section-card tilt-l enter-right" ref="galEl">
              <h2 class="section-title">
                <span class="sec-icon"><i class="fas fa-gamepad"></i></span> Galgame <span class="en">Ciallo~</span>
              </h2>
              <div class="inline-list">
                <div class="inline-item" v-for="g in galList" :key="g.title">
                  <strong>{{ g.title }}</strong>
                  <span>{{ g.brand }} · {{ g.note }}</span>
                </div>
              </div>
            </div>

            <!-- Novel -->
            <div class="section-card tilt-r enter-right" ref="novelEl">
              <h2 class="section-title">
                <span class="sec-icon"><i class="fas fa-book-open"></i></span> Novel <span class="en">轻小说</span>
              </h2>
              <div class="inline-list">
                <div class="inline-item" v-for="n in novelList" :key="n.title">
                  <strong>{{ n.title }}</strong>
                  <span>{{ n.author }} · {{ n.note }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import { api } from '@/api/client'

document.title = "二次元 | ACGN"

const url = 'https://api.bangumi.one'

const backStyle = useParallax(0.15)
const titleStyle = useParallax(0.25)
const sceneryStyle = useParallax(0.2)
const decoStyle = useParallax(0.4)
const danmakuStyle = useParallax(0.3)
const frontStyle = useParallax(1.0)

const danmakuList = [
  { id: 1, text: 'awsl', y: 3, duration: 12, delay: 1, opacity: '0.15', size: 18 },
  { id: 2, text: '23333', y: 7, duration: 13, delay: 2, opacity: '0.18', size: 16 },
  { id: 3, text: '666', y: 12, duration: 11, delay: 3, opacity: '0.12', size: 20 },
  { id: 4, text: '名场面', y: 18, duration: 14, delay: 4, opacity: '0.20', size: 14 },
  { id: 5, text: '前方高能', y: 22, duration: 15, delay: 5, opacity: '0.16', size: 18 },
  { id: 6, text: '非战斗人员请撤离', y: 27, duration: 13, delay: 6, opacity: '0.14', size: 16 },
  { id: 7, text: '弹幕护体', y: 31, duration: 12, delay: 7, opacity: '0.19', size: 18 },
  { id: 8, text: '完结撒花', y: 36, duration: 14, delay: 8, opacity: '0.13', size: 20 },
  { id: 9, text: '生日快乐', y: 40, duration: 11, delay: 9, opacity: '0.17', size: 16 },
  { id: 10, text: '爷青回', y: 44, duration: 15, delay: 10, opacity: '0.15', size: 18 },
  { id: 11, text: '爷青结', y: 48, duration: 13, delay: 11, opacity: '0.12', size: 14 },
  { id: 12, text: '泪目', y: 52, duration: 12, delay: 12, opacity: '0.18', size: 20 },
  { id: 13, text: '打卡', y: 56, duration: 14, delay: 13, opacity: '0.14', size: 16 },
  { id: 14, text: '人类圣经', y: 60, duration: 11, delay: 14, opacity: '0.16', size: 18 },
  { id: 15, text: '宇宙神作', y: 64, duration: 15, delay: 15, opacity: '0.19', size: 14 },
  { id: 16, text: '经费在燃烧', y: 68, duration: 13, delay: 16, opacity: '0.13', size: 18 },
  { id: 17, text: '作画炸裂', y: 72, duration: 12, delay: 17, opacity: '0.17', size: 20 },
  { id: 18, text: '我™直呼老婆', y: 76, duration: 14, delay: 18, opacity: '0.15', size: 16 },
  { id: 19, text: 'producer桑', y: 80, duration: 11, delay: 19, opacity: '0.12', size: 14 },
  { id: 20, text: '诸君，我喜欢战争', y: 84, duration: 15, delay: 20, opacity: '0.20', size: 18 },
  { id: 21, text: 'hentai！', y: 88, duration: 13, delay: 21, opacity: '0.16', size: 16 },
  { id: 22, text: '阿姨洗铁路', y: 92, duration: 12, delay: 22, opacity: '0.14', size: 18 },
  { id: 23, text: '这谁顶得住啊', y: 96, duration: 14, delay: 23, opacity: '0.18', size: 20 },
  { id: 24, text: '完了，我弯了', y: 1, duration: 11, delay: 24, opacity: '0.13', size: 14 },
  { id: 25, text: '橘势大好', y: 5, duration: 15, delay: 25, opacity: '0.17', size: 16 },
  { id: 26, text: '橘里橘气', y: 10, duration: 13, delay: 26, opacity: '0.15', size: 18 },
  { id: 27, text: '白学现场', y: 15, duration: 12, delay: 27, opacity: '0.19', size: 20 },
  { id: 28, text: '为什么你会这么熟练啊', y: 20, duration: 14, delay: 28, opacity: '0.12', size: 16 },
  { id: 29, text: '明明是我先来的', y: 25, duration: 11, delay: 29, opacity: '0.16', size: 18 },
  { id: 30, text: '又到了白色相簿的季节', y: 30, duration: 15, delay: 30, opacity: '0.14', size: 14 },
  { id: 31, text: '打死白学家', y: 35, duration: 13, delay: 31, opacity: '0.18', size: 20 },
  { id: 32, text: '你已经死了', y: 39, duration: 12, delay: 32, opacity: '0.13', size: 16 },
  { id: 33, text: '但是我拒绝', y: 43, duration: 14, delay: 33, opacity: '0.17', size: 18 },
  { id: 34, text: '你指尖跃动的电光，是我此生不灭的信仰', y: 47, duration: 15, delay: 34, opacity: '0.20', size: 14 },
  { id: 35, text: '教练我想打篮球', y: 51, duration: 11, delay: 35, opacity: '0.15', size: 16 },
  { id: 36, text: '因为我们是妖精的尾巴', y: 55, duration: 13, delay: 36, opacity: '0.12', size: 18 },
  { id: 37, text: '真相只有一个', y: 59, duration: 12, delay: 37, opacity: '0.19', size: 20 },
  { id: 38, text: '我愚蠢的弟弟啊', y: 63, duration: 14, delay: 38, opacity: '0.16', size: 14 },
  { id: 39, text: '計画通り', y: 67, duration: 15, delay: 39, opacity: '0.14', size: 18 },
  { id: 40, text: '我很好奇', y: 71, duration: 11, delay: 40, opacity: '0.18', size: 16 },
  { id: 41, text: '无路赛无路赛无路赛', y: 75, duration: 13, delay: 41, opacity: '0.13', size: 20 },
  { id: 42, text: '帮帮我，哆啦A梦', y: 79, duration: 12, delay: 42, opacity: '0.17', size: 14 },
  { id: 43, text: '连我爸爸都没打过我', y: 83, duration: 14, delay: 43, opacity: '0.15', size: 18 },
  { id: 44, text: '错的不是我，是这个世界', y: 87, duration: 15, delay: 44, opacity: '0.12', size: 16 },
  { id: 45, text: '人类总是重复同样的错误', y: 91, duration: 11, delay: 45, opacity: '0.20', size: 20 },
  { id: 46, text: '不能逃避', y: 95, duration: 13, delay: 46, opacity: '0.16', size: 14 },
  { id: 47, text: '我就是高达', y: 99, duration: 12, delay: 47, opacity: '0.14', size: 18 },
  { id: 48, text: '今天的风儿甚是喧嚣', y: 2, duration: 14, delay: 48, opacity: '0.19', size: 16 },
  { id: 49, text: '真是让人EX', y: 6, duration: 15, delay: 49, opacity: '0.13', size: 20 },
  { id: 50, text: '德国骨科', y: 11, duration: 11, delay: 50, opacity: '0.17', size: 14 },
  { id: 51, text: '营养快线', y: 16, duration: 13, delay: 51, opacity: '0.15', size: 18 },
  { id: 52, text: '膝盖中箭', y: 21, duration: 12, delay: 52, opacity: '0.12', size: 16 },
  { id: 53, text: '空降成功', y: 26, duration: 14, delay: 53, opacity: '0.18', size: 20 },
  { id: 54, text: '观光团', y: 32, duration: 15, delay: 54, opacity: '0.16', size: 14 },
  { id: 55, text: '一人血书', y: 37, duration: 11, delay: 55, opacity: '0.14', size: 18 },
  { id: 56, text: '同求', y: 42, duration: 13, delay: 56, opacity: '0.19', size: 16 },
  { id: 57, text: '此处有本', y: 46, duration: 12, delay: 57, opacity: '0.13', size: 20 },
  { id: 58, text: '车速过快', y: 50, duration: 14, delay: 58, opacity: '0.17', size: 14 },
  { id: 59, text: '老司机带带我', y: 54, duration: 15, delay: 59, opacity: '0.15', size: 18 },
  { id: 60, text: 'GKD', y: 58, duration: 11, delay: 60, opacity: '0.12', size: 16 },
  { id: 61, text: 'prpr', y: 62, duration: 13, delay: 61, opacity: '0.20', size: 20 },
  { id: 62, text: '我永远喜欢', y: 66, duration: 12, delay: 62, opacity: '0.16', size: 14 },
  { id: 63, text: '是我老婆', y: 70, duration: 14, delay: 63, opacity: '0.14', size: 18 },
  { id: 64, text: '鸡笼警告', y: 74, duration: 15, delay: 64, opacity: '0.18', size: 16 },
  { id: 65, text: '大佬喝茶', y: 78, duration: 11, delay: 65, opacity: '0.13', size: 20 },
  { id: 66, text: '云观众', y: 82, duration: 13, delay: 66, opacity: '0.17', size: 14 },
  { id: 67, text: '二刷', y: 86, duration: 12, delay: 67, opacity: '0.15', size: 18 },
  { id: 68, text: '三周目', y: 90, duration: 14, delay: 68, opacity: '0.12', size: 16 },
  { id: 69, text: '有生之年', y: 94, duration: 15, delay: 69, opacity: '0.19', size: 20 },
  { id: 70, text: '诈尸更新', y: 98, duration: 11, delay: 70, opacity: '0.16', size: 14 },
  { id: 71, text: '致敬', y: 0, duration: 13, delay: 71, opacity: '0.14', size: 18 },
  { id: 72, text: '镇站之宝', y: 4, duration: 12, delay: 72, opacity: '0.18', size: 16 },
  { id: 73, text: '弹幕承包', y: 8, duration: 14, delay: 73, opacity: '0.13', size: 20 },
  { id: 74, text: '好家伙', y: 13, duration: 15, delay: 74, opacity: '0.17', size: 14 },
  { id: 75, text: '很难不支持', y: 17, duration: 11, delay: 75, opacity: '0.15', size: 18 },
  { id: 76, text: '妙啊', y: 23, duration: 13, delay: 76, opacity: '0.12', size: 16 },
  { id: 77, text: '角卷绵芽？', y: 28, duration: 12, delay: 77, opacity: '0.20', size: 20 },
  { id: 78, text: 'WTM', y: 33, duration: 14, delay: 78, opacity: '0.16', size: 14 },
  { id: 79, text: '哈恰マ恰マ', y: 38, duration: 15, delay: 79, opacity: '0.14', size: 18 },
  { id: 80, text: '好时代，来临吧', y: 41, duration: 11, delay: 80, opacity: '0.19', size: 16 },
  { id: 81, text: '屑女人', y: 45, duration: 13, delay: 81, opacity: '0.13', size: 20 },
  { id: 82, text: '病人跑出来了', y: 49, duration: 12, delay: 82, opacity: '0.17', size: 14 },
  { id: 83, text: '你币没了', y: 53, duration: 14, delay: 83, opacity: '0.15', size: 18 },
  { id: 84, text: '下次一定', y: 57, duration: 15, delay: 84, opacity: '0.12', size: 16 },
  { id: 85, text: '硬币给你', y: 61, duration: 11, delay: 85, opacity: '0.18', size: 20 },
  { id: 86, text: '太草了', y: 65, duration: 13, delay: 86, opacity: '0.16', size: 14 },
  { id: 87, text: '不愧是你', y: 69, duration: 12, delay: 87, opacity: '0.14', size: 18 },
  { id: 88, text: '经典复刻', y: 73, duration: 14, delay: 88, opacity: '0.19', size: 16 },
  { id: 89, text: '猛男必看', y: 77, duration: 15, delay: 89, opacity: '0.13', size: 20 },
  { id: 90, text: '快住手，这根本不是决斗', y: 81, duration: 11, delay: 90, opacity: '0.17', size: 14 },
  { id: 91, text: '我已经看到结局了', y: 85, duration: 13, delay: 91, opacity: '0.15', size: 18 },
  { id: 92, text: '你的下一句话是', y: 89, duration: 12, delay: 92, opacity: '0.12', size: 16 },
  { id: 93, text: '但是我拒绝！', y: 93, duration: 14, delay: 93, opacity: '0.20', size: 20 },
  { id: 94, text: '团长，你在干什么啊团长', y: 97, duration: 15, delay: 94, opacity: '0.16', size: 14 },
  { id: 95, text: '不要停下来啊', y: 100, duration: 11, delay: 95, opacity: '0.14', size: 18 },
  { id: 96, text: '希望之花', y: 9, duration: 13, delay: 96, opacity: '0.18', size: 16 },
  { id: 97, text: '连接吧，牵绊！', y: 14, duration: 12, delay: 97, opacity: '0.13', size: 20 },
  { id: 98, text: '我的王之力啊', y: 19, duration: 14, delay: 98, opacity: '0.17', size: 14 },
  { id: 99, text: '漂亮的不像实力派', y: 24, duration: 15, delay: 99, opacity: '0.15', size: 18 },
  { id: 100, text: '你已经不是孤单一人了', y: 29, duration: 11, delay: 100, opacity: '0.12', size: 16 },
  { id: 101, text: '草', y: 34, duration: 12, delay: 101, opacity: '0.16', size: 18 },
  { id: 102, text: '大草原', y: 38, duration: 14, delay: 102, opacity: '0.19', size: 20 },
  { id: 103, text: '草生える', y: 42, duration: 11, delay: 103, opacity: '0.13', size: 14 },
  { id: 104, text: 'www', y: 46, duration: 15, delay: 104, opacity: '0.17', size: 16 },
  { id: 105, text: 'kksk', y: 50, duration: 13, delay: 105, opacity: '0.14', size: 18 },
  { id: 106, text: 'ここ好き', y: 54, duration: 12, delay: 106, opacity: '0.20', size: 20 },
  { id: 107, text: '尊い', y: 58, duration: 14, delay: 107, opacity: '0.15', size: 14 },
  { id: 108, text: '神回', y: 62, duration: 11, delay: 108, opacity: '0.18', size: 16 },
  { id: 109, text: '神作', y: 66, duration: 15, delay: 109, opacity: '0.13', size: 18 },
  { id: 110, text: '感動した', y: 70, duration: 13, delay: 110, opacity: '0.17', size: 20 },
  { id: 111, text: '泣けた', y: 74, duration: 12, delay: 111, opacity: '0.16', size: 14 },
  { id: 112, text: '待ってました', y: 78, duration: 14, delay: 112, opacity: '0.19', size: 16 },
  { id: 113, text: 'おかえり', y: 82, duration: 11, delay: 113, opacity: '0.13', size: 18 },
  { id: 114, text: 'ただいま', y: 86, duration: 15, delay: 114, opacity: '0.14', size: 20 },
  { id: 115, text: 'おつかれー', y: 90, duration: 13, delay: 115, opacity: '0.18', size: 14 },
  { id: 116, text: 'ごちそうさまでした', y: 94, duration: 12, delay: 116, opacity: '0.17', size: 16 },
  { id: 117, text: '美味しい', y: 98, duration: 14, delay: 117, opacity: '0.15', size: 18 },
  { id: 118, text: 'うっせぇわ', y: 1, duration: 11, delay: 118, opacity: '0.12', size: 20 },
  { id: 119, text: 'しんどい', y: 5, duration: 15, delay: 119, opacity: '0.16', size: 14 },
  { id: 120, text: 'つらい', y: 9, duration: 13, delay: 120, opacity: '0.19', size: 16 },
  { id: 121, text: 'わかる', y: 13, duration: 12, delay: 121, opacity: '0.14', size: 18 },
  { id: 122, text: 'それな', y: 17, duration: 14, delay: 122, opacity: '0.18', size: 20 },
  { id: 123, text: 'そうそう', y: 21, duration: 11, delay: 123, opacity: '0.13', size: 14 },
  { id: 124, text: '確かに', y: 25, duration: 15, delay: 124, opacity: '0.17', size: 16 },
  { id: 125, text: '絶対許さない', y: 29, duration: 13, delay: 125, opacity: '0.15', size: 18 },
  { id: 126, text: '無理', y: 33, duration: 12, delay: 126, opacity: '0.20', size: 20 },
  { id: 127, text: 'やばい', y: 37, duration: 14, delay: 127, opacity: '0.16', size: 14 },
  { id: 128, text: 'すごい', y: 41, duration: 11, delay: 128, opacity: '0.19', size: 16 },
  { id: 129, text: 'かわいい', y: 45, duration: 15, delay: 129, opacity: '0.13', size: 18 },
  { id: 130, text: 'かっこいい', y: 49, duration: 13, delay: 130, opacity: '0.17', size: 20 },
  { id: 131, text: 'あああああ', y: 53, duration: 12, delay: 131, opacity: '0.14', size: 14 },
  { id: 132, text: 'うわぁ', y: 57, duration: 14, delay: 132, opacity: '0.18', size: 16 },
  { id: 133, text: 'ええええ', y: 61, duration: 11, delay: 133, opacity: '0.16', size: 18 },
  { id: 134, text: 'は？', y: 65, duration: 15, delay: 134, opacity: '0.15', size: 20 },
  { id: 135, text: 'マジで？', y: 69, duration: 13, delay: 135, opacity: '0.19', size: 14 },
  { id: 136, text: '信じられない', y: 73, duration: 12, delay: 136, opacity: '0.13', size: 16 },
  { id: 137, text: 'なにこれ', y: 77, duration: 14, delay: 137, opacity: '0.17', size: 18 },
  { id: 138, text: 'やめて', y: 81, duration: 11, delay: 138, opacity: '0.14', size: 20 },
  { id: 139, text: '消えろ', y: 85, duration: 15, delay: 139, opacity: '0.18', size: 14 },
  { id: 140, text: 'うざい', y: 89, duration: 13, delay: 140, opacity: '0.12', size: 16 },
  { id: 141, text: '闇', y: 93, duration: 12, delay: 141, opacity: '0.16', size: 18 },
  { id: 142, text: 'エモい', y: 97, duration: 14, delay: 142, opacity: '0.20', size: 20 },
  { id: 143, text: 'エグい', y: 0, duration: 11, delay: 143, opacity: '0.15', size: 14 },
  { id: 144, text: 'バ美', y: 4, duration: 15, delay: 144, opacity: '0.18', size: 16 },
  { id: 145, text: '圧倒的', y: 8, duration: 13, delay: 145, opacity: '0.13', size: 18 },
  { id: 146, text: '大勝利', y: 12, duration: 12, delay: 146, opacity: '0.17', size: 20 },
  { id: 147, text: '完璧', y: 16, duration: 14, delay: 147, opacity: '0.16', size: 14 },
  { id: 148, text: 'これだよこれ', y: 20, duration: 11, delay: 148, opacity: '0.19', size: 16 },
  { id: 149, text: 'ここすき', y: 24, duration: 15, delay: 149, opacity: '0.14', size: 18 },
  { id: 150, text: 'すき', y: 28, duration: 13, delay: 150, opacity: '0.18', size: 20 },
  { id: 151, text: '愛してる', y: 32, duration: 12, delay: 151, opacity: '0.13', size: 14 },
  { id: 152, text: '結婚してください', y: 36, duration: 14, delay: 152, opacity: '0.17', size: 16 },
  { id: 153, text: '離さない', y: 40, duration: 11, delay: 153, opacity: '0.15', size: 18 },
  { id: 154, text: '一生推し', y: 44, duration: 15, delay: 154, opacity: '0.20', size: 20 },
  { id: 155, text: '誕生日おめでとう', y: 48, duration: 13, delay: 155, opacity: '0.16', size: 14 },
  { id: 156, text: 'おめでとう', y: 52, duration: 12, delay: 156, opacity: '0.19', size: 16 },
  { id: 157, text: '頑張れ', y: 56, duration: 14, delay: 157, opacity: '0.13', size: 18 },
  { id: 158, text: 'ファイト', y: 60, duration: 11, delay: 158, opacity: '0.17', size: 20 },
  { id: 159, text: '僕たちはひとつの光', y: 64, duration: 15, delay: 159, opacity: '0.14', size: 14 },
  { id: 160, text: 'μ\'sic forever', y: 68, duration: 13, delay: 160, opacity: '0.18', size: 16 },
  { id: 161, text: 'ラブライブ！', y: 72, duration: 12, delay: 161, opacity: '0.15', size: 18 },
  { id: 162, text: '俺の嫁', y: 76, duration: 14, delay: 162, opacity: '0.12', size: 20 },
  { id: 163, text: 'かかってこい', y: 80, duration: 11, delay: 163, opacity: '0.16', size: 14 },
  { id: 164, text: '覚悟完了', y: 84, duration: 15, delay: 164, opacity: '0.19', size: 16 },
  { id: 165, text: '承太郎さん', y: 88, duration: 13, delay: 165, opacity: '0.13', size: 18 },
  { id: 166, text: '無駄無駄', y: 92, duration: 12, delay: 166, opacity: '0.17', size: 20 },
  { id: 167, text: 'オラオラ', y: 96, duration: 14, delay: 167, opacity: '0.14', size: 14 },
  { id: 168, text: 'ザ・ワールド', y: 100, duration: 11, delay: 168, opacity: '0.18', size: 16 },
  { id: 169, text: '時よ止まれ', y: 3, duration: 15, delay: 169, opacity: '0.15', size: 18 },
  { id: 170, text: 'だが断る', y: 7, duration: 13, delay: 170, opacity: '0.20', size: 20 },
  { id: 171, text: 'このDIOだ', y: 11, duration: 12, delay: 171, opacity: '0.16', size: 14 },
  { id: 172, text: 'にぃぃぃ', y: 15, duration: 14, delay: 172, opacity: '0.19', size: 16 },
  { id: 173, text: 'ほう…', y: 19, duration: 11, delay: 173, opacity: '0.13', size: 18 },
  { id: 174, text: '面白い', y: 23, duration: 15, delay: 174, opacity: '0.17', size: 20 },
  { id: 175, text: '続きはWebで！', y: 27, duration: 13, delay: 175, opacity: '0.14', size: 14 },
  { id: 176, text: '次週予告', y: 31, duration: 12, delay: 176, opacity: '0.18', size: 16 },
  { id: 177, text: '引き続きご覧ください', y: 35, duration: 14, delay: 177, opacity: '0.15', size: 18 },
  { id: 178, text: 'お前はもう死んでいる', y: 39, duration: 11, delay: 178, opacity: '0.12', size: 20 },
  { id: 179, text: 'なんてこった', y: 43, duration: 15, delay: 179, opacity: '0.16', size: 14 },
  { id: 180, text: 'やったぜ', y: 47, duration: 13, delay: 180, opacity: '0.19', size: 16 },
  { id: 181, text: 'うますぎ', y: 51, duration: 12, delay: 181, opacity: '0.13', size: 18 },
  { id: 182, text: '耳が幸せ', y: 55, duration: 14, delay: 182, opacity: '0.17', size: 20 },
  { id: 183, text: '作業用BGM', y: 59, duration: 11, delay: 183, opacity: '0.14', size: 14 },
  { id: 184, text: '脳がとろける', y: 63, duration: 15, delay: 184, opacity: '0.18', size: 16 },
  { id: 185, text: '中毒性', y: 67, duration: 13, delay: 185, opacity: '0.15', size: 18 },
  { id: 186, text: 'ギフテッド', y: 71, duration: 12, delay: 186, opacity: '0.20', size: 20 },
  { id: 187, text: '異世界転生', y: 75, duration: 14, delay: 187, opacity: '0.16', size: 14 },
  { id: 188, text: 'チート', y: 79, duration: 11, delay: 188, opacity: '0.19', size: 16 },
  { id: 189, text: 'スライム', y: 83, duration: 15, delay: 189, opacity: '0.13', size: 18 },
  { id: 190, text: 'エルフ', y: 87, duration: 13, delay: 190, opacity: '0.17', size: 20 },
  { id: 191, text: 'ドラゴン', y: 91, duration: 12, delay: 191, opacity: '0.14', size: 14 },
  { id: 192, text: 'かわ余', y: 95, duration: 14, delay: 192, opacity: '0.18', size: 16 },
  { id: 193, text: 'ジェラシー', y: 99, duration: 11, delay: 193, opacity: '0.15', size: 18 },
  { id: 194, text: 'しゃぶしゃぶ', y: 2, duration: 15, delay: 194, opacity: '0.12', size: 20 },
  { id: 195, text: 'やきにく', y: 6, duration: 13, delay: 195, opacity: '0.16', size: 14 },
  { id: 196, text: 'それではまた来週', y: 10, duration: 12, delay: 196, opacity: '0.19', size: 16 },
  { id: 197, text: '次の予告', y: 14, duration: 14, delay: 197, opacity: '0.13', size: 18 },
  { id: 198, text: '最終回だったね', y: 18, duration: 11, delay: 198, opacity: '0.17', size: 20 },
  { id: 199, text: 'さようなら、すべてのエヴァンゲリオン', y: 22, duration: 15, delay: 199, opacity: '0.14', size: 14 },
  { id: 200, text: 'まじ卍', y: 26, duration: 13, delay: 200, opacity: '0.18', size: 16 }
];

interface Response {
  "total": number,
  "limit": number,
  "offset": number,
  "data": Anime[],
  "title": string,
  "description": string,
  "details": string
}

interface Tag {
  "name": string,
  "count": number,
  "total_cont": number
}

interface Anime {
  "updated_at": string,
  "comment": string | null,
  "tags": [],
  "subject": {
    "date": string,
    "images": {
      "small": string,
      "grid": string,
      "large": string,
      "medium": string,
      "common": string
    },
    "name": string,
    "name_cn": string,
    "short_summary": string,
    "tags": Tag[],
    "score": number,
    "type": number,
    "id": number,
    "eps": number,
    "volumes": number,
    "collection_total": number,
    "rank": number
  },
  "subject_id": number,
  "vol_status": number,
  "ep_status": number,
  "subject_type": number,
  "type": number,
  "rate": number,
  "private": boolean
}

const careerStats = { watched: 0, watching: 0, want: 0, postpone: 0, abandoned: 0 }

const favoriteAnime = ref<Anime[]>([])
const watchingAnime = ref<Anime[]>([])
const wantAnime = ref<Anime[]>([])
const animeLoading = ref(true)
const postponeAnime = ref<Anime[]>([])
const abandonedAnime = ref<Anime[]>([])

const comicList = [
  { title: '东方三月精（とうほうさんげつせい）～ Visionary Fairies in Shrine 1-3', author: 'Zun/比良坂真琴', note: '好看' },
  { title: '没错只看过这三本(', author: 'Undefined', note: '偷懒ing...' }
]

const galList = [
  { title: '纸上魔法使', brand: 'ウグイスカグラ', note: '正在玩' },
  { title: '千恋＊万花', brand: 'Yuzusoft', note: '正在玩' },
  { title: 'NEKOPARA Vol.1', brand: 'NEKO WORKs', note: '玩过' },
  { title: '缘之空', brand: 'Sphere', note: '玩过' },
  { title: 'Doki Doki Literature Club!', brand: 'Team Salvato', note: '吓哭了QAQ' },
  { title: '最近有在玩wwww（增长阅历ing...', brand: 'Undefined', note: '增长阅历ing...' }
]

const novelList = [
  { title: '无职转生', author: '理不尽な孫の手', note: '神了' },
  { title: '紫罗兰永恒花园', author: '晓佳奈', note: '没时间继续看了QwQ' },
  { title: '转生成蜘蛛又怎样！', author: '马场翁', note: '爽，不要看动画拖拖拉拉的双线剧情，直接看原作来' },
  { title: '靠废柴技能【状态异常】成为最强的我将蹂躏一切', author: '篠崎芳', note: '复仇爽' },
  { title: '不看了QwQ，纯文字还是比不上动画饿啊(', author: 'Undefined', note: '正在开发ing...' }
]

const getFavoriteAnime = async () => {
  try {
    let allData: Anime[] = [];
    let total = 0;
    let offset = 0;
    const limit = 100;

    const firstResponse = await api.get<Response>(
      `${url}/v0/users/1254033/collections?subject_type=2&type=2&limit=1&offset=0`
    );

    if (firstResponse.status !== 200) {
      console.error(firstResponse.data.title);
      console.error(firstResponse.data.description);
      return;
    }

    total = firstResponse.data.total;
    careerStats.watched = total;

    const totalPages = Math.ceil(total / limit);

    for (let page = 0; page < totalPages; page++) {
      offset = page * limit;
      const response = await api.get<Response>(
        `${url}/v0/users/1254033/collections?subject_type=2&type=2&limit=${limit}&offset=${offset}`
      );

      if (response.status === 200) {
        allData = allData.concat(response.data.data);
      } else {
        console.error(`第${page + 1}页请求失败:`, response.data.title);
        break;
      }
    }
    allData.sort((a, b) => b.rate - a.rate);
    favoriteAnime.value = allData.slice(0, 20);
  } catch (error) {
    console.error("网络错误:", error);
  }
}

const getWatchingAnime = async () => {
  try {
    const response = await api.get<Response>(`${url}/v0/users/1254033/collections?subject_type=2&type=3&limit=10&offset=0`);
    if (response.status === 200) {
      watchingAnime.value = response.data.data
      careerStats.watching = response.data.total
    } else {
      console.error(response.data.title);
      console.error(response.data.description);
      console.error(response.data.details);
    }
  } catch (error) {
    console.error("网络错误")
  }
}

const getWantAnime = async () => {
  try {
    const response = await api.get<Response>(`${url}/v0/users/1254033/collections?subject_type=2&type=1&limit=10&offset=0`);
    if (response.status === 200) {
      wantAnime.value = response.data.data
      careerStats.want = response.data.total
    } else {
      console.error(response.data.title);
      console.error(response.data.description);
      console.error(response.data.details);
    }
  } catch (error) {
    console.error("网络错误")
  }
}

const getPostponeAnime = async () => {
  try {
    const response = await api.get<Response>(`${url}/v0/users/1254033/collections?subject_type=2&type=4&limit=10&offset=0`);
    if (response.status === 200) {
      postponeAnime.value = response.data.data
      careerStats.postpone = response.data.total
    } else {
      console.error(response.data.title);
      console.error(response.data.description);
      console.error(response.data.details);
    }
  } catch (error) {
    console.error("网络错误")
  }
}

const getAbandonedAnime = async () => {
  try {
    const response = await api.get<Response>(`${url}/v0/users/1254033/collections?subject_type=2&type=5&limit=10&offset=0`);
    if (response.status === 200) {
      abandonedAnime.value = response.data.data
      careerStats.abandoned = response.data.total
    } else {
      console.error(response.data.title);
      console.error(response.data.description);
      console.error(response.data.details);
    }
  } catch (error) {
    console.error("网络错误")
  }
}

const backEl = ref<HTMLElement | null>(null); const titleEl = ref<HTMLElement | null>(null)
const d1 = ref<HTMLElement | null>(null); const d2 = ref<HTMLElement | null>(null)
const d3 = ref<HTMLElement | null>(null); const d4 = ref<HTMLElement | null>(null)
const d5 = ref<HTMLElement | null>(null)
const danmakuEl = ref<HTMLElement | null>(null)
const colA = ref<HTMLElement | null>(null)
const animeEl = ref<HTMLElement | null>(null); const comicEl = ref<HTMLElement | null>(null)
const galEl = ref<HTMLElement | null>(null); const novelEl = ref<HTMLElement | null>(null)

const bgRefs = [backEl, titleEl, d1, d2, d3, d4, d5, danmakuEl]
const contentRefs = [colA, animeEl, comicEl, galEl, novelEl]

onMounted(async () => {
  requestAnimationFrame(() => {
    bgRefs.forEach(r => r.value?.classList.add('in'))
    // 内容卡片延迟入场
    const delays = [100, 200, 350, 500, 650]
    contentRefs.forEach((r, i) => {
      setTimeout(() => r.value?.classList.add('in'), delays[i])
    })
  })
  getPostponeAnime();
  getAbandonedAnime();
  await Promise.all([getFavoriteAnime(), getWatchingAnime(), getWantAnime()])
  animeLoading.value = false
})

const unmount = () => {
  bgRefs.forEach(r => r.value?.classList.remove('in'))
  contentRefs.forEach(r => r.value?.classList.remove('in'))
}

defineExpose({ unmount, nextTransition: 'ShatterWave', prevTransition: 'BlocksShift' })
</script>

<style scoped>
.acgn {
  background: linear-gradient(160deg, #faf6f0 0%, #f5efe6 40%, #f8f3ed 100%);
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
    radial-gradient(ellipse 60% 50% at 15% 40%, rgba(180, 140, 100, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 80% 50%, rgba(160, 120, 80, 0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 1s ease-out;
}

.bg-gradient.in {
  opacity: 1;
}

.watermark {
  position: absolute;
  bottom: 4%;
  right: 10%;
  font-size: clamp(40px, 7vw, 80px);
  font-weight: 800;
  color: rgba(160, 120, 80, 0.2);
  line-height: 1;
  user-select: none;
  transform: translateX(200px);
  opacity: 0;
  transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
}

.watermark.in {
  transform: translateX(0);
  opacity: 1;
}

.scenery {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  opacity: 0.2;
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
  top: 12%;
  right: 10%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(180, 130, 80, 0.15);
  animation: orbit-float 10s linear infinite;
  transition-delay: 0.05s;
}

.deco-ring-2 {
  bottom: 18%;
  left: 12%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid rgba(180, 130, 80, 0.12);
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
  top: 15%;
  left: 30%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(180, 130, 80, 0.25);
  animation: dot-pulse 3.5s ease-in-out infinite;
  transition-delay: 0.15s;
}

.deco-dot-2 {
  bottom: 28%;
  right: 25%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(180, 130, 80, 0.2);
  animation: dot-pulse 3.5s ease-in-out 1.2s infinite;
  transition-delay: 0.2s;
}

.deco-dot-3 {
  top: 55%;
  right: 35%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(180, 130, 80, 0.18);
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

/* ===== 弹幕层 ===== */
.danmaku-layer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.danmaku {
  position: absolute;
  top: calc(var(--y));
  left: 100%;
  white-space: nowrap;
  font-size: var(--size, 16px);
  font-weight: 700;
  color: rgba(160, 120, 80, var(--op, 0.1));
  animation: danmaku-scroll var(--dur, 12s) linear infinite;
  animation-delay: calc(var(--delay, 0s) * -1);
}

@keyframes danmaku-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100vw - 100%));
  }
}

/* ===== 前层 ===== */
.grid-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-grid {
  width: 85%;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
  padding: 20px 0;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.col-left {
  opacity: 0;
  transform: translateX(-20px);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
}

.col-left.in {
  transform: translateX(0);
  opacity: 1;
}

.col-right {
  gap: 12px;
}

/* ===== 板块卡片 ===== */
.section-card {
  padding: 18px 22px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(180, 130, 80, 0.08);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out;
}

.section-card.in {
  opacity: 1;
}

.enter-left {
  transform: translateX(-30px);
}

.enter-right {
  transform: translateX(30px);
}

.tilt-l {
  --tilt: -0.4deg;
}

.tilt-r {
  --tilt: 0.5deg;
}

.enter-left.in,
.enter-right.in {
  transform: translateX(0) rotate(var(--tilt, 0deg));
}

.section-title {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 700;
  color: #6b4a2a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title .en {
  font-size: 11px;
  font-weight: 400;
  color: rgba(100, 70, 30, 0.35);
  margin-left: auto;
}

.sec-icon {
  font-size: 20px;
}

/* ===== 左列 - Anime ===== */
.stat-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 6px 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.35);
}

.stat-val {
  font-size: 18px;
  font-weight: 700;
  color: #6b4a2a;
}

.stat-label {
  font-size: 9px;
  color: rgba(100, 70, 30, 0.4);
  margin-top: 1px;
}

.sub-title {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 600;
  color: #5a3e22;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.anime-card {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(30px);
  opacity: 0;

  animation: anime-card-enter 0.5s ease-out forwards;
}

@keyframes anime-card-enter {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.anime-cover {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;

  user-select: none;
  -webkit-user-drag: none;
}

.anime-card-info {
  padding: 4px 6px 5px;
  text-align: center;
}

.anime-card-name {
  display: block;
  font-size: 8px;
  font-weight: bold;
  color: #5a3e22;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-card-score {
  display: block;
  font-size: 9px;
  color: rgba(160, 110, 60, 0.6);
  margin-top: 1px;
}

/* 骨架屏 */
.skeleton {
  pointer-events: none;
}

.skel-box {
  background: linear-gradient(90deg, rgba(200, 180, 160, 0.15) 25%, rgba(200, 180, 160, 0.3) 50%, rgba(200, 180, 160, 0.15) 75%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s ease-in-out infinite;
}

.skel-line {
  display: block;
  height: 10px;
  margin: 2px auto;
  border-radius: 3px;
  background: linear-gradient(90deg, rgba(200, 180, 160, 0.15) 25%, rgba(200, 180, 160, 0.3) 50%, rgba(200, 180, 160, 0.15) 75%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s ease-in-out infinite;
  width: 80%;
}

.skel-line.short {
  width: 45%;
}

@keyframes skel-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* ===== 右列 - 列表 ===== */
.inline-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inline-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}

.inline-item strong {
  color: #5a3e22;
  font-size: 12px;
}

.inline-item span {
  color: rgba(100, 70, 30, 0.35);
  font-size: 10px;
}

@media (max-width: 768px) {
  .grid-wrap {
    align-items: flex-start;
  }

  .main-grid {
    padding: 0;
    margin-top: 40px;
    grid-template-columns: 1fr;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100dvh - 40px);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 10%, white 100%);

    .anime-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .col-left {
    padding-top: 40px;
  }

  .col-right:last-child {
    padding-bottom: 80px;
  }

  .anime-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
