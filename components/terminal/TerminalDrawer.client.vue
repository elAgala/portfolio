<script setup lang="ts">
const { mode, requestOpen, requestClose } = useOperatorTerminal()
const launcher = ref<HTMLButtonElement | null>(null)

const active = computed(() => mode.value !== 'idle')

async function enterFromLauncher() {
  if (active.value)
    return

  const desk = document.querySelector<HTMLElement>('#operator-desk')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  desk?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  if (!reducedMotion)
    await new Promise(resolve => window.setTimeout(resolve, 420))
  requestOpen()
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === '`') {
    event.preventDefault()
    if (active.value)
      requestClose()
    else
      void enterFromLauncher()
  }
  else if (event.key === 'Escape' && active.value) {
    event.preventDefault()
    requestClose()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <button
    ref="launcher"
    class="terminal-launcher"
    :class="{ 'terminal-launcher--active': active }"
    type="button"
    :aria-expanded="active"
    aria-controls="operator-desk"
    :disabled="active"
    @click="enterFromLauncher"
  >
    <span aria-hidden="true">&gt;_</span>
    <b>{{ active ? 'TTY attached' : 'Enter TTY' }}</b>
    <kbd>Ctrl `</kbd>
  </button>
</template>
