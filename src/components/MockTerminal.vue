<template>
  <div class="mock-terminal" @click="focusInput" ref="terminalEl">
    <div class="output" ref="outputEl">
      <div v-for="(line, i) in lines" :key="i" class="line" v-html="line" />
    </div>
    <div class="input-row">
      <span class="prompt" v-html="promptHtml" />
      <span class="cmd-text">{{ input.slice(0, cursorPos) }}</span><span class="cursor-wrap"><span
          class="cursor" /></span><span class="cmd-text">{{ input.slice(cursorPos) }}</span>
      <input ref="inputEl" v-model="input" class="cmd-input" @keydown.enter.prevent="onEnter"
        @keydown.arrow-up.prevent="onHistory(1)" @keydown.arrow-down.prevent="onHistory(-1)"
        @keydown.arrow-left="syncCursor" @keydown.arrow-right="syncCursor" @keydown.tab.prevent="onTab"
        @keyup="syncCursor" @click="syncCursor" autocomplete="off" autocorrect="off" spellcheck="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import AnsiToHtml from 'ansi-to-html'
import { api } from '@/api/client';

const terminalEl = ref<HTMLDivElement | null>(null);

interface CommandFn {
  (argv: string[]): string | Promise<string>
}

const builtinCommands: Record<string, CommandFn> = {
  help() {
    const cmds = Object.keys(allCommands.value).sort()
    return `\x1b[1;38;2;255;182;143mAvailable commands:\x1b[0m
  ${cmds.join(', ')}

use --help or -h argument to learn more information about a command.`
  },

  echo(argv) {
    return argv.join(' ')
  },

  clear() {
    return '__CLEAR__'
  },

  cls() {
    return '__CLEAR__'
  },

  date() {
    return new Date().toString()
  },

  whoami() {
    return 'aoralsfout'
  },

  ua() {
    return navigator.userAgent
  },

  uname() {
    return 'Linux x86_64'
  },

  eval(argv) {
    try {
      const command = argv.join(' ')
      return eval(command)?.toString()
    } catch (e: any) {
      return e.message
    }
  },

  js(argv) {
    try {
      const command = argv.join(' ')
      return eval(command)?.toString()
    } catch (e: any) {
      return e.message
    }
  },

  async fastfetch() {
    try {
      const res = await api.get('/api/fastfetch')
      if (res.status === 200) {
        const data = res.data.content;
        return fastfetchFormat(data)
      } else {
        throw new Error('请求失败');
      }
    } catch {
      return '\x1b[31m未知错误：无法连接到 fastfetch 服务\x1b[0m'
    }
  },

  webfetch() {
    const c = (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`
    const r = '\x1b[0m'
    const b = '\x1b[1m'
    const D = c(160, 180, 200)
    const L = c(200, 180, 160)
    const H = c(255, 182, 143)
    const W = c(220, 210, 200)
    const G = c(140, 180, 140)
    const LG = c(180, 180, 180)
    const ua = navigator.userAgent
    const Browser = {
      Chrome: ua.match(/Chrome\/([\d.]+)/),
      Firefox: ua.match(/Firefox\/([\d.]+)/),
      Safari: ua.match(/Safari\/([\d.]+)/),
      Edge: ua.match(/Edge\/([\d.]+)/),
      IE: ua.match(/(MSIE\s|Trident.*rv:)([\d.]+)/),
    }

    const browser = Browser.Chrome ? `${H}${b}Chrome${r}` :
      Browser.Firefox ? `${H}${b}Firefox${r}` :
        Browser.Safari ? `${H}${b}Safari${r}` :
          Browser.Edge ? `${H}${b}Edge${r}` :
            Browser.IE ? `${H}${b}IE${r}` : `${H}${b}Unknown${r}`

    const info = [
      ``,
      `${H}${b}Browser${r}`,
      `  ${W}Browser${r}       ${browser}`,
      ``,
      `${H}${b}Device${r}`,
      `  ${W}Platform${r}      ${navigator.platform ?? 'unknown'}`,
      `  ${W}CPU Cores${r}     ${navigator.hardwareConcurrency ?? 'unknown'}`,
      `  ${W}Language${r}      ${navigator.language}`,
      `  ${W}Timezone${r}      ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      ``,
      `${H}${b}Screen${r}`,
      `  ${W}Screen${r}        ${screen.width}×${screen.height} @ ${window.devicePixelRatio}x`,
      `  ${W}Viewport${r}      ${window.innerWidth}×${window.innerHeight}`,
      `  ${W}Terminal${r}      ${terminalEl.value?.clientWidth}×${terminalEl.value?.clientHeight}`,
      `  ${W}Color Depth${r}   ${screen.colorDepth}-bit`,
      ``,
      `${H}${b}Network${r}`,
      `  ${W}Online${r}        ${navigator.onLine ? G + 'yes' : '\x1b[31mno'}${r}`,
      ``,
      `${H}${b}Website${r}`,
      `  ${W}URL${r}           ${location.origin}`,
      `  ${W}Tech Stack${r}    Vue3 Typescript`,
      `  ${W}Open Source${r}   https://github.com/AoralsFout/AboutMe`,
    ]

    const icon = `                                                 
${G}  :=====-${LG}:.:::..      ..:::.:${G}-=====:              ${r}
${G}   -++++++-${LG}:::::.    .:::::${G}-++++++-               ${r}
${G}    :++++++-${LG}:::::.  .:::::${G}-++++++:                ${r}
${G}     :++++++-${LG}:::::..:::::${G}-++++++:                 ${r}
${G}      :++++++=${LG}::::::::::${G}=++++++:                  ${r}
${G}       .=+++++=${LG}::::::::${G}=+++++=.                   ${r}
${G}        .=+++++=${LG}::::::${G}=+++++=.                    ${r}
${G}         .=+++++=${LG}::::${G}=+++++=.                     ${r}
${G}          .=+++++=--=+++++=.                      ${r}
${G}            -++++++++++++-                        ${r}
${G}             -++++++++++-                         ${r}
${G}              -++++++++-                          ${r}
${G}               :++++++:                           ${r}
${G}                :++++:                            ${r}
${G}                 :++:                             ${r}
${G}                  ..                              ${r}
                                                  `

    const iconArray = icon.split('\n');
    for (let i = 0; i < info.length; i++) {
      if (!iconArray[i]) {
        iconArray.push(' '.repeat(50));
      }
    }

    let out = iconArray.map((line, index) => {
      return `${line}${info[index] || ''}`
    });

    return out.join('\n')
  },
}

function fastfetchFormat(str: string): string {
  let fsArray = str.split('\n')
  let fsInfoArray = [''.repeat(50), ...fsArray.slice(20)]
  fsArray = fsArray.slice(0, 20)
  if (fsArray[19]) fsArray[19] = fsArray[19].slice(0, 39)
  fsInfoArray = fsInfoArray.map(line => line.replace('\x1b[49C', ''))
  fsArray.forEach((line, index) => {
    if (line.length < 50) fsArray[index] = line.padEnd(50, ' ')
  })
  for (let i = 0; i < 9; i++) fsArray.push(' '.repeat(50))
  fsArray.forEach((_, index) => {
    fsArray[index] += fsInfoArray[index]!
  })
  return fsArray.join('\n')
}

const props = defineProps<{
  commands?: Record<string, CommandFn>
  autoRun?: string
  prompt?: string
}>()

const ansi = new AnsiToHtml()
const inputEl = ref<HTMLInputElement | null>(null)
const outputEl = ref<HTMLElement | null>(null)
const input = ref('')
const cursorPos = ref(0)
const lines = ref<string[]>([])
const history = ref<string[]>([])
const historyIdx = ref(-1)

const allCommands = computed<Record<string, CommandFn>>(() => ({
  ...builtinCommands,
  ...props.commands,
}))

const pad = (n: number) => n < 10 ? `0${n}` : String(n)
const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = pad(now.getHours()) + ':' + pad(now.getMinutes())
}

function buildPromptRaw() {
  return `\x1b[38;2;255;182;143m\x1b[48;2;255;182;143m\x1b[38;2;83;34;1m󰣇 aoralsfout \x1b[48;2;206;201;145m\x1b[38;2;255;182;143m\x1b[38;2;83;34;1m ~ \x1b[48;2;255;219;202m\x1b[38;2;206;201;145m\x1b[48;2;140;78;41m\x1b[38;2;255;219;202m\x1b[48;2;230;190;171m\x1b[38;2;140;78;41m\x1b[48;2;92;65;50m\x1b[38;2;230;190;171m\x1b[38;2;240;223;216m  ${currentTime.value} \x1b[0m\x1b[38;2;92;65;50m `
}

const promptHtml = computed(() => {
  const raw = props.prompt ?? buildPromptRaw()
  return ansi.toHtml(raw)
})

let timeTimer: ReturnType<typeof setInterval> | null = null

function focusInput() {
  inputEl.value?.focus()
}

function syncCursor() {
  nextTick(() => {
    cursorPos.value = inputEl.value?.selectionStart ?? input.value.length
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (outputEl.value) {
      outputEl.value.scrollTop = outputEl.value.scrollHeight
    }
  })
}

async function onEnter() {
  const cmd = input.value.trim()
  input.value = ''
  cursorPos.value = 0
  if (!cmd) return

  history.value.push(cmd)
  historyIdx.value = -1

  const execPromptRaw = props.prompt ?? buildPromptRaw()
  lines.value.push(ansi.toHtml(execPromptRaw) + ansi.toHtml(cmd))

  const args = cmd.split(/\s+/)
  const name = args[0]!
  const argv = args.slice(1)

  const fn = allCommands.value[name]
  if (!fn) {
    lines.value.push(ansi.toHtml(`\x1b[38;2;255;0;0mcommand not found: ${name}\x1b[0m`))
    lines.value.push(' ')
    scrollToBottom()
    return
  }

  try {
    const result = await fn(argv)
    if (result === '__CLEAR__') {
      lines.value = []
    } else {
      if (result) {
        lines.value.push(ansi.toHtml(result))
      }
      lines.value.push(' ')
    }
  } catch (e) {
    lines.value.push(ansi.toHtml(`\x1b[38;2;255;0;0merror: ${e}\x1b[0m`))
    lines.value.push(' ')
  }

  scrollToBottom()
}

function onHistory(dir: number) {
  if (history.value.length === 0) return
  historyIdx.value = Math.min(
    Math.max(historyIdx.value + dir, -1),
    history.value.length - 1,
  )
  const actualIdx = historyIdx.value >= 0
    ? history.value.length - 1 - historyIdx.value
    : -1
  input.value = actualIdx >= 0 ? history.value[actualIdx]! : ''
  cursorPos.value = input.value.length
  nextTick(() => inputEl.value?.setSelectionRange(input.value.length, input.value.length))
}

function onTab() {
  const partial = input.value.trim().split(/\s+/)[0] ?? ''
  const matches = Object.keys(allCommands.value).filter(c => c.startsWith(partial))
  if (matches.length === 1) {
    input.value = matches[0]! + ' '
    cursorPos.value = input.value.length
  } else if (matches.length > 1) {
    lines.value.push(ansi.toHtml(`\x1b[38;2;160;180;160m${matches.join('  ')}\x1b[0m`))
    scrollToBottom()
  }
}

watch(() => props.autoRun, (cmd) => {
  if (cmd) {
    input.value = cmd
    nextTick(() => onEnter())
  }
})

onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 10000)
  if (props.autoRun) {
    input.value = props.autoRun
    nextTick(() => onEnter())
  }
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
})
</script>

<style scoped>
@import url("https://fontsapi.zeoseven.com/521/main/result.css");

.mock-terminal {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.75);
  padding: 14px 16px;
  font-family: 'JetBrains Maple Mono', monospace;
  font-size: clamp(2px, 0.8vw, 10px);
  color: #e0d8d0;
  overflow: hidden;
  cursor: text;
}

.output {
  min-height: 0;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.output::-webkit-scrollbar {
  width: 3px;
}

.output::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.line {
  white-space: pre-wrap;
}

.input-row {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.prompt {
  white-space: pre;
  flex-shrink: 0;
}

.cmd-text {
  white-space: pre;
  color: #e0d8d0;
}

.cursor-wrap {
  position: relative;
  display: inline;
}

.cursor {
  position: absolute;
  left: 0;
  height: clamp(2px, 0.8vw, 10px);
  width: clamp(1px, 0.4vw, 5px);
  background: rgba(220, 200, 180, 0.85);
  transform: translateY(-50%);
  animation: cursor-blink 0.8s step-end infinite;
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

.cmd-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  caret-color: transparent;
  font: inherit;
  color: transparent;
  background: transparent;
  border: none;
  outline: none;
}
</style>
