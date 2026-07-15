<script setup lang="ts">
import type { OperatorDeskRuntime } from './runtime/operator-desk'
import type { HeroSceneQuality, TracePhase } from '~/types/workbench'
import { chooseHeroSceneQuality, clampHeroPointer, getTracePhase } from '~/utils/workbench'

const props = defineProps<{
  traceRun: number
}>()

const emit = defineEmits<{
  ready: [quality: HeroSceneQuality]
  fallback: []
  phase: [phase: TracePhase]
  complete: []
}>()

const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const quality = ref<HeroSceneQuality>('fallback')
const isFallback = ref(false)
const staticPathVisible = ref(false)

let runtime: OperatorDeskRuntime | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let animationFrame = 0
let isVisible = true
let startedAt = 0
let previousFrame = 0
let traceElapsed = 0
let traceActive = false
let currentPhase: TracePhase = 'idle'

const traceDuration = 11_000

function webglAvailable() {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  }
  catch {
    return false
  }
}

function publishPhase(phase: TracePhase) {
  if (phase === currentPhase)
    return
  currentPhase = phase
  runtime?.setTracePhase(phase)
  emit('phase', phase)
}

function startTrace() {
  if (isFallback.value) {
    staticPathVisible.value = true
    publishPhase('complete')
    emit('complete')
    return
  }
  traceElapsed = 0
  traceActive = true
  runtime?.setTraceProgress(0)
  publishPhase('source')
}

function renderFrame(timestamp: number) {
  if (!startedAt)
    startedAt = timestamp
  if (!previousFrame)
    previousFrame = timestamp
  const delta = Math.min(50, timestamp - previousFrame)
  previousFrame = timestamp

  if (runtime && isVisible && !document.hidden) {
    if (traceActive) {
      traceElapsed += delta
      const progress = Math.min(1, traceElapsed / traceDuration)
      runtime.setTraceProgress(progress)
      publishPhase(getTracePhase(progress))
      if (progress >= 1) {
        traceActive = false
        runtime.setTraceProgress(null)
        emit('complete')
      }
    }
    runtime.render((timestamp - startedAt) / 1000)
  }
  animationFrame = requestAnimationFrame(renderFrame)
}

function updatePointer(event: PointerEvent) {
  if (!host.value || !runtime)
    return
  const bounds = host.value.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
  const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
  runtime.setPointer(clampHeroPointer(x), clampHeroPointer(y))
}

function resetPointer() {
  runtime?.setPointer(0, 0)
}

watch(() => props.traceRun, (run, previousRun) => {
  if (run !== previousRun && run > 0)
    startTrace()
})

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
    runtime.setTracePhase('idle')
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry)
        runtime?.resize(entry.contentRect.width, entry.contentRect.height)
    })
    resizeObserver.observe(host.value)
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
      previousFrame = performance.now()
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
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  runtime?.dispose()
})
</script>

<template>
  <div
    ref="host"
    class="operator-desk"
    :class="{ 'operator-desk--fallback': isFallback, 'operator-desk--path-visible': staticPathVisible }"
    @pointermove="updatePointer"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvas" aria-hidden="true" />
    <div v-if="isFallback" class="operator-desk__fallback" aria-hidden="true">
      <img src="/images/operator-desk-poster.webp" alt="">
    </div>

    <div class="operator-desk__labels" aria-hidden="true">
      <span class="operator-desk__label operator-desk__label--source"><i />01 / workstation</span>
      <span class="operator-desk__label operator-desk__label--services"><i />02 / service bay</span>
      <span class="operator-desk__label operator-desk__label--linux"><i />03 / linux host</span>
    </div>
    <div v-if="staticPathVisible" class="operator-desk__static-path" aria-hidden="true">
      <span>source</span><i /><span>services</span><i /><span>linux</span>
    </div>
    <p class="operator-desk__hint">move cursor for perspective · trace delivery to follow the system</p>
  </div>
</template>
