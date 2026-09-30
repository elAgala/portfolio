export interface SoundCloudProgress {
  currentPosition: number
}

export interface SoundCloudSound {
  id?: number
  title?: string
  permalink_url?: string
  waveform_url?: string
  user?: { username?: string }
}

export interface SoundCloudWidget {
  bind: (event: string, listener: (event: SoundCloudProgress) => void) => void
  unbind: (event: string) => void
  play: () => void
  pause: () => void
  skip: (index: number) => void
  seekTo: (position: number) => void
  setVolume: (volume: number) => void
  load: (url: string, options: { callback: () => void; auto_play: boolean; buying: boolean; sharing: boolean; download: boolean; show_artwork: boolean; show_playcount: boolean; show_user: boolean }) => void
  isPaused: (callback: (paused: boolean) => void) => void
  getPosition: (callback: (position: number) => void) => void
  getDuration: (callback: (duration: number) => void) => void
  getSounds: (callback: (sounds: SoundCloudSound[]) => void) => void
  getCurrentSound: (callback: (sound: SoundCloudSound) => void) => void
  getCurrentSoundIndex: (callback: (index: number) => void) => void
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
