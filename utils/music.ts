export interface MusicTrack {
  title: string
  artist: string
  url: string
  start: number
}

export const musicTracks: MusicTrack[] = [
  {
    title: 'Aspects Of Rhythm',
    artist: 'Audio Junkies',
    url: 'https://soundcloud.com/maccabihouse/audio-junkies-aspects-of-rhythm-1',
    start: 182000,
  },
  {
    title: 'Wow',
    artist: 'Sako Isoyan',
    url: 'https://soundcloud.com/isoformance/sako-isoyan-wow',
    start: 175000,
  },
  {
    title: 'UFO On A Limousine',
    artist: 'Breezy S',
    url: 'https://soundcloud.com/user-956047264/breezy-s-ufo-on-a-limousine',
    start: 208000,
  },
  {
    title: 'Cold Case (ODTF002)',
    artist: 'Alpyren',
    url: 'https://soundcloud.com/recordeep-mag/premiere-alpyren-cold-case-odtf002',
    start: 119000,
  },
  {
    title: 'I Need (Rosa Red Remix)',
    artist: 'Known Artist',
    url: 'https://soundcloud.com/novajrec/premiere-known-artist-i-need-rosa-red-remix',
    start: 87000,
  },
  {
    title: 'Witch House [PHONICAM001]',
    artist: 'Voodoos and Taboos',
    url: 'https://soundcloud.com/trommelmusic/premiere-b1-voodoos-and-taboos-witch-house-phonicam001',
    start: 118000,
  },
  {
    title: 'Lime House',
    artist: 'Demi Riquísimo & Hammer',
    url: 'https://soundcloud.com/minitelofc/incoming-demi-riquisimo-hammer-lime-house-semidelicious',
    start: 178000,
  },
]

/** Shuffle a copy once per player mount, keeping next/previous navigation stable. */
export function shuffleMusicTracks(
  tracks: readonly MusicTrack[],
  random: () => number = Math.random,
): MusicTrack[] {
  const shuffled = [...tracks]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    const track = shuffled[index]!
    shuffled[index] = shuffled[target]!
    shuffled[target] = track
  }
  return shuffled
}

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
