<script setup lang="ts">
import type { EvidenceGraphDefinition, ExperienceQuality } from '~/types/experience'
import type { Project } from '~/types/portfolio'

defineProps<{
  project: Project
  definition: EvidenceGraphDefinition
  index: number
  experienceX: number
  graphProgress: number
  quality: ExperienceQuality
}>()
</script>

<template>
  <ProjectEvidenceCard
    :project="project"
    :definition="definition"
    :index="index"
    :experience-x="experienceX"
    :graph-progress="graphProgress"
    :quality="quality"
  />
</template>
