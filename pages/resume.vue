<script setup lang="ts">
import { profile as person } from '~/data/profile'
import { resume as details } from '~/data/resume'

useHead({
  bodyAttrs: { class: 'resume-body' },
  meta: [{ name: 'color-scheme', content: 'light' }],
})

useSeoMeta({
  title: 'Resume',
  description: `Resume for ${person.name}, ${person.title} in ${person.location}.`,
  ogTitle: `Resume — ${person.name}`,
  ogDescription: details.summary,
  twitterTitle: `Resume — ${person.name}`,
  twitterDescription: details.summary,
  robots: 'index, follow',
})

function printResume() {
  window.print()
}
</script>

<template>
  <div class="resume-route">
    <nav class="resume-toolbar" aria-label="Resume actions">
      <div>
        <button type="button" @click="printResume">Print or save as PDF</button>
        <a href="/julian-benitez-resume.pdf" download>Download PDF</a>
      </div>
    </nav>

    <main class="resume-sheet">
      <header class="resume-header">
        <div>
          <h1>{{ person.name }}</h1>
          <p>{{ details.headline }}</p>
        </div>
        <address>
          <span>{{ person.location }}</span>
          <a :href="`mailto:${person.email}`">{{ person.email }}</a>
          <a :href="`https://${person.website}`">{{ person.website }}</a>
          <a href="https://github.com/elAgala">github.com/elAgala</a>
        </address>
      </header>

      <p class="resume-summary">{{ details.summary }}</p>

      <section class="resume-section" aria-labelledby="experience-title">
        <h2 id="experience-title">Experience</h2>
        <article v-for="item in details.experience" :key="`${item.company}-${item.dates}`" class="resume-entry">
          <div class="resume-entry__heading">
            <div>
              <h3>{{ item.company }}</h3>
              <p v-if="item.location">{{ item.location }}</p>
            </div>
            <time>{{ item.dates }}</time>
          </div>
          <div class="resume-positions" :class="{ 'resume-positions--progression': item.positions.length > 1 }">
            <section v-for="position in item.positions" :key="position.role" class="resume-position">
              <div class="resume-position__heading">
                <h4>{{ position.role }}</h4>
                <time v-if="item.positions.length > 1">{{ position.dates }}</time>
              </div>
              <ul>
                <li v-for="bullet in position.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </section>
          </div>
        </article>
      </section>

      <section class="resume-section resume-section--split" aria-label="Education and skills">
        <div>
          <h2>Technical skills</h2>
          <dl class="resume-skills">
            <div v-for="group in details.skillGroups" :key="group.label">
              <dt>{{ group.label }}</dt>
              <dd>{{ group.skills.join(', ') }}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2>Education</h2>
          <article v-for="item in details.education" :key="`${item.institution}-${item.dates}`" class="resume-education">
            <div>
              <h3>{{ item.degree }}</h3>
              <p>{{ item.institution }}<template v-if="item.detail"> · {{ item.detail }}</template></p>
              <time>{{ item.dates }}</time>
            </div>
          </article>
          <h2 class="resume-languages-title">Languages</h2>
          <p class="resume-languages">{{ details.languages.map(item => `${item.language}: ${item.level}`).join(' · ') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>
