<script setup lang="ts">
import { careerEntries, experienceSignals } from '~/data/career'
import { agalaLabs } from '~/data/lab'
import { profile as person } from '~/data/profile'
import { projects } from '~/data/projects'

useSeoMeta({
  title: 'Agala / Software Engineer & Tech Lead',
  description: person.summary,
  ogTitle: 'Agala / Julián Benitez — Software Engineer & Tech Lead',
  ogDescription: person.summary,
})

useHead({
  bodyAttrs: { class: 'agala-body' },
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      alternateName: person.brand,
      jobTitle: person.title,
      email: person.email,
      url: `https://${person.website}`,
      worksFor: { '@type': 'Organization', name: person.organization, url: person.organizationUrl },
      sameAs: person.links.filter(link => link.label === 'GitHub').map(link => link.url),
    }),
  }],
})

</script>

<template>
  <div class="agala-page">
    <a class="skip-link" href="#main-content">Skip to the portfolio</a>
    <SiteHeader :person="person" />

    <main id="main-content">
      <HeroTerminal :person="person" />
      <AgalaLabsSection :story="agalaLabs" />
      <WorkSection :projects="projects" />
      <CareerSection :entries="careerEntries" :signals="experienceSignals" />
      <ContactSection :person="person" />
    </main>

    <SiteFooter />
  </div>
</template>
