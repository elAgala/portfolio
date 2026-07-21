<script setup lang="ts">
import type { CareerEntry } from '~/types/portfolio'

defineProps<{ entries: CareerEntry[] }>()
</script>

<template>
  <section id="career" class="section" aria-labelledby="career-heading">
    <div class="section-heading">
      <h2 id="career-heading">Experience</h2>
      <p>I currently lead distributed product teams at AlixPartners and build Agala Labs end to end.</p>
    </div>

    <div class="experience-list">
      <article v-for="entry in entries" :key="entry.company" class="experience-entry">
        <span class="dates">{{ entry.dates }}</span>
        <div>
          <h3>{{ entry.company === 'Self-employed' ? 'Freelance' : entry.company }}</h3>
          <p class="role">{{ entry.role }} · {{ entry.location }}</p>
        </div>
        <ul>
          <li v-for="bullet in entry.portfolioBullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
