<script setup lang="ts">
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'
import { completeTerminalInput, runTerminalCommand, type TerminalContext } from '~/utils/terminal'

interface TerminalLine {
  id: number
  kind: 'command' | 'output' | 'system'
  text: string
}

const router = useRouter()
const isOpen = ref(false)
const input = ref('')
const inputElement = ref<HTMLInputElement | null>(null)
const outputElement = ref<HTMLElement | null>(null)
const drawerElement = ref<HTMLElement | null>(null)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const lines = ref<TerminalLine[]>([
  { id: 1, kind: 'system', text: 'JULIAN BENITEZ / OPERATOR WORKBENCH TTY' },
  { id: 2, kind: 'output', text: 'Session ready. Type `help` or press Tab.' },
])

const context: TerminalContext = {
  name: profile.name,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  github: 'https://github.com/elAgala',
  projects: projects.map(project => ({
    slug: project.slug,
    title: project.title,
    path: project.path,
    repository: project.repository,
  })),
}

let lineId = 2
let previouslyFocused: HTMLElement | null = null

async function scrollToLatest() {
  await nextTick()
  if (outputElement.value)
    outputElement.value.scrollTop = outputElement.value.scrollHeight
}

async function openTerminal() {
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  isOpen.value = true
  await nextTick()
  inputElement.value?.focus()
}

function closeTerminal() {
  isOpen.value = false
  window.setTimeout(() => previouslyFocused?.focus(), 0)
}

async function execute() {
  const command = input.value.trim()
  if (!command)
    return

  lines.value.push({ id: ++lineId, kind: 'command', text: command })
  if (history.value.at(-1) !== command)
    history.value.push(command)
  historyIndex.value = history.value.length
  input.value = ''

  const result = runTerminalCommand(command, context)
  result.output.forEach(text => lines.value.push({ id: ++lineId, kind: 'output', text }))

  if (result.action?.type === 'clear') {
    lines.value = []
  }
  else if (result.action?.type === 'close') {
    closeTerminal()
  }
  else if (result.action?.type === 'navigate') {
    await router.push(result.action.target)
    closeTerminal()
  }
  else if (result.action?.type === 'external') {
    window.open(result.action.target, '_blank', 'noopener,noreferrer')
  }

  await scrollToLatest()
}

function navigateHistory(direction: -1 | 1) {
  if (!history.value.length)
    return
  historyIndex.value = Math.min(history.value.length, Math.max(0, historyIndex.value + direction))
  input.value = historyIndex.value === history.value.length ? '' : history.value[historyIndex.value] ?? ''
  nextTick(() => inputElement.value?.setSelectionRange(input.value.length, input.value.length))
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    event.preventDefault()
    input.value = completeTerminalInput(input.value || 'help', context)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigateHistory(-1)
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigateHistory(1)
  }
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === '`') {
    event.preventDefault()
    if (isOpen.value)
      closeTerminal()
    else
      openTerminal()
  }
  else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeTerminal()
  }
  else if (event.key === 'Tab' && isOpen.value && drawerElement.value) {
    const focusable = [...drawerElement.value.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])')]
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <button class="terminal-launcher" type="button" :aria-expanded="isOpen" aria-controls="portfolio-terminal" @click="openTerminal">
    <span aria-hidden="true">&gt;_</span>
    <b>Open TTY</b>
    <kbd>Ctrl `</kbd>
  </button>

  <Transition name="terminal-drawer">
    <div v-if="isOpen" class="terminal-overlay" @mousedown.self="closeTerminal">
      <section id="portfolio-terminal" ref="drawerElement" class="terminal-drawer" role="dialog" aria-modal="true" aria-labelledby="terminal-title">
        <header class="terminal-drawer__bar">
          <div aria-hidden="true"><i /><i /><i /></div>
          <p id="terminal-title">julian@workbench: ~/portfolio</p>
          <button type="button" aria-label="Close terminal" @click="closeTerminal">Esc ×</button>
        </header>

        <div ref="outputElement" class="terminal-drawer__output" aria-live="polite" aria-relevant="additions text">
          <p v-for="line in lines" :key="line.id" :class="`terminal-line--${line.kind}`">
            <span v-if="line.kind === 'command'" aria-hidden="true">$</span>{{ line.text }}
          </p>
        </div>

        <form class="terminal-drawer__prompt" @submit.prevent="execute">
          <label for="terminal-input">julian@workbench:~$</label>
          <input
            id="terminal-input"
            ref="inputElement"
            v-model="input"
            type="text"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-label="Terminal command"
            @keydown="onInputKeydown"
          >
          <button type="submit">Run ↵</button>
        </form>

        <footer>
          <span>Tab autocomplete</span>
          <span>↑ ↓ history</span>
          <span>Safe commands only · no eval</span>
        </footer>
      </section>
    </div>
  </Transition>
</template>
