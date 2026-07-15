<script setup lang="ts">
defineProps<{
  index: string
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <header class="section-heading">
    <div class="section-heading__meta">
      <span>{{ index }}</span>
      <span>{{ eyebrow }}</span>
    </div>
    <div class="section-heading__copy">
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
  </header>
</template>
