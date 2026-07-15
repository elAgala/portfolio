<script setup lang="ts">
import type { Profile } from '~/types/portfolio'
import StaticPortfolio from './StaticPortfolio.vue'

defineProps<{
  person: Profile
}>()
</script>

<template>
  <section
    id="contact"
    class="decision experience-stage chapter chapter--left"
    data-experience-x="90"
    data-experience-chapter="contact"
    aria-labelledby="decision-title"
  >
    <StaticPortfolio chapter="contact" label="The decision" />
    <div class="decision__copy chapter__copy">
      <p class="overline">03 · The decision</p>
      <p class="decision__prelude">Every consequential system starts with a conversation.</p>
      <h2 id="decision-title">Let’s make<br><em>something that lasts.</em></h2>
      <a class="decision__email" :href="`mailto:${person.email}`">
        <span>{{ person.email }}</span>
        <i aria-hidden="true" />
        <b aria-hidden="true">↗</b>
      </a>
      <nav class="decision__links" aria-label="Contact and social links">
        <template v-for="link in person.links" :key="link.label">
          <NuxtLink v-if="link.url.startsWith('/')" :to="link.url">{{ link.label }}</NuxtLink>
          <a v-else :href="link.url" :target="link.url.startsWith('http') ? '_blank' : undefined" :rel="link.url.startsWith('http') ? 'noreferrer' : undefined">{{ link.label }}</a>
        </template>
      </nav>
    </div>
    <div class="decision__seal" aria-hidden="true"><span>JB</span></div>
  </section>
</template>
