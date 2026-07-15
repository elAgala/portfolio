<script setup lang="ts">
import KernelMachine from '~/components/kernel/KernelMachine.client.vue'
import type { Profile } from '~/types/portfolio'
import type { KernelQuality } from '~/types/workbench'

defineProps<{
  person: Profile
}>()

const inspected = ref(false)
const kernelStatus = ref('booting')

function onKernelReady(quality: KernelQuality) {
  kernelStatus.value = `${quality} render · 60 fps target`
}

function onKernelFallback() {
  kernelStatus.value = 'static render · motion preference honored'
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

      <p class="workbench-eyebrow">Product · Backend · Platform</p>
      <h1 id="workbench-title">Built with intent.<br><em>Made to endure.</em></h1>
      <p class="workbench-hero__summary">{{ person.summary }}</p>
      <div class="workbench-actions">
        <a class="workbench-button workbench-button--primary" href="#work">Inspect the work</a>
        <NuxtLink class="workbench-button" to="/resume">Open résumé <span aria-hidden="true">↗</span></NuxtLink>
      </div>

      <dl class="workbench-hero__facts">
        <div><dt>Status</dt><dd><i /> {{ person.availability }}</dd></div>
        <div><dt>Preferred environment</dt><dd>Linux · OSS · shipping</dd></div>
      </dl>
    </div>

    <div class="system-window" aria-label="Interactive system viewer preview">
      <header class="system-window__bar">
        <div aria-hidden="true"><i /><i /><i /></div>
        <p>~/julian/system-viewer</p>
        <button type="button" :aria-pressed="inspected" @click="inspected = !inspected">
          {{ inspected ? 'assemble' : 'inspect' }} ↗
        </button>
      </header>
      <div class="system-window__viewport">
        <KernelMachine :exploded="inspected" @ready="onKernelReady" @fallback="onKernelFallback" />
        <div class="system-window__console" aria-hidden="true">
          <p><span>$</span> kernel {{ inspected ? '--explode --verbose' : '--status' }}</p>
          <p><b>interface</b> vue / nuxt / typescript</p>
          <p><b>services</b> go / node / c#</p>
          <p><b>platform</b> linux / docker / ansible</p>
        </div>
      </div>
      <footer class="system-window__status">
        <span><i /> system ready</span>
        <span>{{ kernelStatus }}</span>
      </footer>
    </div>
  </section>
</template>
