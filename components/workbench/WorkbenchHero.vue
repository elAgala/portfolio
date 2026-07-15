<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{
  person: Profile
}>()
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
        <span>GUI · TTY</span>
      </header>
      <div class="system-window__viewport">
        <div class="kernel-placeholder" aria-hidden="true">
          <div class="kernel-placeholder__layer kernel-placeholder__layer--interface"><span>interface</span></div>
          <div class="kernel-placeholder__layer kernel-placeholder__layer--services"><span>services</span></div>
          <div class="kernel-placeholder__layer kernel-placeholder__layer--platform"><span>platform</span></div>
          <i class="kernel-placeholder__core" />
        </div>
        <div class="system-window__console" aria-hidden="true">
          <p><span>$</span> inspect --stack</p>
          <p><b>interface</b> vue / nuxt / typescript</p>
          <p><b>services</b> go / node / c#</p>
          <p><b>platform</b> linux / docker / ansible</p>
        </div>
      </div>
      <footer class="system-window__status">
        <span><i /> system ready</span>
        <span>three.js module pending</span>
      </footer>
    </div>
  </section>
</template>
