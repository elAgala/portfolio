import { describe, expect, it } from 'vitest'
import { musicTracks, normalizeWaveform } from '../utils/music'

describe('SoundCloud playlist', () => {
  it('keeps the six requested tracks and starting offsets', () => {
    expect(musicTracks.map(({ title, artist, start }) => ({ title, artist, start }))).toEqual([
      { title: 'Aspects Of Rhythm', artist: 'Audio Junkies', start: 182000 },
      { title: 'Wow', artist: 'Sako Isoyan', start: 175000 },
      { title: 'UFO On A Limousine', artist: 'Breezy S', start: 208000 },
      { title: 'Cold Case (ODTF002)', artist: 'Alpyren', start: 119000 },
      { title: 'I Need (Rosa Red Remix)', artist: 'Known Artist', start: 87000 },
      { title: 'Witch House [PHONICAM001]', artist: 'Voodoos and Taboos', start: 207000 },
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
