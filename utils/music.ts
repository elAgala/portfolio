export interface MusicState {
  title: string
  artist: string
  url: string
  trackIndex: number
  waveformUrl: string | null
  status: 'paused' | 'loading' | 'playing' | 'error'
  message: string
  engaged: boolean
  disabled: boolean
  muted: boolean
  playing: boolean
  confirmedPlaying: boolean
  position: number
  duration: number
}

export interface MusicActions {
  togglePlayback: () => void
  next: () => void
  previous: () => void
  toggleMute: () => void
}

export interface MusicObserver {
  onMusicState?: (state: MusicState) => void
  onMusicActions?: (actions: MusicActions) => void
}

export const initialMusicState: MusicState = {
  title: '',
  artist: '',
  url: '',
  trackIndex: 0,
  waveformUrl: null,
  status: 'paused',
  message: 'Loading SoundCloud',
  engaged: false,
  disabled: true,
  muted: false,
  playing: false,
  confirmedPlaying: false,
  position: 0,
  duration: 0,
}

/** Accept only bounded, finite amplitude data; never fabricate a waveform. */
export function normalizeWaveform(value: unknown): number[] | null {
  if (!value || typeof value !== 'object') return null
  const { height, samples } = value as { height?: unknown; samples?: unknown }
  if (typeof height !== 'number' || !Number.isFinite(height) || height <= 0)
    return null
  if (!Array.isArray(samples) || samples.length < 2 || samples.length > 100_000)
    return null
  if (
    !samples.every(
      (sample) =>
        typeof sample === 'number' && Number.isFinite(sample) && sample >= 0,
    )
  )
    return null
  return samples.map((sample) => Math.min(1, sample / height))
}
