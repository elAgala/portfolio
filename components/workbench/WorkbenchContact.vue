<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{
  person: Profile
}>()
</script>

<template>
  <section id="contact" class="workbench-contact" aria-labelledby="contact-heading">
    <p class="workbench-eyebrow">04 · Start a conversation</p>
    <div>
      <h2 id="contact-heading">Have a hard system<br>worth making simple?</h2>
      <a class="workbench-contact__email" :href="`mailto:${person.email}`">{{ person.email }} <span aria-hidden="true">↗</span></a>
    </div>
    <nav aria-label="Contact links">
      <a href="https://github.com/elAgala" target="_blank" rel="noreferrer">GitHub</a>
      <NuxtLink to="/resume">Résumé</NuxtLink>
      <a :href="`mailto:${person.email}`">Email</a>
    </nav>
  </section>
</template>
