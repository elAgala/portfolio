<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{ person: Profile }>()

const command = 'whoami'
const typedCommand = ref(command)
const heroRef = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  const hero = heroRef.value
  hero?.classList.add('is-typing')
  typedCommand.value = ''

  let index = 0
  const tick = () => {
    index += 1
    typedCommand.value = command.slice(0, index)
    if (index < command.length) {
      timer = setTimeout(tick, 45 + Math.random() * 45)
    }
    else {
      timer = setTimeout(() => hero?.classList.add('is-typed'), 300)
    }
  }
  timer = setTimeout(tick, 600)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section ref="heroRef" class="hero" aria-labelledby="hero-heading">
    <div class="term">
      <div class="term-body">
        <p class="term-cmd" aria-hidden="true"><b>$</b> <span>{{ typedCommand }}</span><span class="term-cmd-caret" /></p>
        <div class="term-output">
          <h1 id="hero-heading" class="term-title">
            {{ person.name }}<span class="term-cursor" aria-hidden="true" />
          </h1>
          <p class="term-role">{{ person.title }} <span>·</span> {{ person.location }}</p>
          <p class="term-manifesto">{{ person.manifesto }}</p>
          <div class="term-links">
            <a href="https://github.com/elAgala" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a :href="person.organizationUrl" target="_blank" rel="noreferrer">Agala Labs ↗</a>
            <a :href="`mailto:${person.email}`">Email</a>
            <NuxtLink to="/resume">Resume</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <figure class="hero-portrait">
      <img :src="person.avatar" :alt="`Portrait of ${person.name}`" width="360" height="360">
    </figure>
    <p class="hero-meta">{{ person.availability }}. Buenos Aires · UTC−3.</p>
  </section>
</template>
