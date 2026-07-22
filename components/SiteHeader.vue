<script setup lang="ts">
import type { Profile } from '~/types/portfolio'

defineProps<{ person: Pick<Profile, 'avatar' | 'brand' | 'name'> }>()

const route = useRoute()
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu()
    document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
  }
}

watch(() => route.fullPath, closeMenu)
watch(menuOpen, open => document.body.classList.toggle('menu-open', open))

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-mark" to="/" :aria-label="`${person.brand}, ${person.name}, home`">
      <img class="site-mark__avatar" :src="person.avatar" alt="" width="32" height="32">
      <span>{{ person.brand }}</span>
    </NuxtLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      @click="menuOpen = !menuOpen"
    >
      {{ menuOpen ? 'close' : 'menu' }}
    </button>

    <nav id="primary-navigation" class="site-nav" :class="{ 'site-nav--open': menuOpen }" aria-label="Primary navigation">
      <a href="/#labs" @click="closeMenu">Agala Labs</a>
      <a href="/#work" @click="closeMenu">Public work</a>
      <a href="/#career" @click="closeMenu">Experience</a>
      <a href="/#contact" @click="closeMenu">Contact</a>
      <NuxtLink class="site-nav__resume" to="/resume" @click="closeMenu">Resume</NuxtLink>
    </nav>
  </header>
</template>
