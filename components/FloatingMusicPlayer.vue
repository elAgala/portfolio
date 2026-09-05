<script setup lang="ts">
import type { MusicActions, MusicState } from '~/utils/music'

const props = defineProps<{ music: MusicState; actions: MusicActions | null }>()
const player = ref<HTMLElement>()
const passedOriginal = ref(false)
const focused = ref(false)
const menuOpen = ref(false)
const visible = computed(
  () => (passedOriginal.value || focused.value) && !menuOpen.value,
)
const expanded = computed(
  () => props.music.engaged || props.music.status === 'error',
)
const playbackLabel = computed(() =>
  props.music.status === 'error'
    ? `Retry ${props.music.title}`
    : `${props.music.playing ? 'Pause' : 'Play'} ${props.music.title} by ${props.music.artist}`,
)
let cleanup = () => {}

onMounted(() => {
  const original = document.querySelector<HTMLElement>('[data-music-player]')
  const header = document.querySelector<HTMLElement>('.site-header')
  const root = document.querySelector<HTMLElement>('.portfolio-page')
  let frame = 0
  const measure = () => {
    frame = 0
    if (original && header)
      passedOriginal.value =
        original.getBoundingClientRect().bottom <=
        header.getBoundingClientRect().bottom
    menuOpen.value = document.body.classList.contains('menu-open')
    const height = player.value?.getBoundingClientRect().height
    if (height)
      root?.style.setProperty('--floating-music-space', `${height + 32}px`)
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }
  const resize = new ResizeObserver(schedule)
  if (original) resize.observe(original)
  if (player.value) resize.observe(player.value)
  const menu = new MutationObserver(schedule)
  menu.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  measure()
  cleanup = () => {
    cancelAnimationFrame(frame)
    resize.disconnect()
    menu.disconnect()
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    root?.style.removeProperty('--floating-music-space')
  }
})
onBeforeUnmount(() => cleanup())

function leaveFocus(event: FocusEvent) {
  focused.value =
    event.relatedTarget instanceof Node &&
    !!player.value?.contains(event.relatedTarget)
}
</script>

<template>
  <Transition name="floating-music">
    <aside
      v-show="visible"
      ref="player"
      class="floating-player"
      :class="{ 'floating-player--expanded': expanded }"
      aria-label="Music player"
      @focusin="focused = true"
      @focusout="leaveFocus"
    >
      <div class="floating-track">
        <template v-if="expanded">
          <a
            :href="music.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="`${music.title} — ${music.artist}`"
            >{{ music.title }}</a
          >
          <span>{{ music.artist }} · SoundCloud</span>
        </template>
        <span v-else class="floating-invitation"
          >Listen to some house music I like</span
        >
      </div>
      <button
        key="playback"
        class="floating-button floating-playback"
        type="button"
        :disabled="music.disabled || !actions"
        :aria-label="playbackLabel"
        :aria-pressed="music.playing"
        :aria-busy="music.status === 'loading'"
        @click="actions?.togglePlayback()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path v-if="music.playing" d="M9 6v12M15 6v12" />
          <path v-else d="m9 6 9 6-9 6V6Z" />
        </svg>
      </button>
      <template v-if="expanded">
        <button
          class="floating-button"
          type="button"
          :disabled="music.disabled || !actions"
          aria-label="Play next track"
          @click="actions?.next()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 5v14M6 6l8 6-8 6V6Z" />
          </svg>
        </button>
      </template>
      <p v-if="music.status === 'error'" class="floating-error">
        {{ music.message }}
      </p>
    </aside>
  </Transition>
</template>

<style scoped>
.floating-player {
  position: fixed;
  z-index: 180;
  right: max(24px, env(safe-area-inset-right));
  bottom: calc(24px + env(safe-area-inset-bottom));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: min(360px, calc(100vw - 48px));
  padding: 12px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  background: var(--ink-raised);
  color: var(--paper);
  box-shadow: 0 8px 32px rgb(0 0 0 / 24%);
}
.floating-player--expanded {
  width: min(460px, calc(100vw - 48px));
}
.floating-track {
  flex: 1;
  min-width: 0;
  padding-inline: 4px 8px;
}
.floating-track a {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 550;
  text-decoration: none;
}
.floating-track > span {
  display: block;
  color: var(--stone);
  font-family: var(--mono);
  font-size: 9px;
}
.floating-track .floating-invitation {
  color: var(--paper);
  font-family: var(--display);
  font-size: 15px;
  line-height: 1.4;
}
.floating-button {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--paper);
  cursor: pointer;
  transition:
    background 160ms var(--ease),
    transform 160ms var(--ease);
}
.floating-playback {
  border: 1px solid rgb(138 163 146 / 55%);
  background: rgb(138 163 146 / 10%);
}
.floating-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.floating-button:disabled {
  opacity: 0.45;
  cursor: wait;
}
.floating-button[aria-pressed='true'] {
  color: var(--green);
}
.floating-button:active {
  transform: scale(0.97);
}
.floating-error {
  flex-basis: 100%;
  padding: 4px;
  color: var(--stone);
  font-size: 12px;
  line-height: 1.5;
}
.floating-music-enter-active,
.floating-music-leave-active {
  transition:
    opacity 200ms var(--ease),
    transform 200ms var(--ease);
}
.floating-music-enter-from,
.floating-music-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
@media (hover: hover) {
  .floating-button:not(:disabled):hover {
    background: rgb(138 163 146 / 16%);
  }
}
@media (max-width: 680px) {
  .floating-player {
    left: max(16px, env(safe-area-inset-left));
    right: max(16px, env(safe-area-inset-right));
    bottom: calc(16px + env(safe-area-inset-bottom));
    width: auto;
  }
}
@media (prefers-reduced-motion: reduce) {
  .floating-music-enter-active,
  .floating-music-leave-active {
    transition: opacity 200ms var(--ease);
  }
  .floating-music-enter-from,
  .floating-music-leave-to {
    transform: none;
  }
  .floating-button {
    transition: none;
  }
}
@media print {
  .floating-player {
    display: none !important;
  }
}
</style>
