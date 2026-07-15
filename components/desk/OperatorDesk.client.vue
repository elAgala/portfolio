<script setup lang="ts">
import type { OperatorDeskRuntime } from './runtime/operator-desk'
import { careerEntries } from '~/data/career'
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'
import type { HeroSceneQuality, OperatorTerminalFrame, OperatorTerminalLine, OperatorTerminalMode } from '~/types/workbench'
import { completeTerminalInput, runTerminalCommand, type TerminalContext } from '~/utils/terminal'
import { chooseHeroSceneQuality, clampHeroPointer } from '~/utils/workbench'

const props = defineProps<{
  openRequest: number
  closeRequest: number
}>()

const emit = defineEmits<{
  ready: [quality: HeroSceneQuality]
  fallback: []
  mode: [mode: OperatorTerminalMode]
}>()

const router = useRouter()
const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const quality = ref<HeroSceneQuality>('fallback')
const isFallback = ref(false)
const mode = ref<OperatorTerminalMode>('idle')
const input = ref('')
const cursorVisible = ref(true)
const booting = ref(false)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const lines = ref<OperatorTerminalLine[]>([
  { id: 1, kind: 'system', text: 'JULIAN BENITEZ / OPERATOR WORKBENCH TTY' },
  { id: 2, kind: 'output', text: 'Session ready. Type `help` or press Tab.' },
])

const context: TerminalContext = {
  name: profile.name,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  github: 'https://github.com/elAgala',
  projects: projects.map(project => ({
    slug: project.slug,
    title: project.title,
    path: project.path,
    repository: project.repository,
  })),
  experience: careerEntries.map(entry => ({
    dates: entry.dates,
    role: entry.role,
    company: entry.company,
    summary: entry.summary,
  })),
}

const bootLines: OperatorTerminalLine[] = [
  { id: -3, kind: 'system', text: 'OPERATOR WORKBENCH / SECURE TTY' },
  { id: -2, kind: 'output', text: '[ ok ] mounting portfolio index' },
  { id: -1, kind: 'output', text: '[ ok ] loading command registry' },
  { id: 0, kind: 'system', text: 'handoff: monitor control acquired' },
]

const terminalActive = computed(() => mode.value !== 'idle')

let runtime: OperatorDeskRuntime | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let animationFrame = 0
let cursorTimer: number | undefined
let isVisible = true
let startedAt = 0
let lineId = 2
let transitionStartedAt = 0
let transitionDuration = 0
let transitionStart = 0
let transitionEnd = 0
let transitionProgress = 0
let previousFocus: HTMLElement | null = null
const leaveResolvers: Array<() => void> = []

function webglAvailable() {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  }
  catch {
    return false
  }
}

function terminalFrame(): OperatorTerminalFrame {
  return {
    lines: booting.value ? bootLines : lines.value,
    input: input.value,
    prompt: 'julian@workbench:~$ ',
    cursorVisible: cursorVisible.value,
    booting: booting.value,
  }
}

function syncTerminalFrame() {
  runtime?.setTerminalFrame(terminalFrame())
}

function publishMode(nextMode: OperatorTerminalMode) {
  mode.value = nextMode
  runtime?.setMode(nextMode)
  emit('mode', nextMode)
}

function finishLeave() {
  transitionProgress = 0
  runtime?.setTransitionProgress(0)
  booting.value = false
  publishMode('idle')
  previousFocus?.focus()
  previousFocus = null
  leaveResolvers.splice(0).forEach(resolve => resolve())
}

function finishEntry() {
  transitionProgress = 1
  runtime?.setTransitionProgress(1)
  booting.value = false
  publishMode('terminal')
  syncTerminalFrame()
  nextTick(() => inputElement.value?.focus())
}

function beginTransition(target: 0 | 1) {
  transitionStartedAt = performance.now()
  transitionStart = transitionProgress
  transitionEnd = target
  const baseDuration = target === 1 ? 1000 : 800
  transitionDuration = Math.max(180, baseDuration * Math.abs(transitionEnd - transitionStart))
}

async function enterTerminal() {
  if (mode.value !== 'idle')
    return
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  booting.value = true

  if (isFallback.value) {
    booting.value = false
    transitionProgress = 1
    publishMode('terminal')
    await nextTick()
    inputElement.value?.focus()
    return
  }

  syncTerminalFrame()
  publishMode('entering')
  beginTransition(1)
}

function leaveTerminal() {
  if (mode.value === 'idle' || mode.value === 'leaving')
    return Promise.resolve()

  return new Promise<void>((resolve) => {
    leaveResolvers.push(resolve)
    if (isFallback.value) {
      finishLeave()
      return
    }
    publishMode('leaving')
    beginTransition(0)
  })
}

function renderFrame(timestamp: number) {
  if (!startedAt)
    startedAt = timestamp

  if (runtime && (isVisible || terminalActive.value) && !document.hidden) {
    if (mode.value === 'entering' || mode.value === 'leaving') {
      const elapsed = Math.min(1, (timestamp - transitionStartedAt) / transitionDuration)
      const eased = 1 - (1 - elapsed) ** 3
      transitionProgress = transitionStart + (transitionEnd - transitionStart) * eased
      runtime.setTransitionProgress(transitionProgress)
      if (elapsed >= 1) {
        if (transitionEnd === 1)
          finishEntry()
        else
          finishLeave()
      }
    }
    runtime.render((timestamp - startedAt) / 1000)
  }
  animationFrame = requestAnimationFrame(renderFrame)
}

function pointerCoordinates(event: PointerEvent) {
  if (!host.value)
    return { x: 0, y: 0 }
  const bounds = host.value.getBoundingClientRect()
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    y: -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
  }
}

function updatePointer(event: PointerEvent) {
  if (!runtime || mode.value !== 'idle')
    return
  const pointer = pointerCoordinates(event)
  runtime.setPointer(clampHeroPointer(pointer.x), clampHeroPointer(-pointer.y))
}

function onPointerDown(event: PointerEvent) {
  if (!runtime || mode.value !== 'terminal')
    return
  const pointer = pointerCoordinates(event)
  if (runtime.hitTestTerminalControl(pointer.x, pointer.y))
    void leaveTerminal()
  else
    inputElement.value?.focus()
}

function resetPointer() {
  runtime?.setPointer(0, 0)
}

function navigateHistory(direction: -1 | 1) {
  if (!history.value.length)
    return
  historyIndex.value = Math.min(history.value.length, Math.max(0, historyIndex.value + direction))
  input.value = historyIndex.value === history.value.length ? '' : history.value[historyIndex.value] ?? ''
  nextTick(() => inputElement.value?.setSelectionRange(input.value.length, input.value.length))
}

async function execute() {
  const command = input.value.trim()
  if (!command || mode.value !== 'terminal')
    return

  lines.value.push({ id: ++lineId, kind: 'command', text: command })
  if (history.value.at(-1) !== command)
    history.value.push(command)
  historyIndex.value = history.value.length
  input.value = ''

  const result = runTerminalCommand(command, context)
  result.output.forEach((text) => {
    const isError = text.includes('not found') || text.includes('missing target')
    lines.value.push({ id: ++lineId, kind: isError ? 'error' : 'output', text })
  })

  if (result.action?.type === 'clear') {
    lines.value = []
  }
  else if (result.action?.type === 'close') {
    await leaveTerminal()
  }
  else if (result.action?.type === 'navigate') {
    const target = result.action.target
    await leaveTerminal()
    await router.push(target)
  }
  else if (result.action?.type === 'external') {
    window.open(result.action.target, '_blank', 'noopener,noreferrer')
  }

  syncTerminalFrame()
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    void leaveTerminal()
  }
  else if (event.key === 'Tab') {
    event.preventDefault()
    input.value = completeTerminalInput(input.value || 'help', context)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigateHistory(-1)
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigateHistory(1)
  }
  else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
    event.preventDefault()
    lines.value = []
  }
}

watch(() => props.openRequest, (request, previousRequest) => {
  if (request !== previousRequest && request > 0)
    void enterTerminal()
})

watch(() => props.closeRequest, (request, previousRequest) => {
  if (request !== previousRequest && request > 0)
    void leaveTerminal()
})

watch([input, cursorVisible, lines], syncTerminalFrame, { deep: true })

onMounted(async () => {
  if (!canvas.value || !host.value)
    return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  quality.value = chooseHeroSceneQuality({
    reducedMotion,
    webglAvailable: webglAvailable(),
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
  })

  cursorTimer = window.setInterval(() => {
    if (mode.value === 'terminal')
      cursorVisible.value = !cursorVisible.value
  }, 520)

  if (quality.value === 'fallback') {
    isFallback.value = true
    emit('fallback')
    emit('ready', quality.value)
    return
  }

  try {
    const { createOperatorDesk } = await import('./runtime/operator-desk')
    if (!canvas.value || !host.value)
      return
    runtime = createOperatorDesk(canvas.value, quality.value)
    syncTerminalFrame()
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry)
        runtime?.resize(entry.contentRect.width, entry.contentRect.height)
    })
    resizeObserver.observe(host.value)
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
    }, { rootMargin: '120px' })
    intersectionObserver.observe(host.value)
    animationFrame = requestAnimationFrame(renderFrame)
    emit('ready', quality.value)
  }
  catch (error) {
    console.error('Operator desk scene failed to initialize.', error)
    runtime?.dispose()
    runtime = undefined
    isFallback.value = true
    emit('fallback')
    emit('ready', 'fallback')
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  if (cursorTimer)
    window.clearInterval(cursorTimer)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  runtime?.dispose()
  leaveResolvers.splice(0).forEach(resolve => resolve())
  emit('mode', 'idle')
})
</script>

<template>
  <div
    ref="host"
    class="operator-desk"
    :class="{
      'operator-desk--fallback': isFallback,
      'operator-desk--terminal': terminalActive,
    }"
    @pointermove="updatePointer"
    @pointerdown="onPointerDown"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvas" aria-hidden="true" />

    <div v-if="isFallback && !terminalActive" class="operator-desk__fallback" aria-hidden="true">
      <img src="/images/operator-desk-poster.webp" alt="">
    </div>

    <div v-if="isFallback && terminalActive" class="operator-terminal-fallback">
      <header>
        <span>julian@workbench: ~/portfolio</span>
        <button type="button" @click="leaveTerminal">Esc / leave</button>
      </header>
      <div class="operator-terminal-fallback__output">
        <p v-for="line in lines" :key="line.id" :class="`terminal-line--${line.kind}`">
          <span v-if="line.kind === 'command'" aria-hidden="true">$ </span>{{ line.text }}
        </p>
      </div>
      <form @submit.prevent="execute">
        <label for="operator-terminal-fallback-input">julian@workbench:~$</label>
        <input
          id="operator-terminal-fallback-input"
          ref="inputElement"
          v-model="input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown="onInputKeydown"
        >
      </form>
    </div>

    <form v-else class="operator-desk__capture" @submit.prevent="execute">
      <label for="operator-terminal-input">Terminal command</label>
      <input
        id="operator-terminal-input"
        ref="inputElement"
        v-model="input"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        :tabindex="mode === 'terminal' ? 0 : -1"
        @keydown="onInputKeydown"
      >
    </form>

    <div v-if="mode === 'idle' && !isFallback" class="operator-desk__labels" aria-hidden="true">
      <span class="operator-desk__label operator-desk__label--source"><i />01 / workstation</span>
      <span class="operator-desk__label operator-desk__label--services"><i />02 / service bay</span>
      <span class="operator-desk__label operator-desk__label--linux"><i />03 / linux host</span>
    </div>
    <p v-if="mode === 'idle' && !isFallback" class="operator-desk__hint">move cursor for perspective · enter terminal to take control</p>
    <div class="operator-desk__semantic-log sr-only" role="log" aria-live="polite" aria-relevant="additions text">
      <p v-for="line in lines" :key="`semantic-${line.id}`">{{ line.kind === 'command' ? `$ ${line.text}` : line.text }}</p>
    </div>
  </div>
</template>
