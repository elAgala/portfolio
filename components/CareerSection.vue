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
      <p>Technical leadership backed by hands-on product engineering across frontend, backend, cloud and delivery.</p>
    </div>

    <ol class="experience-signals">
      <li v-for="(signal, index) in signals" :key="signal.title" class="experience-signal">
        <span class="experience-signal__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ signal.title }}</h3>
        <p>{{ signal.detail }}</p>
      </li>
    </ol>

    <div class="career-history">
      <div class="career-history__heading">
        <h3>Career history</h3>
        <NuxtLink to="/resume">Open full résumé →</NuxtLink>
      </div>
      <ol class="career-history__list">
        <li v-for="entry in entries" :key="entry.company" class="career-entry">
          <div class="career-entry__identity">
            <span class="career-entry__dates">{{ entry.dates }}</span>
            <h4>{{ entry.company === 'Self-employed' ? 'Freelance' : entry.company }}</h4>
            <p class="career-entry__role">{{ entry.role }}</p>
            <p v-if="entry.location" class="career-entry__location">{{ entry.location }}</p>
          </div>
          <div class="career-entry__detail">
            <p class="career-entry__summary">{{ entry.summary }}</p>
            <ul class="career-entry__bullets">
              <li v-for="bullet in entry.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
            <p class="career-entry__stack" :aria-label="`Technologies used at ${entry.company}`">
              {{ entry.stack.join(' · ') }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
