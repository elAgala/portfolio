export interface SoundCloudProgress {
  currentPosition: number
}

export interface SoundCloudSound {
  waveform_url?: string
}

export interface SoundCloudLoadOptions {
  auto_play: boolean
  buying: boolean
  sharing: boolean
  download: boolean
  show_artwork: boolean
  show_playcount: boolean
  show_user: boolean
  callback: () => void
}

export interface SoundCloudWidget {
  bind: (event: string, listener: (event: SoundCloudProgress) => void) => void
  unbind: (event: string) => void
  load: (url: string, options: SoundCloudLoadOptions) => void
  play: () => void
  pause: () => void
  seekTo: (position: number) => void
  setVolume: (volume: number) => void
  getDuration: (callback: (duration: number) => void) => void
  getCurrentSound: (callback: (sound: SoundCloudSound) => void) => void
}

export interface SoundCloudAPI {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: Record<
      | 'READY'
      | 'PLAY'
      | 'PAUSE'
      | 'PLAY_PROGRESS'
      | 'SEEK'
      | 'FINISH'
      | 'ERROR',
      string
    >
  }
}

declare global {
  interface Window {
    SC?: SoundCloudAPI
  }
}
