<script setup lang="ts">
import { profile as person } from '~/data/profile'
import { resume as details } from '~/data/resume'

useHead({
  bodyAttrs: { class: 'resume-body' },
})

useSeoMeta({
  title: 'Résumé',
  description: `Résumé for ${person.name}, ${person.title} in ${person.location}.`,
  robots: 'index, follow',
})

function printResume() {
  window.print()
}
</script>

<template>
  <div class="resume-route">
    <nav class="resume-toolbar" aria-label="Résumé actions">
      <NuxtLink to="/">← Portfolio</NuxtLink>
      <div>
        <button type="button" @click="printResume">Save as PDF</button>
        <a href="/julian-benitez-resume.pdf" download>Download PDF</a>
      </div>
    </nav>

    <main class="resume-sheet">
      <header class="resume-header">
        <div>
          <h1>{{ person.name }}</h1>
          <p>{{ person.title }}</p>
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
              <h3>{{ item.role }}</h3>
              <p>{{ item.company }}<template v-if="item.location"> · {{ item.location }}</template></p>
            </div>
            <time>{{ item.dates }}</time>
          </div>
          <ul>
            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </article>
      </section>

      <section class="resume-section resume-section--split" aria-label="Education and skills">
        <div>
          <h2>Education</h2>
          <article v-for="item in details.education" :key="`${item.institution}-${item.dates}`" class="resume-education">
            <div>
              <h3>{{ item.degree }}</h3>
              <p>{{ item.institution }}<template v-if="item.detail"> · {{ item.detail }}</template></p>
            </div>
            <time>{{ item.dates }}</time>
          </article>
        </div>
        <div>
          <h2>Technical skills</h2>
          <dl class="resume-skills">
            <div v-for="group in details.skillGroups" :key="group.label">
              <dt>{{ group.label }}</dt>
              <dd>{{ group.skills.join(', ') }}</dd>
            </div>
          </dl>
          <h2 class="resume-languages-title">Languages</h2>
          <p class="resume-languages">{{ details.languages.map(item => `${item.language} — ${item.level}`).join(' · ') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>
