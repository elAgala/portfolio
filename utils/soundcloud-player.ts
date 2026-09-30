import { musicPlaylistUrl, musicTracks, type MusicObserver, type MusicState, type MusicTrack } from './music'
import type { SoundCloudAPI, SoundCloudSound, SoundCloudWidget } from '../types/soundcloud'
import { createListenerRegistry, requireElement } from './dom'

let apiRequest: Promise<void> | undefined

function loadApi(): Promise<void> {
  if (window.SC?.Widget) return Promise.resolve()
  if (apiRequest) return apiRequest
  apiRequest = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.async = true
    let settled = false
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      script.onload = null
      script.onerror = null
      if (error) {
        script.remove()
        reject(error)
      } else resolve()
    }
    const timeout = window.setTimeout(() => finish(new Error('SoundCloud timed out')), 8000)
    script.onload = () => finish(window.SC?.Widget ? undefined : new Error('SoundCloud API unavailable'))
    script.onerror = () => finish(new Error('SoundCloud unavailable'))
    document.head.appendChild(script)
  }).finally(() => { apiRequest = undefined })
  return apiRequest
}

function trackFromSound(sound: SoundCloudSound | null, index: number): MusicTrack {
  return musicTracks.find(track => track.id === sound?.id) ?? {
    id: sound?.id ?? index,
    title: sound?.title || `Track ${index + 1}`,
    artist: sound?.user?.username || 'SoundCloud',
    url: sound?.permalink_url || musicPlaylistUrl,
  }
}

export function mountSoundCloud({ onMusicState, onMusicActions }: MusicObserver): () => void {
  const disposals: Array<() => void> = []
  const listen = createListenerRegistry(disposals)
  const player = requireElement<HTMLElement>('[data-music-player]')
  const frame = requireElement<HTMLIFrameElement>('[data-soundcloud-player]')
  const playback = requireElement<HTMLButtonElement>('[data-playback]')
  const previous = requireElement<HTMLButtonElement>('[data-previous]')
  const next = requireElement<HTMLButtonElement>('[data-next]')
  const statusText = requireElement<HTMLElement>('[data-music-status]')
  const title = requireElement<HTMLElement>('[data-track-title]')
  const artist = requireElement<HTMLElement>('[data-track-artist]')
  const trackNumber = requireElement<HTMLElement>('[data-track-position]')
  const link = requireElement<HTMLAnchorElement>('[data-track-link]')
  const progress = requireElement<HTMLInputElement>('[data-track-progress]')
  const time = requireElement<HTMLElement>('[data-current-time]')
  const length = requireElement<HTMLElement>('[data-track-duration]')
  const options = { auto_play: false, buying: false, sharing: false, download: false, show_artwork: false, show_playcount: false, show_user: false }
  const widgetUrl = new URL('https://w.soundcloud.com/player/')
  widgetUrl.search = new URLSearchParams({ url: musicPlaylistUrl, ...Object.fromEntries(Object.entries(options).map(([key, value]) => [key, String(value)])) }).toString()

  let disposed = false
  let generation = 0
  let metadataRevision = 0
  let playbackAttempt = 0
  let widget: SoundCloudWidget | undefined
  let events: SoundCloudAPI['Widget']['Events'] | undefined
  let initializing = false
  let readingPlaylist = false
  let ready = false
  let intentToPlay = false
  let engaged = false
  let status: MusicState['status'] = 'loading'
  let errorMessage = ''
  let tracks = [...musicTracks]
  let sounds: SoundCloudSound[] = []
  let currentIndex = 0
  let requestedIndex: number | null = null
  let requestedAt = 0
  let position = 0
  let duration = 0
  let waveformUrl: string | null = null
  let baseline = 0
  let scrubbing = false
  let ended = false
  let loadTimer = 0
  let playTimer = 0
  let metadataTimer = 0
  let lastRender = 0
  const timers = new Set<number>()
  const pendingReads = new Set<() => void>()
  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => { timers.delete(timer); callback() }, delay)
    timers.add(timer)
    return timer
  }
  const cancel = (timer: number) => { window.clearTimeout(timer); timers.delete(timer) }
  const valid = (token: number) => !disposed && token === generation

  // Widget getters communicate asynchronously across the iframe boundary.
  const read = <T>(getter: (callback: (value: T) => void) => void, timeout = 2000): Promise<T | undefined> =>
    new Promise((resolve) => {
      let settled = false
      let timer = 0
      const abort = () => finish(undefined)
      const finish = (value: T | undefined) => {
        if (settled) return
        settled = true
        cancel(timer)
        pendingReads.delete(abort)
        resolve(value)
      }
      pendingReads.add(abort)
      timer = later(abort, timeout)
      try { getter(value => finish(value)) } catch { finish(undefined) }
    })

  const current = () => tracks[currentIndex] ?? musicTracks[0]!
  const formatTime = (value: number) => {
    const seconds = Math.max(0, Math.floor(value / 1000))
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  }
  const setText = (element: HTMLElement, value: string) => {
    if (element.textContent !== value) element.textContent = value
  }
  const render = () => {
    if (disposed) return
    lastRender = Date.now()
    const track = current()
    const playing = status === 'playing'
    const starting = status === 'starting'
    const message = status === 'error' ? errorMessage
      : status === 'loading' ? 'Loading SoundCloud player…'
        : starting ? `Starting ${(requestedIndex === null ? track : tracks[requestedIndex])?.title ?? track.title}`
          : playing ? (requestedIndex === null ? `Playing ${track.title} by ${track.artist}` : Date.now() - requestedAt < 2000 ? 'Music is playing; confirming the selected track…' : 'Music is playing; track details unavailable.')
            : `${track.title} ${ended ? 'finished' : 'paused'}`
    player.dataset.state = status
    setText(statusText, message)
    setText(title, track.title)
    setText(artist, status === 'error' ? 'SoundCloud unavailable · Retry Play' : `${track.artist} · SoundCloud`)
    setText(trackNumber, ready ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}` : '01 / --')
    link.href = track.url
    previous.disabled = next.disabled = !ready || tracks.length < 2
    playback.disabled = !ready && status !== 'error'
    playback.setAttribute('aria-pressed', String(playing))
    playback.setAttribute('aria-label', status === 'error' ? `Retry ${track.title}` : starting ? `Cancel starting ${track.title}` : `${playing ? 'Pause' : 'Play'} ${track.title} by ${track.artist}`)
    playback.toggleAttribute('aria-busy', status === 'loading' || starting)
    progress.disabled = !ready || duration <= 0 || requestedIndex !== null
    progress.max = String(duration || 1)
    progress.value = String(position)
    progress.setAttribute('aria-valuetext', `${formatTime(position)} of ${formatTime(duration)}`)
    setText(time, formatTime(position))
    setText(length, formatTime(duration))
    onMusicState?.({ title: track.title, artist: track.artist, url: track.url, trackIndex: currentIndex, waveformUrl, status, message, engaged, disabled: !ready, playing, confirmedPlaying: playing, position, duration })
  }
  const fail = (message: string) => {
    cancel(playTimer)
    cancel(metadataTimer)
    metadataRevision++
    playbackAttempt++
    intentToPlay = false
    status = 'error'
    errorMessage = message
    render()
  }
  const confirmPlayback = () => {
    cancel(playTimer)
    status = 'playing'
    render()
  }

  const syncMetadata = async () => {
    if (!widget || !ready || disposed) return
    cancel(metadataTimer)
    const token = generation
    const revision = ++metadataRevision
    const active = () => valid(token) && revision === metadataRevision
    const index = await read<number>(callback => widget!.getCurrentSoundIndex(callback))
    if (!active()) return
    if (!Number.isInteger(index) || index! < 0 || index! >= tracks.length || (requestedIndex !== null && index !== requestedIndex)) {
      if (requestedIndex !== null && Date.now() - requestedAt < 2000)
        metadataTimer = later(() => { void syncMetadata() }, 150)
      return
    }
    if (currentIndex !== index || requestedIndex !== null) {
      currentIndex = index!
      requestedIndex = null
      position = 0
      duration = 0
      baseline = 0
      ended = false
      waveformUrl = sounds[currentIndex]?.waveform_url ?? null
      render()
    }
    // Missing decoration or duration must never block PLAY_PROGRESS.
    void read<SoundCloudSound>(callback => widget!.getCurrentSound(callback)).then((sound) => {
      if (!active() || !sound || sound.id !== tracks[currentIndex]?.id) return
      tracks[currentIndex] = trackFromSound(sound, currentIndex)
      waveformUrl = sound.waveform_url ?? null
      render()
    })
    void read<number>(callback => widget!.getDuration(callback)).then((value) => {
      if (!active()) return
      duration = Number.isFinite(value) && value! > 0 ? value! : 0
      render()
    })
  }

  const armPlaybackTimeout = () => {
    cancel(playTimer)
    const token = generation
    const attempt = ++playbackAttempt
    const active = () => valid(token) && attempt === playbackAttempt && intentToPlay && status !== 'playing'
    playTimer = later(() => {
      void (async () => {
        if (!active() || !widget) return
        const [paused, firstPosition] = await Promise.all([
          read<boolean>(callback => widget!.isPaused(callback), 800),
          read<number>(callback => widget!.getPosition(callback), 800),
        ])
        if (!active()) return
        if (paused === false && Number.isFinite(firstPosition)) {
          await new Promise<void>(resolve => { later(resolve, 250) })
          if (!active()) return
          const secondPosition = await read<number>(callback => widget!.getPosition(callback), 800)
          if (!active()) return
          if (Number.isFinite(secondPosition) && secondPosition! > firstPosition!) {
            position = secondPosition!
            confirmPlayback()
            return
          }
        }
        // A failed acknowledgement is not permission to stop potentially working audio.
        if (active()) fail('Audio did not respond. Retry Play or open the track on SoundCloud.')
      })()
    }, 15000)
  }

  const unbindWidget = () => {
    if (widget && events) Object.values(events).forEach(event => widget!.unbind(event))
  }
  const failInitialization = (token: number, message: string) => {
    if (!valid(token)) return
    generation++
    initializing = false
    readingPlaylist = false
    ready = false
    cancel(loadTimer)
    pendingReads.forEach(abort => abort())
    fail(message)
  }
  const finishInitialization = async (token: number) => {
    if (!valid(token) || ready || readingPlaylist || !widget) return
    readingPlaylist = true
    const playlist = await read<SoundCloudSound[]>(callback => widget!.getSounds(callback), 12000)
    if (!valid(token)) return
    if (!Array.isArray(playlist) || playlist.length === 0) {
      failInitialization(token, 'The SoundCloud playlist is unavailable. Retry Play or open SoundCloud.')
      return
    }
    cancel(loadTimer)
    sounds = playlist
    tracks = sounds.map(trackFromSound)
    currentIndex = 0
    ready = true
    initializing = false
    readingPlaylist = false
    status = 'paused'
    widget.setVolume(80)
    waveformUrl = sounds[0]?.waveform_url ?? null
    render()
    void syncMetadata()
  }
  const bindWidget = (token: number) => {
    const active = () => valid(token) && ready
    const api = window.SC!
    events = api.Widget.Events
    widget!.bind(events.READY, () => { void finishInitialization(token) })
    widget!.bind(events.PLAY, () => {
      if (!active()) return
      if (!intentToPlay) { widget!.pause(); return }
      if (status === 'paused') {
        baseline = position
        status = 'starting'
        armPlaybackTimeout()
        render()
      }
      // PLAY can be repeated during a single start; it must not reset its deadline.
      void syncMetadata()
    })
    widget!.bind(events.PLAY_PROGRESS, (event) => {
      if (!active() || !intentToPlay || status === 'paused' || !Number.isFinite(event.currentPosition) || event.currentPosition < 0) return
      if (!scrubbing && requestedIndex === null) position = event.currentPosition
      if (event.currentPosition > baseline && status !== 'playing') confirmPlayback()
      else if (Date.now() - lastRender >= 100) render()
    })
    widget!.bind(events.PAUSE, () => {
      if (!active() || status === 'error' || (status === 'starting' && intentToPlay)) return
      cancel(playTimer)
      status = 'paused'
      render()
    })
    widget!.bind(events.SEEK, (event) => {
      if (!active() || scrubbing || requestedIndex !== null || !Number.isFinite(event.currentPosition)) return
      position = Math.max(0, event.currentPosition)
      render()
    })
    widget!.bind(events.FINISH, () => {
      if (!active() || requestedIndex !== null || !intentToPlay) return
      ended = true
      if (currentIndex === tracks.length - 1) {
        intentToPlay = false
        cancel(playTimer)
        status = 'paused'
      } else {
        status = 'starting'
        baseline = 0
        armPlaybackTimeout()
      }
      render()
    })
    widget!.bind(events.ERROR, () => {
      if (!valid(token)) return
      if (ready && !intentToPlay && status === 'paused') return
      if (!ready) failInitialization(token, 'SoundCloud is unavailable. Retry Play or open SoundCloud.')
      else fail(`${current().title} is unavailable. Try the next track or open SoundCloud.`)
    })
  }

  const initialize = async () => {
    if (disposed || initializing) return
    const token = ++generation
    initializing = true
    ready = false
    readingPlaylist = false
    intentToPlay = false
    metadataRevision++
    playbackAttempt++
    timers.forEach(timer => window.clearTimeout(timer))
    timers.clear()
    pendingReads.forEach(abort => abort())
    unbindWidget()
    requestedIndex = null
    position = duration = baseline = 0
    waveformUrl = null
    ended = false
    status = 'loading'
    render()
    loadTimer = later(() => failInitialization(token, 'SoundCloud took too long. Retry Play or open SoundCloud.'), 12000)
    if (!widget) frame.src = widgetUrl.href
    try {
      await loadApi()
      if (!valid(token)) return
      if (!widget) {
        widget = window.SC!.Widget(frame)
        bindWidget(token)
      } else {
        bindWidget(token)
        widget.load(musicPlaylistUrl, { ...options, callback: () => { void finishInitialization(token) } })
      }
    } catch {
      failInitialization(token, 'SoundCloud is unavailable. Retry Play or open SoundCloud.')
    }
  }

  const startPlayback = () => {
    if (!ready || !widget || disposed) return
    intentToPlay = true
    engaged = true
    ended = false
    baseline = position
    status = 'starting'
    render()
    armPlaybackTimeout()
    if (requestedIndex !== null) widget.skip(requestedIndex)
    widget.play()
    void syncMetadata()
  }
  const togglePlayback = () => {
    if (disposed) return
    if (!ready) { if (status === 'error') void initialize(); return }
    if (status === 'playing' || status === 'starting') {
      intentToPlay = false
      playbackAttempt++
      cancel(playTimer)
      status = 'paused'
      widget!.pause()
      render()
    } else startPlayback()
  }
  const skipTrack = (direction: number) => {
    if (disposed || !ready || !widget || tracks.length < 2) return
    requestedIndex = ((requestedIndex ?? currentIndex) + direction + tracks.length) % tracks.length
    requestedAt = Date.now()
    metadataRevision++
    position = duration = baseline = 0
    waveformUrl = null
    engaged = intentToPlay = true
    ended = false
    status = 'starting'
    render()
    armPlaybackTimeout()
    widget.skip(requestedIndex)
    widget.play()
    void syncMetadata()
  }

  listen(playback, 'click', togglePlayback)
  listen(previous, 'click', () => skipTrack(-1))
  listen(next, 'click', () => skipTrack(1))
  listen(progress, 'input', () => {
    scrubbing = true
    position = Math.min(duration, Math.max(0, Number(progress.value)))
    render()
  })
  listen(progress, 'change', () => {
    if (ready && duration > 0 && requestedIndex === null) widget!.seekTo(position)
    scrubbing = false
  })
  onMusicActions?.({ togglePlayback, next: () => skipTrack(1), previous: () => skipTrack(-1) })
  void initialize()
  return () => {
    disposed = true
    generation++
    timers.forEach(timer => window.clearTimeout(timer))
    timers.clear()
    pendingReads.forEach(abort => abort())
    widget?.pause()
    unbindWidget()
    disposals.forEach(dispose => dispose())
  }
}
