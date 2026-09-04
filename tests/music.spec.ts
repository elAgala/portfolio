import { describe, expect, it } from 'vitest'
import { normalizeWaveform } from '../utils/music'

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
