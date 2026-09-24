<script setup lang="ts">
import type { MusicState } from '~/utils/music'

const props = defineProps<{ music: MusicState }>()
const surface = ref<HTMLElement>()
const rotor = ref<HTMLElement>()
const label = ref<HTMLElement>()
const expanded = ref(false)
const source = ref('/portfolio/images/julian-benitez.webp')
const failed = ref(false)
const reduced = ref(false)
const audible = computed(() => props.music.playing && props.music.confirmedPlaying && props.music.status === 'playing')
let rotation: Animation | undefined
let scaling: Animation | undefined
let spinRamp = 0
let sequence = 0
let mode: 'portrait' | 'entering' | 'spinning' | 'holding' | 'exiting' = 'portrait'
let visible = true
let mounted = false
let dispose = () => {}

function portraitError(event: Event) {
  const image = event.target
  if (!(image instanceof HTMLImageElement)) return
  if (image.currentSrc.endsWith('/julian-benitez.webp'))
    source.value = '/portfolio/images/julian-benitez-fallback.jpg'
  else if (image.currentSrc.endsWith('/julian-benitez-fallback.jpg'))
    failed.value = true
}

function currentAngle() {
  if (!rotor.value) return 0
  const transform = getComputedStyle(rotor.value).transform
  if (transform === 'none') return 0
  const matrix = new DOMMatrixReadOnly(transform)
  return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
}

function currentScale() {
  if (!label.value) return 1
  const transform = getComputedStyle(label.value).transform
  if (transform === 'none') return 1
  const matrix = new DOMMatrixReadOnly(transform)
  return Math.hypot(matrix.a, matrix.b)
}

// Keep the presented angle and size when play or pause interrupts a gesture.
function freeze() {
  const angle = currentAngle()
  const scale = currentScale()
  cancelAnimationFrame(spinRamp)
  spinRamp = 0
  rotation?.cancel()
  scaling?.cancel()
  rotation = undefined
  scaling = undefined
  if (rotor.value) rotor.value.style.transform = `rotate(${angle}deg)`
  if (label.value) label.value.style.transform = `scale(${scale})`
  sequence++
  return { angle, scale, token: sequence }
}

async function turn(from: number, to: number, duration: number, easing: string, token: number) {
  if (!rotor.value) return false
  const animation = rotor.value.animate(
    [{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }],
    { duration, easing, fill: 'forwards' },
  )
  rotation = animation
  try { await animation.finished } catch { return false }
  if (token !== sequence) return false
  rotor.value.style.transform = `rotate(${to}deg)`
  animation.cancel()
  rotation = undefined
  return true
}

async function resize(from: number, to: number, duration: number, token: number) {
  if (!label.value) return false
  const animation = label.value.animate(
    [{ transform: `scale(${from})` }, { transform: `scale(${to})` }],
    { duration, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' },
  )
  scaling = animation
  try { await animation.finished } catch { return false }
  if (token !== sequence) return false
  label.value.style.transform = `scale(${to})`
  animation.cancel()
  scaling = undefined
  return true
}

function spin(from: number) {
  if (!rotor.value) return
  mode = 'spinning'
  const animation = rotor.value.animate(
    [{ transform: `rotate(${from}deg)` }, { transform: `rotate(${from + 360}deg)` }],
    { duration: 12000, iterations: Infinity, easing: 'linear' },
  )
  rotation = animation
  animation.updatePlaybackRate(0)
  const started = performance.now()
  const accelerate = (now: number) => {
    if (rotation !== animation) return
    const progress = Math.min(1, (now - started) / 600)
    animation.updatePlaybackRate(progress * progress * (3 - 2 * progress))
    if (progress < 1) spinRamp = requestAnimationFrame(accelerate)
    else spinRamp = 0
  }
  spinRamp = requestAnimationFrame(accelerate)
}

async function enter() {
  const { angle, scale, token } = freeze()
  mode = 'entering'
  expanded.value = true
  if (await resize(scale, .56, 280, token)) spin(angle)
}

async function hold() {
  const { angle, token } = freeze()
  mode = 'holding'
  await turn(angle, angle + 12, 240, 'cubic-bezier(.16, 1, .3, 1)', token)
}

async function exitVinyl() {
  const { angle, scale, token } = freeze()
  mode = 'exiting'
  const clockwise = ((angle % 360) + 360) % 360
  let advance = 360 - clockwise
  if (advance < 120) advance += 360
  if (!await turn(angle, angle + advance, 350, 'cubic-bezier(.2, .7, .2, 1)', token)) return
  if (!await resize(scale, 1, 320, token)) return
  expanded.value = false
  mode = 'portrait'
}

function sync() {
  if (!mounted) return
  const active = audible.value && !failed.value
  const loading = props.music.status === 'loading' && expanded.value
  if (reduced.value || !visible || document.hidden || failed.value) {
    freeze()
    expanded.value = active || loading
    if (rotor.value && reduced.value) rotor.value.style.transform = 'rotate(0deg)'
    if (label.value) label.value.style.transform = active || loading ? 'scale(.56)' : 'scale(1)'
    mode = active || loading ? 'holding' : 'portrait'
    return
  }
  if (active) {
    if (mode === 'spinning' || mode === 'entering') return
    if (mode === 'holding') {
      const { angle } = freeze()
      expanded.value = true
      spin(angle)
    }
    else void enter()
  }
  else if (loading) {
    if (mode !== 'holding') void hold()
  }
  else if (expanded.value && mode !== 'exiting') void exitVinyl()
}

watch([audible, () => props.music.status, failed], sync)
onMounted(() => {
  if (!rotor.value || !label.value || !surface.value) return
  mounted = true
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const updatePreference = () => { reduced.value = preference.matches; sync() }
  reduced.value = preference.matches
  preference.addEventListener('change', updatePreference)
  document.addEventListener('visibilitychange', sync)
  const observer = new IntersectionObserver(([entry]) => {
    const nextVisible = !!entry?.isIntersecting
    if (nextVisible !== visible) {
      visible = nextVisible
      sync()
    }
  })
  observer.observe(surface.value)
  dispose = () => {
    preference.removeEventListener('change', updatePreference)
    document.removeEventListener('visibilitychange', sync)
    observer.disconnect()
  }
  sync()
})
onBeforeUnmount(() => {
  mounted = false
  freeze()
  dispose()
})
</script>

<template>
  <figure ref="surface" class="hero-portrait-wrap vinyl-portrait" :class="{ 'vinyl-portrait--active': expanded, 'portrait-failed': failed }">
    <img class="hero-portrait" :src="source" alt="Portrait of Julián Benitez" width="640" height="640" fetchpriority="high" loading="eager" decoding="async" @error="portraitError">
    <div class="vinyl-portrait__disc" aria-hidden="true">
      <div ref="rotor" class="vinyl-portrait__rotor">
        <div ref="label" class="vinyl-portrait__label">
          <img :src="source" alt="" width="640" height="640" @error="portraitError">
        </div>
      </div>
      <div class="vinyl-portrait__reflection" />
    </div>
  </figure>
</template>

<style scoped>
.vinyl-portrait { isolation: isolate; }
.vinyl-portrait__disc {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  background: #111112;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 12%);
  transition: opacity 220ms ease;
}
.vinyl-portrait--active .vinyl-portrait__disc { opacity: 1; }
.vinyl-portrait__rotor {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: repeating-radial-gradient(circle at center, transparent 0 3px, rgb(255 255 255 / 5%) 3px 3.6px, transparent 3.6px 5px);
}
.vinyl-portrait__label {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform: scale(1);
}
.vinyl-portrait__label::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid rgb(255 255 255 / 13%);
}
.vinyl-portrait__label img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}
.vinyl-portrait__reflection {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 30deg, transparent 0deg, rgb(255 255 255 / 9%) 40deg, transparent 75deg 180deg, rgb(255 255 255 / 6%) 220deg, transparent 255deg);
  mask-image: radial-gradient(circle, transparent 0 30%, #000 32%);
}
@media (prefers-reduced-motion: reduce) {
  .vinyl-portrait__disc, .vinyl-portrait--active .vinyl-portrait__disc { transition-duration: 150ms; }
}
</style>
