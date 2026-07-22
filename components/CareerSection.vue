<script setup lang="ts">
import type { CareerEntry, ExperienceSignal } from '~/types/portfolio'

defineProps<{
  entries: CareerEntry[]
  signals: ExperienceSignal[]
}>()
</script>

<template>
  <section id="career" class="section" aria-labelledby="career-heading">
    <div class="section-heading">
      <h2 id="career-heading">Experience</h2>
    </div>

    <ol class="experience-signals">
      <li v-for="(signal, index) in signals" :key="signal.title" class="experience-signal">
        <span class="experience-signal__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ signal.title }}</h3>
        <p>{{ signal.detail }}</p>
      </li>
    </ol>

    <div class="career-timeline">
      <div class="career-timeline__heading">
        <h3>Career timeline</h3>
        <NuxtLink to="/resume">Open full résumé →</NuxtLink>
      </div>
      <ol class="career-timeline__list">
        <li v-for="entry in entries" :key="entry.company">
          <span class="career-timeline__dates">{{ entry.dates }}</span>
          <strong>{{ entry.company === 'Self-employed' ? 'Freelance' : entry.company }}</strong>
          <span class="career-timeline__role">{{ entry.role }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>
