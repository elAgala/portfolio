<script setup lang="ts">
defineProps<{
  chapterLabel: string
  progress: number
  soundEnabled: boolean
}>()

const emit = defineEmits<{
  toggleSound: []
}>()
</script>

<template>
  <div class="experience-hud">
    <div class="experience-hud__chapter" aria-live="polite">
      <span>0{{ Math.min(6, Math.round(progress * 5) + 1) }}</span>
      <p>{{ chapterLabel }}</p>
    </div>
    <button type="button" :aria-pressed="soundEnabled" @click="emit('toggleSound')">
      <span class="sound-bars" :class="{ 'sound-bars--active': soundEnabled }" aria-hidden="true"><i /><i /><i /></span>
      {{ soundEnabled ? 'Sound on' : 'Sound off' }}
    </button>
    <div class="experience-hud__progress" aria-hidden="true"><i :style="{ transform: `scaleX(${progress})` }" /></div>
  </div>
</template>
