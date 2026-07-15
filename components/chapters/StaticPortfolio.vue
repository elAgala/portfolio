<script setup lang="ts">
import type { ExperienceChapter } from '~/types/experience'

defineProps<{
  chapter: ExperienceChapter
  label: string
}>()
</script>

<template>
  <figure class="chapter-poster" :class="`chapter-poster--${chapter}`" aria-hidden="true">
    <img :src="`/stills/estate-${chapter}.avif`" alt="" width="1280" height="800" loading="lazy">
    <figcaption>
      <span>{{ label }}</span>
      <i />
    </figcaption>
  </figure>
</template>
