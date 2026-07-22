<script setup lang="ts">
import type { Project } from '~/types/portfolio'

defineProps<{ projects: Project[] }>()
</script>

<template>
  <section id="work" class="section" aria-labelledby="work-heading">
    <div class="section-heading">
      <h2 id="work-heading">Public work</h2>
      <p>Agala UI, Agala AI and Agala Setup are public tools I maintain and use in my own work.</p>
    </div>

    <div class="work-list">
      <article
        v-for="project in projects"
        :key="project.slug"
        class="work-entry"
      >
        <div class="work-entry__title">
          <p>{{ project.eyebrow }}</p>
          <h3>{{ project.title }}</h3>
          <p class="work-entry__meta">{{ project.year }} · {{ project.role }}</p>
        </div>
        <div class="work-entry__body">
          <p>{{ project.description }}</p>
          <p class="work-entry__outcome">{{ project.outcome }}</p>
          <p class="work-entry__stack">{{ project.stack.join(' · ') }}</p>
          <a :href="project.repository" target="_blank" rel="noreferrer">View source on GitHub ↗</a>
        </div>
      </article>
    </div>
  </section>
</template>
