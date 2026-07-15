<script setup lang="ts">
import EstateExperience from '~/components/experience/EstateExperience.client.vue'
import { evidenceGraphById } from '~/data/experience-graphs'
import { profile as person } from '~/data/profile'
import { projects } from '~/data/projects'
import type { EvidenceGraphId, ExperienceQuality } from '~/types/experience'

const experienceQuality = ref<ExperienceQuality>('fallback')
const graphProgress = ref<Record<EvidenceGraphId, number>>({ 'agala-ui': 0, 'agala-deploy': 0, 'agala-ai': 0 })
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
  <div class="portfolio-page">
    <EstateExperience
      @tier="experienceQuality = $event"
      @graph-progress="graphProgress = $event"
      @fallback="experienceQuality = 'fallback'"
    />
    <SiteHeader />

    <main class="cinematic-content">
      <section
        class="hero experience-stage"
        data-experience-x="0"
        data-experience-chapter="hero"
        aria-labelledby="hero-title"
      >
        <div class="hero__atmosphere" aria-hidden="true">
          <div class="hero__beam" />
          <div class="hero__seal">JB</div>
          <div class="hero__grain" />
        </div>
        <div class="hero__meta">
          <span>{{ person.location }}</span>
          <span class="status"><i /> {{ person.availability }}</span>
        </div>
        <div class="hero__content">
          <p class="hero__kicker">Software engineering, without loose ends.</p>
          <h1 id="hero-title">
            Built with intent.<br>
            <em>Made to endure.</em>
          </h1>
          <div class="hero__bottom">
            <p>{{ person.summary }}</p>
            <div class="hero__actions">
              <a class="text-link" href="#work">Selected work <span aria-hidden="true">↓</span></a>
              <NuxtLink class="text-link text-link--quiet" to="/resume">Open résumé <span aria-hidden="true">↗</span></NuxtLink>
            </div>
          </div>
        </div>
        <div class="hero__index" aria-hidden="true">I</div>
        <div class="hero__scroll" aria-hidden="true"><i /> Scroll to enter the study</div>
      </section>

      <section id="work" class="work-section" aria-labelledby="work-title">
        <div class="work-prologue section-shell">
          <p class="overline">01 · Selected work</p>
          <p class="work-prologue__aside">Three systems presented as evidence—not decoration.</p>
        </div>
        <RevealOnScroll>
          <SectionHeading
            index="01"
            eyebrow="Selected work"
            title="Three systems. One standard."
            description="Product infrastructure, delivery infrastructure, and the operating context that connects people to both."
          />
        </RevealOnScroll>
        <h2 id="work-title" class="sr-only">Selected work</h2>
        <div class="project-list">
          <ProjectEvidenceCard
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

      <section
        id="profile"
        class="profile-section experience-stage"
        data-experience-x="72"
        data-experience-chapter="profile"
        aria-labelledby="profile-title"
      >
        <div class="profile-section__portrait">
          <div class="portrait-frame">
            <img :src="person.avatar" width="460" height="460" alt="Portrait of Julián Benitez" loading="lazy">
            <span class="portrait-frame__line" aria-hidden="true" />
          </div>
          <p>Engineer · Builder · Mentor</p>
        </div>
        <RevealOnScroll>
          <div class="profile-section__content">
            <p class="overline">02 · Profile</p>
            <h2 id="profile-title">Close to the code.<br><em>Present for the consequence.</em></h2>
            <p class="profile-section__manifesto">{{ person.manifesto }}</p>
            <dl class="capability-list">
              <div v-for="capability in person.capabilities" :key="capability.title">
                <dt>{{ capability.title }}</dt>
                <dd>{{ capability.description }}</dd>
                <dd class="capability-list__tools">{{ capability.tools.join(' · ') }}</dd>
              </div>
            </dl>
          </div>
        </RevealOnScroll>
      </section>

      <section
        class="principles-section section-shell experience-stage"
        data-experience-x="78"
        data-experience-chapter="profile"
        aria-labelledby="principles-title"
      >
        <RevealOnScroll>
          <SectionHeading
            index="03"
            eyebrow="Working principles"
            title="A quiet kind of rigor."
          />
        </RevealOnScroll>
        <h2 id="principles-title" class="sr-only">Working principles</h2>
        <ol class="principles-list">
          <li v-for="principle in person.principles" :key="principle.number">
            <span>{{ principle.number }}</span>
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.description }}</p>
          </li>
        </ol>
      </section>

      <section
        class="contact-section experience-stage"
        data-experience-x="90"
        data-experience-chapter="contact"
        aria-labelledby="contact-title"
      >
        <div class="contact-section__flare" aria-hidden="true" />
        <p class="overline">04 · Contact</p>
        <p class="contact-section__prelude">Every consequential system starts with a conversation.</p>
        <h2 id="contact-title">Let’s make<br><em>something that lasts.</em></h2>
        <a class="contact-email" :href="`mailto:${person.email}`">
          {{ person.email }} <span aria-hidden="true">↗</span>
        </a>
        <div class="contact-links">
          <template v-for="link in person.links" :key="link.label">
            <NuxtLink v-if="link.url.startsWith('/')" :to="link.url">{{ link.label }}</NuxtLink>
            <a v-else :href="link.url" :target="link.url.startsWith('http') ? '_blank' : undefined" :rel="link.url.startsWith('http') ? 'noreferrer' : undefined">{{ link.label }}</a>
          </template>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
