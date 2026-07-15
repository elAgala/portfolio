<script setup lang="ts">
import ProjectRelease from '~/components/workbench/ProjectRelease.vue'
import WorkbenchContact from '~/components/workbench/WorkbenchContact.vue'
import WorkbenchExperience from '~/components/workbench/WorkbenchExperience.vue'
import WorkbenchHero from '~/components/workbench/WorkbenchHero.vue'
import WorkbenchProfile from '~/components/workbench/WorkbenchProfile.vue'
import { careerEntries } from '~/data/career'
import { evidenceGraphById } from '~/data/experience-graphs'
import { profile as person } from '~/data/profile'
import { projects } from '~/data/projects'
import type { EvidenceGraphId } from '~/types/workbench'

const evidenceProjects = projects.map(project => ({
  project,
  graph: evidenceGraphById[project.slug as EvidenceGraphId],
}))

useSeoMeta({
  title: 'Software Engineer',
  description: person.summary,
  ogTitle: 'Julián Benitez — Software Engineer',
  ogDescription: person.summary,
})

useHead({
  bodyAttrs: { class: 'workbench-body' },
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      jobTitle: person.title,
      email: person.email,
      url: `https://${person.website}`,
      sameAs: person.links.filter(link => link.url.startsWith('http')).map(link => link.url),
    }),
  }],
})
</script>

<template>
  <div class="workbench-page">
    <a class="skip-link" href="#main-content">Skip to portfolio content</a>
    <SiteHeader workbench />

    <main id="main-content">
      <WorkbenchHero :person="person" />

      <WorkbenchExperience :entries="careerEntries" />

      <section id="work" class="workbench-work" aria-labelledby="work-heading">
        <header class="workbench-work__heading">
          <p class="workbench-eyebrow">02 · Selected open-source work</p>
          <h2 id="work-heading">Systems with<br>their source left open.</h2>
          <p>Four repositories spanning interface infrastructure, repeatable deployment, AI-assisted delivery, and a Linux workstation built from first principles.</p>
        </header>

        <div class="project-release-list">
          <ProjectRelease
            v-for="({ project, graph }, index) in evidenceProjects"
            :key="project.slug"
            :project="project"
            :definition="graph"
            :index="index"
          />
        </div>
      </section>

      <WorkbenchProfile :person="person" />
      <WorkbenchContact :person="person" />
    </main>

    <SiteFooter :replay-enabled="false" />
    <TerminalDrawer />
  </div>
</template>
