<script setup lang="ts">
import type { CareerEntry } from '~/types/portfolio'

defineProps<{
  entries: CareerEntry[]
}>()
</script>

<template>
  <section id="experience" class="workbench-experience" aria-labelledby="experience-heading">
    <header class="workbench-experience__heading">
      <p class="workbench-eyebrow">01 · Experience</p>
      <h2 id="experience-heading">Hands on the system.<br>Eyes on the team.</h2>
      <p>Leadership without leaving the work behind—from product architecture and frontend standards to interviews, services, and delivery.</p>
    </header>

    <ol class="experience-ledger">
      <li v-for="(entry, index) in entries" :key="`${entry.company}-${entry.dates}`" class="experience-ledger__entry">
        <div class="experience-ledger__index" aria-hidden="true">0{{ index + 1 }}</div>
        <time>{{ entry.dates }}</time>
        <div class="experience-ledger__identity">
          <p>{{ entry.company }}</p>
          <h3>{{ entry.role }}</h3>
          <span>{{ entry.location }}</span>
        </div>
        <div class="experience-ledger__evidence">
          <p>{{ entry.summary }}</p>
          <ul>
            <li v-for="bullet in entry.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
          <p class="experience-ledger__stack"><code>{{ entry.stack.join(' · ') }}</code></p>

          <div v-if="entry.layers" class="lab-system" aria-label="Agala Labs private engineering system">
            <header>
              <span>private_system.map</span>
              <span>implementation disclosed · products private</span>
            </header>
            <ol>
              <li v-for="(layer, layerIndex) in entry.layers" :key="layer.label">
                <span>0{{ layerIndex + 1 }}</span>
                <div>
                  <h4>{{ layer.label }}</h4>
                  <p>{{ layer.detail }}</p>
                  <code>{{ layer.tools.join(' / ') }}</code>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>
