import { musicTracks, type MusicObserver, type MusicState } from './music'
import type { SoundCloudAPI } from '../types/soundcloud'
import { createListenerRegistry, requireElement } from './dom'

export function mountSoundCloud({
  onMusicState,
  onMusicActions,
}: MusicObserver): () => void {
  const disposals: Array<() => void> = []
  const listen = createListenerRegistry(disposals)
  let disposed = false
  const initializeMusic = async () => {
    const musicPlayer = requireElement<HTMLElement>('[data-music-player]')
    const soundcloudFrame = requireElement<HTMLIFrameElement>(
      '[data-soundcloud-player]',
    )
    const playbackButton = requireElement<HTMLButtonElement>('[data-playback]')
    const previousButton = requireElement<HTMLButtonElement>('[data-previous]')
    const nextButton = requireElement<HTMLButtonElement>('[data-next]')
    const muteButton = requireElement<HTMLButtonElement>('[data-mute]')
    const musicStatus = requireElement<HTMLElement>('[data-music-status]')
    const trackTitle = requireElement<HTMLElement>('[data-track-title]')
    const trackArtist = requireElement<HTMLElement>('[data-track-artist]')
    const trackPosition = requireElement<HTMLElement>('[data-track-position]')
    const trackLink = requireElement<HTMLAnchorElement>('[data-track-link]')
    const trackProgress = requireElement<HTMLInputElement>(
      '[data-track-progress]',
    )
    const currentTime = requireElement<HTMLElement>('[data-current-time]')
    const trackDuration = requireElement<HTMLElement>('[data-track-duration]')

    const tracks = musicTracks
    let currentTrack = 0
    let playing = false
    let muted = false
    let widgetReady = false
    let loadingTrack = false
    let duration = 0
    let scrubbing = false
    let pendingStart: number | null = tracks[0]!.start
    let position = tracks[0]!.start
    let waveformUrl: string | null = null
    let engaged = false
    let confirmedPlaying = false
    let controlsDisabled = true
    let trackVersion = 0
    let playerState: MusicState['status'] = 'paused'

    const publishMusic = () => {
      if (disposed) return
      onMusicState?.({
        title: current().title,
        artist: current().artist,
        url: current().url,
        trackIndex: currentTrack,
        waveformUrl,
        engaged,
        muted,
        playing,
        confirmedPlaying,
        disabled: controlsDisabled,
        status: playerState,
        message: musicStatus.textContent ?? '',
        position,
        duration,
      })
    }

    const current = () => tracks[currentTrack]!

    const formatTime = (milliseconds: number) => {
      const seconds = Math.max(0, Math.floor(milliseconds / 1000))
      return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
    }

    const renderTimeline = (nextPosition: number) => {
      const safePosition = Math.min(
        Math.max(0, nextPosition),
        duration || nextPosition,
      )
      position = safePosition
      trackProgress.max = String(duration || 1)
      trackProgress.value = String(safePosition)
      currentTime.textContent = formatTime(safePosition)
      trackDuration.textContent = formatTime(duration)
      trackProgress.setAttribute(
        'aria-valuetext',
        `${formatTime(safePosition)} of ${formatTime(duration)}`,
      )
      publishMusic()
    }

    const renderTrack = () => {
      const track = current()
      trackTitle.textContent = track.title
      trackArtist.textContent = `${track.artist} · SoundCloud`
      trackPosition.textContent = `${String(currentTrack + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`
      trackLink.href = track.url
      playbackButton.setAttribute('aria-pressed', String(playing))
      playbackButton.setAttribute(
        'aria-label',
        playing
          ? `Pause ${track.title} by ${track.artist}`
          : `Play ${track.title} by ${track.artist}`,
      )
      muteButton.setAttribute('aria-pressed', String(muted))
      muteButton.setAttribute(
        'aria-label',
        muted ? 'Unmute audio' : 'Mute audio',
      )
      publishMusic()
    }

    const setControlsDisabled = (disabled: boolean) => {
      controlsDisabled = disabled
      previousButton.disabled = disabled
      playbackButton.disabled = disabled
      nextButton.disabled = disabled
      muteButton.disabled = disabled
      trackProgress.disabled = disabled
      publishMusic()
    }

    const setPlayerState = (state: MusicState['status'], status: string) => {
      playerState = state
      if (state !== 'playing') confirmedPlaying = false
      musicPlayer.dataset.state = state
      musicStatus.textContent = status
      playbackButton.toggleAttribute('aria-busy', state === 'loading')
      publishMusic()
    }

    renderTrack()

    try {
      if (!window.SC?.Widget)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://w.soundcloud.com/player/api.js'
          const timer = window.setTimeout(
            () => reject(new Error('SoundCloud timed out')),
            15000,
          )
          script.onload = () => {
            clearTimeout(timer)
            resolve()
          }
          script.onerror = () => {
            clearTimeout(timer)
            reject(new Error('SoundCloud unavailable'))
          }
          document.head.appendChild(script)
          disposals.push(() => {
            clearTimeout(timer)
            script.remove()
            reject(new Error('Disposed'))
          })
        })
    } catch {
      if (disposed) return
    }
    if (disposed) return
    const api: SoundCloudAPI | undefined = window.SC
    if (!api?.Widget) {
      setPlayerState(
        'error',
        'SoundCloud playback unavailable. Open the track title to listen on SoundCloud.',
      )
      setControlsDisabled(true)
    } else {
      const widget = api.Widget(soundcloudFrame)
      const readMetadata = () => {
        const version = trackVersion
        widget.getCurrentSound((sound) => {
          if (disposed || version !== trackVersion) return
          waveformUrl = sound?.waveform_url || null
          publishMusic()
        })
      }
      let loadTimeout = 0
      let playbackTimeout = 0
      let playbackStart = 0
      const armLoadTimeout = () => {
        clearTimeout(loadTimeout)
        loadTimeout = window.setTimeout(() => {
          if (disposed) return
          loadingTrack = false
          playing = false
          renderTrack()
          setControlsDisabled(false)
          setPlayerState(
            'error',
            'SoundCloud took too long. Retry Play or open the track title.',
          )
        }, 20000)
      }
      armLoadTimeout()
      disposals.push(() => {
        clearTimeout(loadTimeout)
        clearTimeout(playbackTimeout)
        widget.pause()
        Object.values(api.Widget.Events).forEach((event) =>
          widget.unbind(event),
        )
      })

      const loadTrack = (index: number, shouldPlay: boolean) => {
        if (disposed || loadingTrack) return
        const version = ++trackVersion
        waveformUrl = null
        confirmedPlaying = false
        if (shouldPlay) engaged = true
        clearTimeout(playbackTimeout)
        armLoadTimeout()
        currentTrack = (index + tracks.length) % tracks.length
        playing = false
        loadingTrack = true
        duration = 0
        pendingStart = current().start
        renderTrack()
        renderTimeline(current().start)
        setControlsDisabled(true)
        setPlayerState('loading', `Loading ${current().title}`)

        widget.load(current().url, {
          auto_play: false,
          buying: false,
          sharing: false,
          download: false,
          show_artwork: false,
          show_playcount: false,
          show_user: false,
          callback: () => {
            if (disposed || version !== trackVersion) return
            clearTimeout(loadTimeout)
            widget.setVolume(muted ? 0 : 80)
            widget.getDuration((value) => {
              if (disposed || version !== trackVersion) return
              duration = value
              renderTimeline(current().start)
            })
            readMetadata()
            loadingTrack = false
            widgetReady = true
            setControlsDisabled(false)
            setPlayerState(
              'paused',
              `${current().title} ready at selected start`,
            )
            if (shouldPlay) startPlayback()
          },
        })
      }

      widget.bind(api.Widget.Events.READY, () => {
        if (disposed || loadingTrack) return
        clearTimeout(loadTimeout)
        widgetReady = true
        const version = trackVersion
        readMetadata()
        widget.setVolume(muted ? 0 : 80)
        widget.getDuration((value) => {
          if (disposed || version !== trackVersion) return
          duration = value
          renderTimeline(current().start)
        })
        setControlsDisabled(false)
        setPlayerState('paused', `${current().title} ready at selected start`)
      })

      widget.bind(api.Widget.Events.PLAY, () => {
        if (disposed || loadingTrack) return
        playing = true
        renderTrack()
        setPlayerState(
          'playing',
          `Playing ${current().title} by ${current().artist}`,
        )
      })

      widget.bind(api.Widget.Events.PAUSE, () => {
        if (disposed || loadingTrack || musicPlayer.dataset.state === 'error')
          return
        playing = false
        renderTrack()
        setPlayerState('paused', `${current().title} paused`)
      })

      widget.bind(api.Widget.Events.PLAY_PROGRESS, (event) => {
        if (disposed || loadingTrack) return
        if (playing && engaged && event.currentPosition > position + 10)
          confirmedPlaying = true
        if (event.currentPosition > playbackStart + 250)
          clearTimeout(playbackTimeout)
        if (!scrubbing) renderTimeline(event.currentPosition)
      })

      widget.bind(api.Widget.Events.SEEK, (event) => {
        if (disposed || loadingTrack || scrubbing) return
        renderTimeline(event.currentPosition)
      })

      widget.bind(api.Widget.Events.FINISH, () => {
        loadTrack(currentTrack + 1, true)
      })

      widget.bind(api.Widget.Events.ERROR, () => {
        clearTimeout(loadTimeout)
        clearTimeout(playbackTimeout)
        playing = false
        loadingTrack = false
        renderTrack()
        setControlsDisabled(false)
        setPlayerState(
          'error',
          `${current().title} is unavailable. Retry Play, choose another track or open the track title.`,
        )
      })

      const startPlayback = () => {
        engaged = true
        confirmedPlaying = false
        publishMusic()
        clearTimeout(playbackTimeout)
        playbackStart = pendingStart ?? Number(trackProgress.value)
        playbackTimeout = window.setTimeout(() => {
          if (disposed) return
          widget.pause()
          playing = false
          pendingStart = playbackStart
          renderTrack()
          setPlayerState(
            'error',
            'Audio could not start. Retry Play or open the track title on SoundCloud.',
          )
        }, 15000)
        // Seeking on READY can trigger playback before a user gesture.
        // Apply the requested offset only when playback is requested.
        if (pendingStart !== null) {
          widget.seekTo(pendingStart)
          pendingStart = null
        }
        widget.play()
      }

      const togglePlayback = () => {
        if (disposed || controlsDisabled) return
        engaged = true
        if (musicPlayer.dataset.state === 'error') {
          loadTrack(currentTrack, true)
          return
        }
        if (!widgetReady || loadingTrack) return
        if (playing) {
          clearTimeout(playbackTimeout)
          widget.pause()
        } else {
          setPlayerState('loading', `Starting ${current().title}`)
          startPlayback()
        }
      }
      listen(playbackButton, 'click', togglePlayback)

      listen(previousButton, 'click', () => loadTrack(currentTrack - 1, true))
      listen(nextButton, 'click', () => loadTrack(currentTrack + 1, true))

      listen(trackProgress, 'input', () => {
        scrubbing = true
        renderTimeline(Number(trackProgress.value))
      })

      listen(trackProgress, 'change', () => {
        widget.seekTo(Number(trackProgress.value))
        scrubbing = false
        musicStatus.textContent = `${current().title} moved to ${currentTime.textContent}`
      })

      const toggleMute = () => {
        if (disposed || controlsDisabled) return
        muted = !muted
        widget.setVolume(muted ? 0 : 80)
        renderTrack()
        musicStatus.textContent = muted ? 'Sound muted' : 'Sound on'
        publishMusic()
      }
      listen(muteButton, 'click', toggleMute)
      onMusicActions?.({
        togglePlayback,
        toggleMute,
        next: () => {
          if (!controlsDisabled) loadTrack(currentTrack + 1, true)
        },
        previous: () => {
          if (!controlsDisabled) loadTrack(currentTrack - 1, true)
        },
      })
    }
  }
  void initializeMusic()

  return () => {
    disposed = true
    disposals.forEach((dispose) => dispose())
  }
}
