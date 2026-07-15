<script setup lang="ts">
import OperatorDesk from '~/components/desk/OperatorDesk.client.vue'
import type { Profile } from '~/types/portfolio'
import type { HeroSceneQuality, OperatorTerminalMode } from '~/types/workbench'

defineProps<{
  person: Profile
}>()

const { openRequest, closeRequest, mode, requestOpen, requestClose } = useOperatorTerminal()
const sceneFallback = ref(false)
const sceneStatus = ref('booting')
let previousBodyOverflow = ''

const transitionActive = computed(() => mode.value === 'entering' || mode.value === 'leaving')
const terminalActive = computed(() => mode.value !== 'idle')
const terminalButtonLabel = computed(() => {
  if (mode.value === 'entering')
    return 'acquiring terminal…'
  if (mode.value === 'terminal')
    return 'leave terminal'
  if (mode.value === 'leaving')
    return 'returning…'
  return sceneFallback.value ? 'open accessible terminal' : 'enter terminal'
})

function onSceneReady(quality: HeroSceneQuality) {
  sceneStatus.value = quality === 'fallback'
    ? 'accessible render · motion preference honored'
    : `${quality} render · terminal online`
}

function onSceneFallback() {
  sceneFallback.value = true
  sceneStatus.value = 'accessible render · motion preference honored'
}

function onMode(nextMode: OperatorTerminalMode) {
  mode.value = nextMode
}

function toggleTerminal() {
  if (mode.value === 'idle')
    requestOpen()
  else if (mode.value === 'terminal')
    requestClose()
}

watch(terminalActive, (active) => {
  if (!import.meta.client)
    return
  if (active) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = previousBodyOverflow
  }
})

onBeforeUnmount(() => {
  if (import.meta.client)
    document.body.style.overflow = previousBodyOverflow
  mode.value = 'idle'
})
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

    <div
      id="operator-desk"
      class="system-window"
      :class="{ 'system-window--terminal': terminalActive }"
      :aria-label="terminalActive ? 'Interactive portfolio terminal' : 'Interactive Three.js operator desk'"
    >
      <header class="system-window__bar">
        <div aria-hidden="true"><i /><i /><i /></div>
        <p>{{ terminalActive ? 'julian@workbench: ~/portfolio' : '~/julian/operator-desk' }}</p>
        <button
          type="button"
          :disabled="transitionActive"
          :aria-expanded="terminalActive"
          aria-controls="operator-terminal-input"
          @click="toggleTerminal"
        >
          {{ terminalButtonLabel }} <span aria-hidden="true">{{ terminalActive ? '×' : '↗' }}</span>
        </button>
      </header>
      <div class="system-window__viewport">
        <OperatorDesk
          :open-request="openRequest"
          :close-request="closeRequest"
          @ready="onSceneReady"
          @fallback="onSceneFallback"
          @mode="onMode"
        />
      </div>
      <footer class="system-window__status">
        <span><i /> {{ mode === 'terminal' ? 'tty attached' : transitionActive ? 'camera handoff' : 'scene ready' }}</span>
        <span>{{ mode === 'terminal' ? 'Tab complete · ↑↓ history · Esc leave' : sceneStatus }}</span>
      </footer>
    </div>
  </section>
</template>
