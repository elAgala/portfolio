import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSoundCloud } from '../utils/soundcloud-player'
import { musicTracks, type MusicActions, type MusicState } from '../utils/music'
import type { SoundCloudLoadOptions, SoundCloudProgress, SoundCloudWidget } from '../types/soundcloud'

class FakeElement extends EventTarget {
  textContent = ''
  disabled = false
  value = ''
  max = ''
  href = ''
  src = ''
  dataset: Record<string, string> = {}
  private attributes = new Map<string, string>()

  setAttribute(name: string, value: string) { this.attributes.set(name, value) }
  toggleAttribute(name: string, force: boolean) {
    if (force) this.attributes.set(name, '')
    else this.attributes.delete(name)
  }
}

const selectors = [
  '[data-music-player]', '[data-soundcloud-player]', '[data-playback]',
  '[data-previous]', '[data-next]', '[data-music-status]', '[data-track-title]',
  '[data-track-artist]', '[data-track-position]', '[data-track-link]',
  '[data-track-progress]', '[data-current-time]', '[data-track-duration]',
] as const

function setupPlayer() {
  const elements = Object.fromEntries(selectors.map(selector => [selector, new FakeElement()])) as Record<typeof selectors[number], FakeElement>
  const listeners = new Map<string, (event: SoundCloudProgress) => void>()
  const load = vi.fn<(url: string, options: SoundCloudLoadOptions) => void>()
  const play = vi.fn()
  const pause = vi.fn()
  const seekTo = vi.fn()
  const widget: SoundCloudWidget = {
    bind: (event, listener) => { listeners.set(event, listener) },
    unbind: event => { listeners.delete(event) },
    load,
    play,
    pause,
    seekTo,
    setVolume: vi.fn(),
    getDuration: callback => callback(400_000),
    getCurrentSound: callback => callback({}),
  }
  const events = Object.fromEntries(['READY', 'PLAY', 'PAUSE', 'PLAY_PROGRESS', 'SEEK', 'FINISH', 'ERROR'].map(event => [event, event]))
  const Widget = Object.assign(vi.fn(() => widget), { Events: events })
  vi.stubGlobal('window', { SC: { Widget }, setTimeout, clearTimeout })
  vi.stubGlobal('document', { querySelector: (selector: string) => elements[selector as typeof selectors[number]] ?? null })
  let actions: MusicActions | undefined
  let state: MusicState | undefined
  const dispose = mountSoundCloud({
    onMusicActions: value => { actions = value },
    onMusicState: value => { state = value },
  })
  const emit = (event: string, currentPosition = 0) => listeners.get(event)?.({ currentPosition })
  return { elements, listeners, load, play, pause, seekTo, emit, dispose, get actions() { return actions! }, get state() { return state! } }
}

const disposals: Array<() => void> = []
afterEach(() => {
  disposals.splice(0).forEach(dispose => dispose())
  vi.unstubAllGlobals()
})

describe('SoundCloud playback', () => {
  it('starts on the first click, then seeks after playback progresses', async () => {
    const player = setupPlayer()
    disposals.push(player.dispose)
    await vi.waitFor(() => expect(player.listeners.has('READY')).toBe(true))
    player.emit('READY')

    const start = musicTracks.find(track => track.title === player.state.title)!.start
    player.elements['[data-playback]'].dispatchEvent(new Event('click'))
    expect(player.play).toHaveBeenCalledTimes(1)
    expect(player.seekTo).not.toHaveBeenCalled()
    expect(player.state.status).toBe('loading')

    player.emit('PLAY')
    expect(player.state.status).toBe('loading')
    player.emit('PLAY_PROGRESS', 500)
    expect(player.seekTo).toHaveBeenCalledWith(start)
    player.emit('PLAY_PROGRESS', start + 500)
    expect(player.state.status).toBe('playing')
    expect(player.state.confirmedPlaying).toBe(true)
  })

  it('requests autoplay on track change without a delayed play call', async () => {
    const player = setupPlayer()
    disposals.push(player.dispose)
    await vi.waitFor(() => expect(player.listeners.has('READY')).toBe(true))
    player.emit('READY')

    player.elements['[data-next]'].dispatchEvent(new Event('click'))
    const [url, options] = player.load.mock.lastCall!
    const start = musicTracks.find(track => track.url === url)!.start
    expect(options.auto_play).toBe(true)
    expect(player.play).not.toHaveBeenCalled()
    options.callback()
    player.emit('PLAY')
    expect(player.state.status).toBe('loading')
    player.emit('PLAY_PROGRESS', 500)
    expect(player.seekTo).toHaveBeenCalledWith(start)
    player.emit('PLAY_PROGRESS', start + 500)
    expect(player.state.status).toBe('playing')
    expect(player.play).not.toHaveBeenCalled()

    player.elements['[data-playback]'].dispatchEvent(new Event('click'))
    player.emit('PAUSE')
    expect(player.pause).toHaveBeenCalled()
    expect(player.state.status).toBe('paused')
    player.elements['[data-playback]'].dispatchEvent(new Event('click'))
    expect(player.play).toHaveBeenCalledTimes(1)
    expect(player.seekTo).toHaveBeenCalledTimes(1)
  })

  it('reports a blocked autoplay instead of claiming the new track is playing', async () => {
    vi.useFakeTimers()
    const player = setupPlayer()
    disposals.push(player.dispose)
    try {
      await Promise.resolve()
      await Promise.resolve()
      expect(player.listeners.has('READY')).toBe(true)
      player.emit('READY')
      player.elements['[data-next]'].dispatchEvent(new Event('click'))
      player.load.mock.lastCall![1].callback()
      player.emit('PLAY')
      player.emit('PAUSE')
      expect(player.state.status).toBe('loading')
      vi.advanceTimersByTime(15_000)
      expect(player.state.status).toBe('error')
      expect(player.state.playing).toBe(false)
      expect(player.elements['[data-playback]'].disabled).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })
})
