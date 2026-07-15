<script setup lang="ts">
defineProps<{
  light?: boolean
}>()

const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function handleScroll() {
  scrolled.value = window.scrollY > 24
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu()
    document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
  }
}

watch(() => route.fullPath, closeMenu)
watch(menuOpen, (isOpen) => {
  document.body.classList.toggle('menu-open', isOpen)
})

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--light': light, 'site-header--scrolled': scrolled, 'site-header--menu-open': menuOpen }">
    <NuxtLink class="site-mark" to="/" aria-label="Julián Benitez, home">
      <span aria-hidden="true">JB</span>
    </NuxtLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="primary-navigation"
      aria-label="Toggle primary navigation"
      @click="menuOpen = !menuOpen"
    >
      <span>{{ menuOpen ? 'Close' : 'Menu' }}</span>
    </button>

    <nav id="primary-navigation" class="site-nav" :class="{ 'site-nav--open': menuOpen }" aria-label="Primary navigation">
      <NuxtLink to="/#work" @click="closeMenu">Work</NuxtLink>
      <NuxtLink to="/#profile" @click="closeMenu">Profile</NuxtLink>
      <NuxtLink class="site-nav__resume" to="/resume" @click="closeMenu">Open résumé <span aria-hidden="true">↗</span></NuxtLink>
      <NuxtLink to="/#contact" @click="closeMenu">Contact</NuxtLink>
    </nav>
  </header>
</template>
