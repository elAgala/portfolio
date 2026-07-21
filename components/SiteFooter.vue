<script setup lang="ts">
import { profile as person } from '~/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <span>© {{ year }} {{ person.name }} · Agala</span>
    <span>
      <a :href="person.organizationUrl" target="_blank" rel="noreferrer">Agala Labs ↗</a>
      · <a href="https://github.com/elAgala" target="_blank" rel="noreferrer">GitHub ↗</a>
      · <a :href="`mailto:${person.email}`">Email</a>
      · <NuxtLink to="/resume">Resume</NuxtLink>
    </span>
    <span>Buenos Aires · UTC−3</span>
  </footer>
</template>
