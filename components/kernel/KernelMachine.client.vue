<script setup lang="ts">
import type { KernelMachineRuntime } from './runtime/kernel-machine'
import type { KernelQuality } from '~/types/workbench'
import { chooseKernelQuality, clampKernelPointer } from '~/utils/workbench'

const props = defineProps<{
  exploded: boolean
}>()

const emit = defineEmits<{
  ready: [quality: KernelQuality]
  fallback: []
}>()

const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const quality = ref<KernelQuality>('fallback')
const isFallback = ref(false)

let runtime: KernelMachineRuntime | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let animationFrame = 0
let isVisible = true
let startedAt = 0

function webglAvailable() {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  }
  catch {
    return false
  }
}

function renderFrame(timestamp: number) {
  if (!startedAt)
    startedAt = timestamp
  if (runtime && isVisible && !document.hidden)
    runtime.render((timestamp - startedAt) / 1000)
  animationFrame = requestAnimationFrame(renderFrame)
}

function updatePointer(event: PointerEvent) {
  if (!host.value || !runtime)
    return
  const bounds = host.value.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
  const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
  runtime.setPointer(clampKernelPointer(x), clampKernelPointer(y))
}

function resetPointer() {
  runtime?.setPointer(0, 0)
}

watch(() => props.exploded, exploded => runtime?.setExploded(exploded))

onMounted(async () => {
  if (!canvas.value || !host.value)
    return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  quality.value = chooseKernelQuality({
    reducedMotion,
    webglAvailable: webglAvailable(),
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
  })

  if (quality.value === 'fallback') {
    isFallback.value = true
    emit('fallback')
    return
  }

  try {
    const { createKernelMachine } = await import('./runtime/kernel-machine')
    if (!canvas.value || !host.value)
      return
    runtime = createKernelMachine(canvas.value, quality.value)
    runtime.setExploded(props.exploded)
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
  catch {
    runtime?.dispose()
    runtime = undefined
    isFallback.value = true
    emit('fallback')
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
    class="kernel-machine"
    :class="{ 'kernel-machine--fallback': isFallback, 'kernel-machine--exploded': exploded }"
    @pointermove="updatePointer"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvas" aria-hidden="true" />
    <div v-if="isFallback" class="kernel-machine__fallback" aria-hidden="true">
      <img src="/images/kernel-machine-poster.webp" alt="">
    </div>

    <div class="kernel-machine__labels" aria-hidden="true">
      <span class="kernel-machine__label kernel-machine__label--interface"><i />01 / interface</span>
      <span class="kernel-machine__label kernel-machine__label--services"><i />02 / services</span>
      <span class="kernel-machine__label kernel-machine__label--platform"><i />03 / platform</span>
    </div>
    <p class="kernel-machine__hint">move cursor to orbit · inspect to separate</p>
  </div>
</template>
