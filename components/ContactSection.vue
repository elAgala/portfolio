<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{ person: Profile }>()
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-heading">
    <div class="contact-cta">
      <h2 id="contact-heading">Contact</h2>
      <p>{{ person.availability }}. Email is the best way to reach me.</p>
      <a class="big" :href="`mailto:${person.email}`">{{ person.email }}</a>
      <div class="contact-links">
        <a href="https://github.com/elAgala" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a :href="person.organizationUrl" target="_blank" rel="noreferrer">Agala Labs ↗</a>
        <NuxtLink to="/resume">Resume</NuxtLink>
      </div>
    </div>
  </section>
</template>
