import { describe, expect, it } from 'vitest'
import { getWaveformWindow, traceWaveformEdge } from '../utils/waveform'

describe('centered waveform timeline', () => {
  it('keeps the current sample at the center', () => {
    const view = getWaveformWindow(180_000, 360_000, 1801, 1200)!
    expect(view.offset + 900 * view.spacing).toBe(600)
  })

  it('moves the waveform left as playback advances', () => {
    const before = getWaveformWindow(180_000, 360_000, 1801, 1200)!
    const after = getWaveformWindow(181_000, 360_000, 1801, 1200)!
    expect(after.offset - before.offset).toBe(-50)
    expect(after.spacing).toBe(before.spacing)
  })

  it('keeps a 24-second window on mobile too', () => {
    const view = getWaveformWindow(180_000, 360_000, 1801, 390)!
    expect(view.offset + 900 * view.spacing).toBe(195)
    expect(view.last - view.first).toBe(120)
  })

  it('does not wrap or fabricate samples at track boundaries', () => {
    const start = getWaveformWindow(-1000, 360_000, 1801, 1200)!
    const end = getWaveformWindow(361_000, 360_000, 1801, 1200)!
    expect(start.first).toBe(0)
    expect(start.offset).toBe(600)
    expect(end.last).toBe(1800)
    expect(end.offset + 1800 * end.spacing).toBe(600)
  })

  it('waits for valid track and viewport dimensions', () => {
    expect(getWaveformWindow(0, 0, 1800, 1200)).toBeNull()
    expect(getWaveformWindow(0, 360_000, 1, 1200)).toBeNull()
    expect(getWaveformWindow(0, 360_000, 1800, 0)).toBeNull()
  })
})

describe('smooth waveform contour', () => {
  it.each([false, true])('keeps curves bounded in either direction: %s', (reverse) => {
    const samples = [0.2, 1, 0, 0.8, 0.3]
    const lines: number[][] = []
    const curves: number[][] = []
    const path = {
      lineTo: (...point: number[]) => { lines.push(point) },
      quadraticCurveTo: (...curve: number[]) => { curves.push(curve) },
    }
    traceWaveformEdge(path, samples, reverse ? 4 : 0, reverse ? 0 : 4, -10, 20, 100, 50)
    let start = lines[0]!
    expect(curves).toHaveLength(samples.length)
    for (const [cx, cy, x, y] of curves) {
      for (let step = 0; step <= 20; step++) {
        const t = step / 20
        const value = (1 - t) ** 2 * start[1]! + 2 * (1 - t) * t * cy! + t ** 2 * y!
        expect(value).toBeGreaterThanOrEqual(100)
        expect(value).toBeLessThanOrEqual(150)
      }
      expect(Number.isFinite(cx)).toBe(true)
      start = [x!, y!]
    }
    expect(start).toEqual(reverse ? [-10, 110] : [70, 115])
  })
})
