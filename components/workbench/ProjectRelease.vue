<script setup lang="ts">
import type { Project } from '~/types/portfolio'
import type { EvidenceGraphDefinition } from '~/types/workbench'
import ArchitectureDiagram from './ArchitectureDiagram.vue'

const props = defineProps<{
  project: Project
  definition: EvidenceGraphDefinition
  index: number
}>()

const copied = ref(false)
const cloneCommand = computed(() => `git clone ${props.project.repository}.git`)
let copiedTimer: number | undefined

async function copyCloneCommand() {
  await navigator.clipboard.writeText(cloneCommand.value)
  copied.value = true
  if (copiedTimer)
    window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => { copied.value = false }, 1800)
}

onBeforeUnmount(() => {
  if (copiedTimer)
    window.clearTimeout(copiedTimer)
})
</script>

<template>
  <article :id="project.slug" class="project-release">
    <div class="project-release__rail">
      <span>0{{ index + 1 }}</span>
      <p>Public repository</p>
      <i />
    </div>

    <div class="project-release__copy">
      <div class="project-release__meta">
        <span>{{ project.eyebrow }}</span>
        <span>{{ project.year }}</span>
      </div>
      <h3>{{ project.title }}</h3>
      <p class="project-release__outcome">{{ project.outcome }}</p>
      <p>{{ project.description }}</p>
      <ul class="project-release__stack" :aria-label="`${project.title} technology stack`">
        <li v-for="technology in project.stack" :key="technology">{{ technology }}</li>
      </ul>
      <div class="project-release__actions">
        <NuxtLink :to="project.path">Read case study <span aria-hidden="true">↗</span></NuxtLink>
        <a :href="project.repository" target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>
      </div>
    </div>

    <div class="project-release__technical">
      <div class="project-release__window">
        <header><span>architecture.map</span><span>{{ definition.nodes.length }} nodes</span></header>
        <ArchitectureDiagram :definition="definition" />
        <footer>{{ definition.outcome }}</footer>
      </div>
      <button class="clone-command" type="button" @click="copyCloneCommand">
        <span aria-hidden="true">$</span>
        <code>{{ cloneCommand }}</code>
        <b>{{ copied ? 'Copied' : 'Copy' }}</b>
      </button>
      <p class="sr-only" aria-live="polite">{{ copied ? 'Clone command copied to clipboard.' : '' }}</p>
    </div>
  </article>
</template>
