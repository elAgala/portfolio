<script setup lang="ts">
import type { Profile } from '~/types/portfolio'
import StaticPortfolio from './StaticPortfolio.vue'

defineProps<{
  person: Profile
}>()
</script>

<template>
  <section
    id="top"
    class="hero experience-stage chapter chapter--left"
    data-experience-x="0"
    data-experience-chapter="hero"
    aria-labelledby="hero-title"
  >
    <StaticPortfolio chapter="hero" label="The threshold" />
    <div class="hero__atmosphere" aria-hidden="true">
      <div class="hero__beam" />
      <div class="hero__seal">JB</div>
      <div class="hero__grain" />
    </div>
    <div class="hero__meta">
      <span>{{ person.location }}</span>
      <span class="status"><i /> {{ person.availability }}</span>
    </div>
    <div class="hero__content chapter__copy">
      <p class="overline">An audience with the work.</p>
      <h1 id="hero-title">
        Built with intent.<br>
        <em>Made to endure.</em>
      </h1>
      <p class="hero__summary">{{ person.summary }}</p>
      <div class="hero__actions">
        <a class="editorial-action" href="#work">View selected work <span aria-hidden="true">↓</span></a>
        <NuxtLink class="editorial-action editorial-action--secondary" to="/resume">Open résumé <span aria-hidden="true">↗</span></NuxtLink>
      </div>
    </div>
    <div class="hero__scroll" aria-hidden="true"><i /> Scroll to enter the study</div>
  </section>
</template>
