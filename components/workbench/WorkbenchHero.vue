<script setup lang="ts">
import OperatorDesk from '~/components/desk/OperatorDesk.client.vue'
import type { Profile } from '~/types/portfolio'
import type { HeroSceneQuality, TracePhase } from '~/types/workbench'

defineProps<{
  person: Profile
}>()

const traceRun = ref(0)
const tracePhase = ref<TracePhase>('idle')
const traceHasRun = ref(false)
const traceIsActive = ref(false)
const sceneFallback = ref(false)
const sceneStatus = ref('booting')

const traceRunning = computed(() => traceIsActive.value)

const traceButtonLabel = computed(() => {
  if (traceRunning.value)
    return 'tracing…'
  if (sceneFallback.value)
    return traceHasRun.value ? 'show path again' : 'show delivery path'
  return traceHasRun.value ? 'replay trace' : 'trace delivery'
})

const traceConsole = computed(() => {
  const lines: Record<TracePhase, Array<{ label: string, value: string }>> = {
    idle: [
      { label: 'source', value: 'vue / nuxt / typescript' },
      { label: 'route', value: 'go / node / c#' },
      { label: 'target', value: 'linux / docker / ansible' },
    ],
    source: [
      { label: 'source', value: 'product interface compiled' },
      { label: 'artifact', value: 'signed and ready' },
      { label: 'next', value: 'service gateway' },
    ],
    services: [
      { label: 'go', value: 'gateway ready' },
      { label: 'c#', value: 'api ready' },
      { label: 'node', value: 'worker ready' },
    ],
    linux: [
      { label: 'deploy', value: 'ansible applying state' },
      { label: 'runtime', value: 'containers starting' },
      { label: 'target', value: 'linux host' },
    ],
    complete: [
      { label: 'release', value: 'healthy' },
      { label: 'host', value: 'operational' },
      { label: 'path', value: 'source → services → linux' },
    ],
  }
  return lines[tracePhase.value]
})

function startTrace() {
  traceIsActive.value = true
  tracePhase.value = 'source'
  traceRun.value += 1
}

function onSceneReady(quality: HeroSceneQuality) {
  sceneStatus.value = quality === 'fallback' ? 'static render · motion preference honored' : `${quality} render · 60 fps target`
}

function onSceneFallback() {
  sceneFallback.value = true
  sceneStatus.value = 'static render · motion preference honored'
}

function onTracePhase(phase: TracePhase) {
  tracePhase.value = phase
}

function onTraceComplete() {
  traceIsActive.value = false
  tracePhase.value = 'complete'
  traceHasRun.value = true
}
</script>

<template>
  <section id="top" class="workbench-hero" aria-labelledby="workbench-title">
    <div class="workbench-hero__identity">
      <div class="identity-lockup">
        <img :src="person.avatar" width="112" height="112" alt="Illustrated portrait of Julián Benitez">
        <div>
          <p class="system-label">julian@workbench:~</p>
          <p>{{ person.title }} · {{ person.location }}</p>
        </div>
      </div>

      <p class="workbench-eyebrow">Lead · Product · Backend · Platform</p>
      <h1 id="workbench-title">Built with intent.<br><em>Made to endure.</em></h1>
      <p class="workbench-hero__summary">{{ person.summary }}</p>
      <div class="workbench-actions">
        <a class="workbench-button workbench-button--primary" href="#experience">Review experience</a>
        <NuxtLink class="workbench-button" to="/resume">Open résumé <span aria-hidden="true">↗</span></NuxtLink>
      </div>

      <dl class="workbench-hero__facts">
        <div><dt>Status</dt><dd><i /> {{ person.availability }}</dd></div>
        <div><dt>Preferred environment</dt><dd>Linux · OSS · shipping</dd></div>
      </dl>
    </div>

    <div id="operator-desk" class="system-window" aria-label="Interactive source-to-Linux delivery scene">
      <header class="system-window__bar">
        <div aria-hidden="true"><i /><i /><i /></div>
        <p>~/julian/operator-desk</p>
        <button type="button" :disabled="traceRunning" @click="startTrace">
          {{ traceButtonLabel }} ↗
        </button>
      </header>
      <div class="system-window__viewport">
        <OperatorDesk
          :trace-run="traceRun"
          @ready="onSceneReady"
          @fallback="onSceneFallback"
          @phase="onTracePhase"
          @complete="onTraceComplete"
        />
        <div class="system-window__console" aria-live="polite" aria-atomic="true">
          <p><span>$</span> trace_delivery --{{ tracePhase === 'idle' ? 'ready' : tracePhase }}</p>
          <p v-for="line in traceConsole" :key="line.label"><b>{{ line.label }}</b> {{ line.value }}</p>
        </div>
      </div>
      <footer class="system-window__status">
        <span><i /> {{ traceRunning ? `tracing ${tracePhase}` : traceHasRun ? 'delivery verified' : 'scene ready' }}</span>
        <span>{{ sceneStatus }}</span>
      </footer>
    </div>
  </section>
</template>
