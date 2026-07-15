<script setup lang="ts">
defineProps<{
  progress: number
  ready: boolean
  fallback: boolean
}>()
</script>

<template>
  <p v-if="fallback" class="sr-only" aria-live="polite">The static portfolio edition is active.</p>
  <div v-else-if="!ready" class="estate-loader" aria-live="polite">
    <span>Preparing the study</span>
    <i :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
  </div>
</template>
