/** A moving time window: the current audio position stays centered. */
export function getWaveformWindow(
  position: number,
  duration: number,
  sampleCount: number,
  width: number,
  windowDuration = 24_000,
) {
  if (duration <= 0 || sampleCount < 2 || width <= 0 || windowDuration <= 0)
    return null

  const current = Math.max(0, Math.min(duration, position))
  const pixelsPerMs = width / windowDuration
  const spacing = (duration / (sampleCount - 1)) * pixelsPerMs
  const offset = width / 2 - current * pixelsPerMs

  return {
    offset,
    spacing,
    first: Math.max(0, Math.floor(-offset / spacing)),
    last: Math.min(sampleCount - 1, Math.ceil((width - offset) / spacing)),
  }
}

/** Midpoint quadratic curves stay within the real samples' amplitude bounds. */
export function traceWaveformEdge(
  path: Pick<CanvasRenderingContext2D, 'lineTo' | 'quadraticCurveTo'>,
  samples: readonly number[],
  first: number,
  last: number,
  offset: number,
  spacing: number,
  baseline: number,
  amplitude: number,
) {
  const step = first <= last ? 1 : -1
  const x = (index: number) => offset + index * spacing
  const y = (index: number) => baseline + samples[index]! * amplitude
  path.lineTo(x(first), y(first))
  for (let i = first; i !== last; i += step) {
    path.quadraticCurveTo(
      x(i), y(i),
      (x(i) + x(i + step)) / 2,
      (y(i) + y(i + step)) / 2,
    )
  }
  path.quadraticCurveTo(x(last), y(last), x(last), y(last))
}
