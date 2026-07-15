<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { EvidenceGraphDefinition, ExperienceQuality } from '~/types/experience'
import type { Project } from '~/types/portfolio'
import { evaluateEvidenceGraphPhase } from '~/utils/experience'

const props = defineProps<{
  project: Project
  definition: EvidenceGraphDefinition
  index: number
  experienceX: number
  graphProgress: number
  quality: ExperienceQuality
}>()

const localProgress = computed(() => props.quality === 'high' ? props.graphProgress : 1)
const graphState = computed(() => evaluateEvidenceGraphPhase(props.definition, localProgress.value))

function graphPoint(position: [number, number, number]) {
  return {
    x: 50 + position[0] * 18,
    y: 78 - position[1] * 34 + position[2] * 6,
  }
}

function nodeStyle(position: [number, number, number]): CSSProperties {
  const point = graphPoint(position)
  return { left: `${point.x}%`, top: `${point.y}%` }
}
</script>

<template>
  <article
    :id="project.slug"
    class="project-evidence experience-stage"
    :class="`project-evidence--${definition.id}`"
    :data-experience-x="experienceX"
    :data-experience-chapter="project.slug"
    :data-graph-phase="graphState.phase.id"
  >
    <div class="project-evidence__visual" aria-hidden="true">
      <span class="project-evidence__index">0{{ index + 1 }}</span>
      <svg class="evidence-static-frame" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line
          v-for="edge in definition.edges"
          :key="edge.id"
          :x1="graphPoint(definition.nodes.find(node => node.id === edge.source)!.position).x"
          :y1="graphPoint(definition.nodes.find(node => node.id === edge.source)!.position).y"
          :x2="graphPoint(definition.nodes.find(node => node.id === edge.target)!.position).x"
          :y2="graphPoint(definition.nodes.find(node => node.id === edge.target)!.position).y"
        />
      </svg>
      <i
        v-for="node in definition.nodes"
        :key="node.id"
        class="evidence-static-node"
        :class="`evidence-static-node--${node.kind}`"
        :style="nodeStyle(node.position)"
      />
      <span class="project-evidence__caption">{{ definition.outcome }}</span>
    </div>

    <div class="project-evidence__content">
      <div class="project-evidence__meta">
        <span>{{ project.eyebrow }}</span>
        <span>{{ project.year }}</span>
      </div>
      <p class="project-evidence__outcome">{{ definition.outcome }}</p>
      <h3><NuxtLink :to="project.path">{{ project.title }}</NuxtLink></h3>
      <p class="project-evidence__description">{{ project.description }}</p>

      <div class="evidence-phase" aria-live="polite">
        <span>Phase 0{{ graphState.phaseIndex + 1 }} · {{ graphState.phase.label }}</span>
        <p>{{ graphState.phase.annotation }}</p>
      </div>

      <ol class="evidence-phase-list" aria-label="System transformation phases">
        <li
          v-for="(phase, phaseIndex) in definition.phases"
          :key="phase.id"
          :class="{ 'is-active': phaseIndex === graphState.phaseIndex, 'is-complete': phaseIndex < graphState.phaseIndex }"
          :aria-current="phaseIndex === graphState.phaseIndex ? 'step' : undefined"
        >
          <i aria-hidden="true" />
          <span>{{ phase.label }}</span>
        </li>
      </ol>

      <div class="evidence-node-map">
        <p>Evidence map</p>
        <ul :aria-label="`${project.title} architecture`">
          <li v-for="node in definition.nodes" :key="node.id">{{ node.label }}</li>
        </ul>
      </div>

      <ul class="tag-list" :aria-label="`${project.title} technology stack`">
        <li v-for="technology in project.stack" :key="technology">{{ technology }}</li>
      </ul>
      <NuxtLink class="project-evidence__link text-link" :to="project.path">
        Examine the case <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </article>
</template>
