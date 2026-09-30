import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSoundCloud } from '../utils/soundcloud-player'
import { musicPlaylistUrl, musicTracks, type MusicActions, type MusicState } from '../utils/music'
import type { SoundCloudProgress, SoundCloudSound, SoundCloudWidget } from '../types/soundcloud'

class FakeElement extends EventTarget {
  textContent = ''
  disabled = false
  value = ''
  max = ''
  href = ''
  src = ''
  dataset: Record<string, string> = {}
  attributes = new Map<string, string>()
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  remove = vi.fn()
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
const settle = async () => { for (let index = 0; index < 12; index++) await Promise.resolve() }
const disposals: Array<() => void> = []

function setupPlayer(withApi = true) {
  const elements = Object.fromEntries(selectors.map(selector => [selector, new FakeElement()])) as Record<typeof selectors[number], FakeElement>
  const listeners = new Map<string, (event: SoundCloudProgress) => void>()
  const sounds: SoundCloudSound[] = musicTracks.slice(0, 6).map(track => ({
    id: track.id, title: track.title, permalink_url: track.url, user: { username: track.artist },
  }))
  let soundIndex = 0
  let position = 0
  let paused = true
  const play = vi.fn()
  const pause = vi.fn(() => { paused = true })
  const skip = vi.fn((index: number) => { soundIndex = index })
  const seekTo = vi.fn()
  const widget = {
    bind: (event: string, listener: (event: SoundCloudProgress) => void) => { listeners.set(event, listener) },
    unbind: (event: string) => { listeners.delete(event) },
    play, pause, skip, seekTo, setVolume: vi.fn(),
    load: vi.fn((_url: string, options: Parameters<SoundCloudWidget['load']>[1]) => { void Promise.resolve().then(options.callback) }),
    getDuration: vi.fn((callback: (duration: number) => void) => { void Promise.resolve().then(() => callback(400_000)) }),
    getSounds: vi.fn((callback: (sounds: SoundCloudSound[]) => void) => { void Promise.resolve().then(() => callback(sounds)) }),
    getCurrentSound: vi.fn((callback: (sound: SoundCloudSound) => void) => { const sound = sounds[soundIndex]!; void Promise.resolve().then(() => callback(sound)) }),
    getCurrentSoundIndex: vi.fn((callback: (index: number) => void) => { const index = soundIndex; void Promise.resolve().then(() => callback(index)) }),
    getPosition: vi.fn((callback: (value: number) => void) => { void Promise.resolve().then(() => callback(position)) }),
    isPaused: vi.fn((callback: (value: boolean) => void) => { void Promise.resolve().then(() => callback(paused)) }),
  } satisfies SoundCloudWidget
  const events = Object.fromEntries(['READY', 'PLAY', 'PAUSE', 'PLAY_PROGRESS', 'SEEK', 'FINISH', 'ERROR'].map(event => [event, event]))
  const Widget = Object.assign(vi.fn(() => widget), { Events: events })
  const fakeWindow = Object.assign(new EventTarget(), { SC: withApi ? { Widget } : undefined, setTimeout, clearTimeout })
  vi.stubGlobal('window', fakeWindow)
  const script = new FakeElement()
  const appendChild = vi.fn()
  vi.stubGlobal('document', {
    querySelector: (selector: string) => elements[selector as typeof selectors[number]] ?? null,
    createElement: () => script,
    head: { appendChild },
  })
  let actions: MusicActions | undefined
  let state: MusicState | undefined
  const dispose = mountSoundCloud({ onMusicActions: value => { actions = value }, onMusicState: value => { state = value } })
  disposals.push(dispose)
  const emit = (event: string, currentPosition = 0) => {
    if (event === 'PLAY') paused = false
    if (event === 'PAUSE') paused = true
    if (event === 'PLAY_PROGRESS') position = currentPosition
    listeners.get(event)?.({ currentPosition })
  }
  return {
    elements, listeners, sounds, widget, emit, dispose, script, appendChild, fakeWindow, Widget,
    setSoundIndex: (index: number) => { soundIndex = index },
    async ready() { await settle(); emit('READY'); await settle() },
    get actions() { return actions! }, get state() { return state! },
  }
}

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => {
  disposals.splice(0).forEach(dispose => dispose())
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('SoundCloud API playback', () => {
  it('starts at zero through the visible button and confirms actual progress', async () => {
    const p = setupPlayer()
    await p.ready()
    expect(new URL(p.elements['[data-soundcloud-player]'].src).searchParams.get('url')).toBe(musicPlaylistUrl)
    expect(p.elements['[data-track-position]'].textContent).toBe('01 / 06')
    p.elements['[data-playback]'].dispatchEvent(new Event('click'))
    expect(p.widget.play).toHaveBeenCalledTimes(1)
    expect(p.state.status).toBe('starting')
    expect(p.state.playing).toBe(false)
    expect(p.widget.seekTo).not.toHaveBeenCalled()
    p.emit('PLAY')
    p.emit('PLAY_PROGRESS', 500)
    expect(p.state.status).toBe('playing')
    expect(p.state.position).toBe(500)
    expect(p.state.confirmedPlaying).toBe(true)
  })

  it('keeps playing with missing duration or sound details', async () => {
    const p = setupPlayer()
    p.widget.getDuration.mockImplementation(() => {})
    p.widget.getCurrentSound.mockImplementation(() => {})
    await p.ready()
    p.actions.togglePlayback()
    p.emit('PLAY')
    p.emit('PLAY_PROGRESS', 1200)
    await vi.advanceTimersByTimeAsync(20_000)
    expect(p.state.status).toBe('playing')
    expect(p.state.position).toBe(1200)
    expect(p.state.duration).toBe(0)
    expect(p.elements['[data-track-progress]'].disabled).toBe(true)
    expect(p.widget.pause).not.toHaveBeenCalled()
  })

  it('cancels a pending start and rejects late play or progress events', async () => {
    const p = setupPlayer()
    await p.ready()
    p.actions.togglePlayback()
    expect(p.elements['[data-playback]'].attributes.get('aria-label')).toContain('Cancel')
    p.actions.togglePlayback()
    p.emit('PLAY')
    p.emit('PLAY_PROGRESS', 900)
    p.emit('ERROR')
    await vi.advanceTimersByTimeAsync(20_000)
    expect(p.state.status).toBe('paused')
    expect(p.state.position).toBe(0)
    expect(p.widget.pause).toHaveBeenCalled()
  })

  it('pauses and resumes without seeking or reloading', async () => {
    const p = setupPlayer()
    await p.ready()
    p.actions.togglePlayback()
    p.emit('PLAY_PROGRESS', 1234)
    p.actions.togglePlayback()
    expect(p.state.status).toBe('paused')
    p.emit('PAUSE')
    p.actions.togglePlayback()
    p.emit('PLAY_PROGRESS', 1234)
    expect(p.state.status).toBe('starting')
    p.emit('PLAY_PROGRESS', 1300)
    expect(p.state.status).toBe('playing')
    expect(p.widget.seekTo).not.toHaveBeenCalled()
    expect(p.widget.load).not.toHaveBeenCalled()
  })

  it('does not reset a confirmed start or its deadline on repeated PLAY', async () => {
    const p = setupPlayer()
    await p.ready()
    p.actions.togglePlayback()
    await vi.advanceTimersByTimeAsync(14_000)
    p.emit('PLAY')
    await vi.advanceTimersByTimeAsync(1300)
    await settle()
    expect(p.state.status).toBe('error')
    expect(p.widget.pause).not.toHaveBeenCalled()
    p.actions.togglePlayback()
    p.emit('PLAY_PROGRESS', 500)
    p.emit('PLAY')
    expect(p.state.status).toBe('playing')
  })

  it('checks real movement before reporting a missing progress acknowledgement', async () => {
    const p = setupPlayer()
    await p.ready()
    p.widget.isPaused.mockImplementation(callback => callback(false))
    let value = 100
    p.widget.getPosition.mockImplementation(callback => { callback(value); value += 200 })
    p.actions.togglePlayback()
    await vi.advanceTimersByTimeAsync(15_300)
    expect(p.state.status).toBe('playing')
    expect(p.state.position).toBe(300)
    expect(p.widget.pause).not.toHaveBeenCalled()
  })

  it('bounds missing watchdog getters and lets the user retry', async () => {
    const p = setupPlayer()
    await p.ready()
    p.widget.getPosition.mockImplementation(() => {})
    p.widget.isPaused.mockImplementation(() => {})
    p.actions.togglePlayback()
    await vi.advanceTimersByTimeAsync(16_000)
    expect(p.state.status).toBe('error')
    expect(p.elements['[data-playback]'].disabled).toBe(false)
    p.actions.togglePlayback()
    expect(p.widget.play).toHaveBeenCalledTimes(2)
  })

  it('uses the latest requested destination for rapid next clicks and ignores stale indexes', async () => {
    const p = setupPlayer()
    await p.ready()
    p.widget.skip.mockImplementation(() => {})
    p.actions.next()
    await settle() // The widget still reports the old index.
    p.actions.next()
    await settle()
    expect(p.widget.skip.mock.calls.map(([index]) => index)).toEqual([1, 2])
    p.setSoundIndex(2)
    p.emit('PLAY')
    await settle()
    p.emit('PLAY_PROGRESS', 400)
    expect(p.state.trackIndex).toBe(2)
    expect(p.state.title).toBe('UFO On A Limousine')
    expect(p.widget.load).not.toHaveBeenCalled()
  })

  it('ignores metadata from an older track request', async () => {
    const p = setupPlayer()
    await p.ready()
    const durations: Array<(value: number) => void> = []
    p.widget.getDuration.mockImplementation(callback => { durations.push(callback) })
    p.actions.next()
    await settle()
    p.actions.next()
    await settle()
    durations[0]!(999_000)
    await settle()
    expect(p.state.duration).toBe(0)
    durations[1]!(300_000)
    await settle()
    expect(p.state.duration).toBe(300_000)
    expect(p.state.trackIndex).toBe(2)
  })

  it('wraps manual navigation and leaves automatic advancement to SoundCloud', async () => {
    const p = setupPlayer()
    await p.ready()
    p.actions.previous()
    await settle()
    expect(p.widget.skip).toHaveBeenLastCalledWith(5)
    p.actions.next()
    await settle()
    expect(p.widget.skip).toHaveBeenLastCalledWith(0)
    p.emit('PLAY_PROGRESS', 400)
    p.emit('FINISH')
    expect(p.state.status).toBe('starting')
    p.setSoundIndex(1)
    p.emit('PAUSE')
    p.emit('PLAY')
    await settle()
    p.emit('PLAY_PROGRESS', 500)
    expect(p.state.trackIndex).toBe(1)
    expect(p.state.status).toBe('playing')
    expect(p.widget.skip).toHaveBeenCalledTimes(2)
    p.setSoundIndex(5)
    p.emit('PLAY')
    await settle()
    p.emit('FINISH')
    expect(p.state.status).toBe('paused')
    p.emit('PLAY_PROGRESS', 999)
    expect(p.state.status).toBe('paused')
  })

  it('allows another track after an audio error', async () => {
    const p = setupPlayer()
    await p.ready()
    p.actions.togglePlayback()
    p.emit('ERROR')
    expect(p.state.status).toBe('error')
    expect(p.state.disabled).toBe(false)
    p.actions.next()
    await settle()
    p.emit('PLAY_PROGRESS', 300)
    expect(p.state.status).toBe('playing')
  })

  it('bounds playlist loading after READY and reloads once on retry', async () => {
    const p = setupPlayer()
    const callbacks: Array<(value: SoundCloudSound[]) => void> = []
    p.widget.getSounds.mockImplementation(callback => { callbacks.push(callback) })
    await settle()
    await vi.advanceTimersByTimeAsync(11_000)
    p.emit('READY')
    await vi.advanceTimersByTimeAsync(1000)
    expect(p.state.status).toBe('error')
    expect(p.state.disabled).toBe(true)
    p.widget.getSounds.mockImplementation(callback => callback(p.sounds))
    p.actions.togglePlayback()
    p.actions.togglePlayback()
    await settle()
    callbacks[0]!(p.sounds)
    await settle()
    expect(p.widget.load).toHaveBeenCalledTimes(1)
    expect(p.state.status).toBe('paused')
    expect(p.Widget).toHaveBeenCalledTimes(1)
  })

  it('recovers from an empty playlist on retry', async () => {
    const p = setupPlayer()
    p.widget.getSounds.mockImplementation(callback => callback([]))
    await p.ready()
    expect(p.state.status).toBe('error')
    p.widget.getSounds.mockImplementation(callback => callback(p.sounds))
    p.actions.togglePlayback()
    await settle()
    expect(p.state.status).toBe('paused')
  })

  it('cleans up pending responses, listeners and deadlines on disposal', async () => {
    const p = setupPlayer()
    await p.ready()
    let oldDuration: ((value: number) => void) | undefined
    p.widget.getDuration.mockImplementation(callback => { oldDuration = callback })
    p.actions.togglePlayback()
    p.emit('PLAY')
    await settle()
    p.dispose()
    oldDuration?.(100_000)
    const snapshot = p.state
    p.actions.next()
    p.actions.togglePlayback()
    await vi.advanceTimersByTimeAsync(30_000)
    expect(p.listeners.size).toBe(0)
    expect(p.state).toEqual(snapshot)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('fails a missing API script after eight seconds and removes it', async () => {
    const p = setupPlayer(false)
    expect(p.appendChild).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(8000)
    expect(p.state.status).toBe('error')
    expect(p.script.remove).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('retries a failed API download and enables controls only after playlist validation', async () => {
    const p = setupPlayer(false)
    await vi.advanceTimersByTimeAsync(8000)
    p.actions.togglePlayback()
    p.actions.togglePlayback()
    expect(p.appendChild).toHaveBeenCalledTimes(2)
    p.fakeWindow.SC = { Widget: p.Widget }
    p.script.onload?.()
    await settle()
    expect(p.state.disabled).toBe(true)
    p.emit('READY')
    await settle()
    expect(p.state.status).toBe('paused')
    expect(p.state.disabled).toBe(false)
    expect(p.Widget).toHaveBeenCalledTimes(1)
  })
})
