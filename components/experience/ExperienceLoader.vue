<script setup lang="ts">
defineProps<{
  progress: number
  ready: boolean
  fallback: boolean
}>()
</script>

<template>
  <div v-if="!ready || fallback" class="estate-loader" :class="{ 'estate-loader--fallback': fallback }" aria-live="polite">
    <span>{{ fallback ? 'Static edition' : 'Preparing the study' }}</span>
    <i v-if="!fallback" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
  </div>
</template>
