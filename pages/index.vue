<script setup lang="ts">
import ContactDecision from '~/components/chapters/ContactDecision.vue'
import HeroChapter from '~/components/chapters/HeroChapter.vue'
import ProfileArchive from '~/components/chapters/ProfileArchive.vue'
import ProjectEvidenceChapter from '~/components/chapters/ProjectEvidenceChapter.vue'
import EstateExperience from '~/components/experience/EstateExperience.client.vue'
import { evidenceGraphById } from '~/data/experience-graphs'
import { profile as person } from '~/data/profile'
import { projects } from '~/data/projects'
import type { EvidenceGraphId, ExperienceChapter, ExperienceQuality } from '~/types/experience'
import { resolveExperiencePresentation } from '~/utils/experience'

const route = useRoute()
const experienceQuality = ref<ExperienceQuality>('fallback')
const activeChapter = ref<ExperienceChapter>('hero')
const experienceReady = ref(false)
const experienceFailed = ref(false)
const graphProgress = ref<Record<EvidenceGraphId, number>>({ 'agala-ui': 0, 'agala-deploy': 0, 'agala-ai': 0 })
const presentation = computed(() => resolveExperiencePresentation({ quality: experienceQuality.value, ready: experienceReady.value, failed: experienceFailed.value }))
const captureMode = computed(() => route.query.capture === 'scene')
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
  bodyAttrs: {
    class: 'portfolio-body',
  },
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
  <div class="portfolio-page" :data-quality="experienceQuality" :data-active-chapter="activeChapter" :data-presentation="presentation" :data-capture="captureMode">
    <a class="skip-link" href="#main-content">Skip to portfolio content</a>
    <EstateExperience
      @tier="experienceQuality = $event"
      @ready="experienceReady = true"
      @chapter-change="activeChapter = $event"
      @graph-progress="graphProgress = $event"
      @fallback="experienceQuality = 'fallback'; experienceFailed = true"
    />
    <SiteHeader />

    <main id="main-content" class="cinematic-content">
      <HeroChapter :person="person" />

      <section id="work" class="work-section" aria-labelledby="work-title">
        <div class="work-prologue section-shell">
          <div>
            <p class="overline">01 · Selected work</p>
            <h2 id="work-title">Three systems.<br><em>Presented as evidence.</em></h2>
          </div>
          <p>Product infrastructure, delivery infrastructure, and the operating context that connects people to both.</p>
        </div>
        <div class="project-list">
          <ProjectEvidenceChapter
            v-for="({ project, graph }, index) in evidenceProjects"
            :key="project.path"
            :project="project"
            :definition="graph"
            :index="index"
            :experience-x="18 + index * 18"
            :graph-progress="graphProgress[graph.id]"
            :quality="experienceQuality"
          />
        </div>
      </section>

      <ProfileArchive :person="person" />
      <ContactDecision :person="person" />
    </main>

    <SiteFooter :replay-enabled="presentation !== 'static'" />
  </div>
</template>
