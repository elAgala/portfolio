<script setup lang="ts">
import { getProject } from '~/data/projects'

const route = useRoute()
const project = computed(() => getProject(String(route.params.slug)))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

useSeoMeta({
  title: project.value.title,
  description: project.value.description,
  ogTitle: `${project.value.title} — Julián Benitez`,
  ogDescription: project.value.description,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.value.title,
      description: project.value.description,
      url: project.value.repository,
      author: { '@type': 'Person', name: 'Julián Benitez' },
    }),
  }],
})
</script>

<template>
  <div v-if="project" class="case-page">
    <SiteHeader />
    <main>
      <header class="case-hero">
        <div class="case-hero__meta">
          <NuxtLink to="/#work">← Selected work</NuxtLink>
          <span>{{ project.year }}</span>
        </div>
        <p class="overline">{{ project.eyebrow }}</p>
        <h1>{{ project.title }}</h1>
        <p class="case-hero__description">{{ project.description }}</p>
        <div class="case-hero__facts">
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{{ project.role }}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{{ project.stack.join(' · ') }}</dd>
            </div>
          </dl>
          <a :href="project.repository" target="_blank" rel="noreferrer">View repository <span aria-hidden="true">↗</span></a>
        </div>
        <div class="case-hero__monogram" aria-hidden="true">{{ project.title.slice(0, 1) }}</div>
      </header>

      <section class="case-summary section-shell" aria-label="Project summary">
        <div>
          <p class="overline">The challenge</p>
          <h2>{{ project.challenge }}</h2>
        </div>
        <aside>
          <span>Outcome</span>
          <p>{{ project.outcome }}</p>
        </aside>
      </section>

      <section class="case-approach section-shell" aria-labelledby="approach-title">
        <p class="overline">The approach</p>
        <h2 id="approach-title">Decisions that shaped the work.</h2>
        <ol>
          <li v-for="(item, index) in project.approach" :key="item">
            <span>0{{ index + 1 }}</span>
            <p>{{ item }}</p>
          </li>
        </ol>
      </section>

      <article class="case-body section-shell">
        <div>
          <section v-for="section in project.narrative" :key="section.title">
            <h2>{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <ul v-if="section.points">
              <li v-for="point in section.points" :key="point">{{ point }}</li>
            </ul>
          </section>
        </div>
      </article>

      <nav class="case-next" aria-label="Case study navigation">
        <p>Return to the complete picture.</p>
        <NuxtLink to="/#work">All selected work <span aria-hidden="true">↗</span></NuxtLink>
      </nav>
    </main>
    <SiteFooter />
  </div>
</template>
