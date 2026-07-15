<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { estateAssets, experienceChapters } from '~/data/experience'
import type { EvidenceGraphId, ExperienceChapter, ExperienceLoadPhase, ExperienceQuality, ExperienceStage } from '~/types/experience'
import { chooseExperienceQuality, interpolateExperienceStage, shouldRunExperienceIntro } from '~/utils/experience'
import ExperienceHud from './ExperienceHud.vue'
import ExperienceLoader from './ExperienceLoader.vue'
import { EstateAudio } from './runtime/audio'
import { CinematicCameraRig } from './runtime/camera'
import { loadEstateAssets } from './runtime/loader'
import { EstateRenderer } from './runtime/renderer'
import { EstateWorld } from './runtime/world'

const emit = defineEmits<{
  ready: []
  progress: [number]
  chapterChange: [ExperienceChapter]
  tier: [ExperienceQuality]
  graphProgress: [Record<EvidenceGraphId, number>, EvidenceGraphId | null]
  fallback: [string]
}>()

const isDev = import.meta.dev

const canvas = ref<HTMLCanvasElement | null>(null)
const coldOpen = ref<HTMLElement | null>(null)
const ready = ref(false)
const fallback = ref(false)
const introActive = ref(false)
const soundEnabled = ref(false)
const chapter = ref<ExperienceChapter>('hero')
const quality = ref<ExperienceQuality>('fallback')
const loadPhase = ref<ExperienceLoadPhase>('idle')
const loadProgress = ref(0)
const progress = ref(0)
const graphProgress = ref<Record<EvidenceGraphId, number>>({ 'agala-ui': 0, 'agala-deploy': 0, 'agala-ai': 0 })
const activeGraph = ref<EvidenceGraphId | null>(null)
const debugStats = ref({ fps: 0, calls: 0, triangles: 0, graph: 'room' })

const chapterLabel = computed(() => experienceChapters.find(item => item.id === chapter.value)?.label ?? 'The study')

let renderer: EstateRenderer | undefined
let world: EstateWorld | undefined
let cameraRig: CinematicCameraRig | undefined
let scrollTrigger: ScrollTrigger | undefined
let resizeObserver: ResizeObserver | undefined
let introTimer: number | undefined
let loadingTimeout: number | undefined
let introStartedAt = 0
let introReveal = 1
const pointer = new THREE.Vector2()
let pageVisible = true
let clock: THREE.Clock | undefined
let audio: EstateAudio | undefined
let frameCount = 0
let frameWindowStarted = 0

function detectWebGLCapability() {
  try {
    const testCanvas = document.createElement('canvas')
    const context = testCanvas.getContext('webgl2')
    if (!context)
      return { available: false, softwareRenderer: false }
    const rendererInfo = context.getExtension('WEBGL_debug_renderer_info')
    const rendererName = rendererInfo
      ? String(context.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL))
      : ''
    return {
      available: true,
      softwareRenderer: /swiftshader|llvmpipe|software/i.test(rendererName),
    }
  }
  catch {
    return { available: false, softwareRenderer: false }
  }
}

function collectStages() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-experience-x][data-experience-chapter]')).map((element): ExperienceStage => {
    const bounds = element.getBoundingClientRect()
    return {
      cameraX: Number(element.dataset.experienceX ?? 0),
      chapter: element.dataset.experienceChapter as ExperienceChapter,
      center: bounds.top + window.scrollY + bounds.height / 2,
    }
  })
}

function updateScrollPosition() {
  const viewportCenter = window.scrollY + window.innerHeight / 2
  const state = interpolateExperienceStage(collectStages(), viewportCenter)
  if (chapter.value !== state.chapter) {
    chapter.value = state.chapter
    emit('chapterChange', state.chapter)
  }
  progress.value = state.progress
  const nextGraphProgress = { ...graphProgress.value }
  let nextActiveGraph: EvidenceGraphId | null = null
  document.querySelectorAll<HTMLElement>('.project-evidence[data-experience-chapter]').forEach((element) => {
    const bounds = element.getBoundingClientRect()
    const top = bounds.top + window.scrollY
    const local = Math.min(1, Math.max(0, (viewportCenter - top) / bounds.height))
    const id = element.dataset.experienceChapter as EvidenceGraphId
    nextGraphProgress[id] = local
    if (viewportCenter >= top && viewportCenter <= top + bounds.height)
      nextActiveGraph = id
  })
  graphProgress.value = nextGraphProgress
  activeGraph.value = nextActiveGraph
  emit('progress', state.progress)
  emit('graphProgress', nextGraphProgress, nextActiveGraph)
  document.documentElement.style.setProperty('--experience-progress', state.progress.toFixed(4))
}

function handlePointer(event: PointerEvent) {
  if (quality.value !== 'high')
    return
  pointer.set(
    (event.clientX / window.innerWidth - 0.5) * 2,
    (event.clientY / window.innerHeight - 0.5) * -2,
  )
}

function handleVisibility() {
  pageVisible = document.visibilityState === 'visible'
  if (pageVisible)
    clock?.start()
  else
    clock?.stop()
}

function resize() {
  if (!renderer || quality.value === 'fallback')
    return
  renderer.resize(window.innerWidth, window.innerHeight, quality.value)
  updateScrollPosition()
  scrollTrigger?.refresh()
}

function render() {
  if (!renderer || !world || !cameraRig || !clock || !pageVisible)
    return
  const delta = Math.min(clock.getDelta(), 0.25)
  const elapsed = clock.elapsedTime
  if (introActive.value)
    introReveal = Math.min(1, (performance.now() - introStartedAt) / 2850)
  else
    introReveal = 1

  cameraRig.update(progress.value, introReveal, pointer, delta)
  world.update(progress.value, elapsed, introReveal, activeGraph.value, graphProgress.value)
  renderer.render()

  if (import.meta.dev) {
    frameCount += 1
    if (elapsed - frameWindowStarted >= 1) {
      const stats = renderer.stats()
      const graph = world.graphStats()
      debugStats.value = {
        fps: frameCount,
        calls: stats.calls,
        triangles: stats.triangles,
        graph: graph ? `${graph.id} · ${graph.activeInstances} nodes · ${graph.updateMs.toFixed(2)} ms` : 'room',
      }
      frameCount = 0
      frameWindowStarted = elapsed
    }
  }
}

function completeIntro() {
  if (!introActive.value)
    return
  if (introTimer)
    window.clearTimeout(introTimer)
  sessionStorage.setItem('jb-intro-seen', 'true')
  document.body.classList.remove('intro-active')
  introReveal = 1
  if (coldOpen.value) {
    gsap.to(coldOpen.value, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => { introActive.value = false },
    })
  }
  else {
    introActive.value = false
  }
}

function startIntro(force = false) {
  if (!ready.value || quality.value === 'fallback')
    return
  const shouldRun = shouldRunExperienceIntro({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasSeenIntro: sessionStorage.getItem('jb-intro-seen') === 'true',
    hash: window.location.hash,
    force,
  })
  if (!shouldRun) {
    introReveal = 1
    return
  }
  introReveal = 0
  introStartedAt = performance.now()
  introActive.value = true
  document.body.classList.add('intro-active')
  nextTick(() => {
    if (coldOpen.value)
      gsap.fromTo(coldOpen.value, { opacity: 0 }, { opacity: 1, duration: 0.2 })
  })
  introTimer = window.setTimeout(completeIntro, 3100)
}

function replayIntro() {
  startIntro(true)
}

async function toggleSound() {
  audio ??= new EstateAudio()
  if (soundEnabled.value) {
    audio.disable()
    soundEnabled.value = false
  }
  else {
    await audio.enable()
    soundEnabled.value = true
  }
}

function enterFallback(reason: string) {
  fallback.value = true
  ready.value = false
  loadPhase.value = 'fallback'
  quality.value = 'fallback'
  emit('tier', 'fallback')
  renderer?.setAnimationLoop(null)
  document.body.classList.remove('experience-ready')
  document.body.classList.add('experience-fallback')
  emit('fallback', reason)
}

function handleContextLoss(event: Event) {
  event.preventDefault()
  enterFallback('WebGL context lost')
}

async function initExperience() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const webgl = detectWebGLCapability()
  const selectedQuality = chooseExperienceQuality({
    reducedMotion,
    webglAvailable: webgl.available,
    softwareRenderer: webgl.softwareRenderer,
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
  })
  const forcedQuality = isDev ? new URLSearchParams(window.location.search).get('quality') : null
  quality.value = forcedQuality === 'high' || forcedQuality === 'balanced' ? forcedQuality : selectedQuality
  emit('tier', quality.value)
  if (quality.value === 'fallback' || !canvas.value) {
    enterFallback(reducedMotion ? 'Reduced motion' : 'WebGL unavailable')
    return
  }

  try {
    renderer = new EstateRenderer(canvas.value, quality.value)
    world = new EstateWorld(renderer.scene, quality.value)
    cameraRig = new CinematicCameraRig(renderer.camera, quality.value)
    clock = new THREE.Clock()
    gsap.registerPlugin(ScrollTrigger)
    scrollTrigger = ScrollTrigger.create({
      trigger: '.portfolio-page',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: updateScrollPosition,
      onRefresh: updateScrollPosition,
    })
    resizeObserver = new ResizeObserver(updateScrollPosition)
    const page = document.querySelector('.portfolio-page')
    if (page)
      resizeObserver.observe(page)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateScrollPosition, { passive: true })
    window.addEventListener('pointermove', handlePointer, { passive: true })
    document.addEventListener('visibilitychange', handleVisibility)
    canvas.value.addEventListener('webglcontextlost', handleContextLoss)
    renderer.setAnimationLoop(render)
    resize()
    loadPhase.value = 'core'
    loadingTimeout = window.setTimeout(() => document.body.classList.add('experience-content-ready'), 1500)

    const manifest = estateAssets[quality.value]
    const result = await loadEstateAssets(manifest, {
      onProgress: (value) => { loadProgress.value = value },
      onCore: (gltf) => {
        world?.attachCore(gltf)
        ready.value = true
        loadPhase.value = 'detail'
        document.body.classList.add('experience-ready', 'experience-content-ready')
        document.body.classList.remove('experience-fallback')
        emit('ready')
        startIntro()
      },
      onDetail: (gltf) => {
        world?.attachDetail(gltf)
        loadPhase.value = 'ready'
      },
    })
    result.detailPromise.catch(() => {
      loadPhase.value = 'ready'
    })
  }
  catch (error) {
    enterFallback(error instanceof Error ? error.message : 'Estate failed to load')
  }
}

onMounted(() => {
  window.addEventListener('jb-replay-intro', replayIntro)
  window.setTimeout(initExperience, 50)
})

onBeforeUnmount(() => {
  if (introTimer)
    window.clearTimeout(introTimer)
  if (loadingTimeout)
    window.clearTimeout(loadingTimeout)
  scrollTrigger?.kill()
  resizeObserver?.disconnect()
  renderer?.setAnimationLoop(null)
  world?.dispose()
  renderer?.dispose()
  audio?.dispose()
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', updateScrollPosition)
  window.removeEventListener('pointermove', handlePointer)
  window.removeEventListener('jb-replay-intro', replayIntro)
  document.removeEventListener('visibilitychange', handleVisibility)
  canvas.value?.removeEventListener('webglcontextlost', handleContextLoss)
  document.body.classList.remove('experience-ready', 'experience-fallback', 'experience-content-ready', 'intro-active')
  document.documentElement.style.removeProperty('--experience-progress')
})
</script>

<template>
  <div class="experience-layer estate-layer" :class="`experience-layer--${quality}`" aria-hidden="true">
    <canvas ref="canvas" class="experience-canvas" />
    <div class="experience-fallback-art estate-fallback-art">
      <span class="estate-fallback-art__door estate-fallback-art__door--left" />
      <span class="estate-fallback-art__door estate-fallback-art__door--right" />
      <span class="experience-fallback-art__seal">JB</span>
      <span class="experience-fallback-art__beam" />
    </div>
    <div class="experience-vignette" />
    <div class="experience-grain" />
  </div>

  <ExperienceLoader :progress="loadProgress" :ready="ready" :fallback="fallback" />
  <ExperienceHud v-if="ready" :chapter-label="chapterLabel" :progress="progress" :sound-enabled="soundEnabled" @toggle-sound="toggleSound" />
  <div v-if="isDev && ready" class="estate-debug" aria-hidden="true">
    {{ quality }} · {{ debugStats.fps }} fps · {{ debugStats.calls }} calls · {{ debugStats.triangles }} tris · {{ debugStats.graph }}
  </div>

  <Teleport to="body">
    <section v-if="introActive" ref="coldOpen" class="cold-open cold-open--estate" tabindex="-1" aria-label="Cinematic introduction">
      <div class="cold-open__copy">
        <p>An audience with the work.</p>
        <h2>The doors<br><em>are open.</em></h2>
        <span>Julián Benitez · Software engineer</span>
      </div>
      <p class="cold-open__instruction">Enter the study.</p>
      <button type="button" @click="completeIntro">Skip introduction <span aria-hidden="true">↗</span></button>
      <div class="cold-open__progress" aria-hidden="true" />
    </section>
  </Teleport>
</template>
