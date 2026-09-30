import { describe, expect, it } from 'vitest'
import { musicPlaylistUrl, musicTracks, normalizeWaveform } from '../utils/music'

describe('SoundCloud playlist', () => {
  it('identifies the curated songs by SoundCloud ID in playlist order', () => {
    expect(musicPlaylistUrl).toBe('https://soundcloud.com/agalamusic/sets/portfolio')
    expect(musicTracks.map(({ id, title, artist }) => ({ id, title, artist }))).toEqual([
      { id: 1974108831, title: 'Cold Case (ODTF002)', artist: 'Alpyren' },
      { id: 709396003, title: 'Wow', artist: 'Sako Isoyan' },
      { id: 2263905473, title: 'UFO On A Limousine', artist: 'Breezy S' },
      { id: 1104511672, title: 'Witch House [PHONICAM001]', artist: 'Voodoos and Taboos' },
      { id: 1692099648, title: 'I Need (Rosa Red Remix)', artist: 'Known Artist' },
      { id: 1876217238, title: 'Aspects Of Rhythm', artist: 'Audio Junkies' },
      { id: 2222058083, title: 'Lime House', artist: 'Demi Riquísimo & Hammer' },
    ])
  })
})

describe('SoundCloud waveform data', () => {
  it('normalizes real amplitudes and bounds peaks without inventing shape', () => {
    expect(normalizeWaveform({ height: 140, samples: [0, 35, 70, 140, 200] }))
      .toEqual([0, 0.25, 0.5, 1, 1])
  })

  it.each([
    null, {}, { height: 0, samples: [1, 2] }, { height: Infinity, samples: [1, 2] },
    { height: 140, samples: [] }, { height: 140, samples: [1] },
    { height: 140, samples: [1, NaN] }, { height: 140, samples: [1, -1] },
    { height: 140, samples: [1, '2'] }, { height: 140, samples: new Array(100_001).fill(1) },
  ])('ignores malformed or oversized data', (value) => {
    expect(normalizeWaveform(value)).toBeNull()
  })
})
