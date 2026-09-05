<script setup lang="ts">
import { normalizeWaveform, type MusicState } from '~/utils/music'
import { getWaveformWindow, traceWaveformEdge } from '~/utils/waveform'

const props = defineProps<{ music: MusicState }>()
const canvas = ref<HTMLCanvasElement>()
const samples = shallowRef<number[] | null>(null)
const foreground = ref(true)
const reducedMotion = ref(false)
const visible = computed(
  () =>
    !!samples.value &&
    props.music.duration > 0 &&
    foreground.value &&
    props.music.playing &&
    props.music.confirmedPlaying &&
    props.music.status === 'playing',
)
const cache = new Map<string, number[]>()
let request: AbortController | undefined
let resize: ResizeObserver | undefined
let removeListeners = () => {}
let waveformTint: CanvasGradient | undefined
let frame = 0
let lastPaint = 0
let positionAt = 0
let alive = false

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

function paint(interpolate = false) {
  const surface = canvas.value
  const context = surface?.getContext('2d')
  const points = samples.value
  if (!surface || !context || !points || !waveformTint) return
  // Bound extrapolation so a stalled player never produces a fictitious advance.
  const elapsed = interpolate
    ? Math.min(1000, Math.max(0, performance.now() - positionAt))
    : 0
  const window = getWaveformWindow(
    props.music.position + elapsed,
    props.music.duration,
    points.length,
    surface.width,
  )
  context.clearRect(0, 0, surface.width, surface.height)
  if (!window) return
  const { offset, spacing } = window
  // Keep neighboring controls outside the viewport so curves enter smoothly.
  const first = Math.max(0, window.first - 1)
  const last = Math.min(points.length - 1, window.last + 1)
  const mid = surface.height / 2
  // Render only the real samples around playback, without looping track edges.
  context.beginPath()
  context.moveTo(offset + first * spacing, mid)
  traceWaveformEdge(context, points, first, last, offset, spacing, mid, -mid * 0.85)
  traceWaveformEdge(context, points, last, first, offset, spacing, mid, mid * 0.85)
  context.closePath()
  context.fillStyle = waveformTint
  context.fill()
}

function tick(now: number) {
  frame = 0
  if (!alive || !visible.value || reducedMotion.value) return
  if (now - lastPaint >= 1000 / 30) {
    paint(true)
    lastPaint = now
  }
  frame = requestAnimationFrame(tick)
}

function updateAnimation() {
  stop()
  if (!alive || !visible.value) return
  paint()
  if (!reducedMotion.value) frame = requestAnimationFrame(tick)
}

function build() {
  const surface = canvas.value
  if (!alive || !surface || !samples.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = surface.getBoundingClientRect()
  surface.width = Math.max(1, Math.round(rect.width * dpr))
  surface.height = Math.max(1, Math.round(rect.height * dpr))
  const context = surface.getContext('2d')
  if (!context) return
  waveformTint = context.createLinearGradient(0, 0, surface.width, 0)
  waveformTint.addColorStop(0, '#c09a5f')
  waveformTint.addColorStop(0.5, '#8aa392')
  waveformTint.addColorStop(1, '#779eae')
  updateAnimation()
}

async function loadWaveform() {
  request?.abort()
  samples.value = null
  stop()
  const { waveformUrl, engaged } = props.music
  if (!alive || !engaged || !waveformUrl) return
  try {
    const url = new URL(waveformUrl)
    if (url.protocol !== 'https:' || url.hostname !== 'wave.sndcdn.com') return
    const cached = cache.get(waveformUrl)
    if (cached) {
      samples.value = cached
      build()
      return
    }
    const controller = new AbortController()
    request = controller
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(waveformUrl, { signal: controller.signal })
      if (!response.ok) return
      const normalized = normalizeWaveform(await response.json())
      if (
        !alive ||
        controller.signal.aborted ||
        request !== controller ||
        !normalized
      )
        return
      cache.set(waveformUrl, normalized)
      samples.value = normalized
      build()
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    // Decoration is optional: its failure must never affect playback.
  }
}

watch(
  [() => props.music.trackIndex, () => props.music.waveformUrl, () => props.music.engaged],
  loadWaveform,
)
watch(
  () => props.music.position,
  (position, previous) => {
    positionAt = performance.now()
    if (
      reducedMotion.value &&
      Math.abs(position - previous) > 1500 &&
      visible.value
    )
      paint()
  },
)
watch([visible, reducedMotion], updateAnimation)
onMounted(() => {
  alive = true
  positionAt = performance.now()
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onMotion = () => {
    reducedMotion.value = media.matches
  }
  const onVisibility = () => {
    foreground.value = !document.hidden
  }
  onMotion()
  onVisibility()
  media.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', onVisibility)
  resize = new ResizeObserver(build)
  if (canvas.value) resize.observe(canvas.value)
  removeListeners = () => {
    media.removeEventListener('change', onMotion)
    document.removeEventListener('visibilitychange', onVisibility)
  }
  void loadWaveform()
})
onBeforeUnmount(() => {
  alive = false
  stop()
  request?.abort()
  resize?.disconnect()
  removeListeners()
  cache.clear()
})
</script>

<template>
  <div
    class="soundcloud-backdrop"
    :class="{ 'soundcloud-backdrop--visible': visible }"
    aria-hidden="true"
  >
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.soundcloud-backdrop {
  position: fixed;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 600ms var(--ease);
}
.soundcloud-backdrop--visible {
  opacity: 0.08;
}
canvas {
  position: absolute;
  top: 65%;
  left: -20px;
  width: calc(100% + 40px);
  height: min(30vh, 320px);
  transform: translateY(-50%);
  filter: blur(3px);
  mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
}
@media (max-width: 680px) {
  .soundcloud-backdrop--visible {
    opacity: 0.06;
  }
}
@media (prefers-reduced-motion: reduce) {
  .soundcloud-backdrop {
    transition-duration: 200ms;
  }
}
@media print {
  .soundcloud-backdrop {
    display: none;
  }
}
</style>
