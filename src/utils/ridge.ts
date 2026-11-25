const MAX_ELEVATION = 8849

export interface RidgePaths {
  back: string
  front: string
  snow: string
}

/** Силуэт всегда одинаков для одной вершины. */
export function ridgePaths(id: string, elevation: number): RidgePaths {
  const rand = seededRandom(id)
  const width = 300
  const height = 140
  const peakX = 120 + rand() * 60
  const peakY = height - (52 + 58 * (elevation / MAX_ELEVATION))

  const back = [`M0 ${height}`]
  for (let x = 0; x <= width; x += 30) back.push(`L${x} ${height - 30 - rand() * 35}`)
  back.push(`L${width} ${height} Z`)

  const leftX = peakX - 38
  const leftY = peakY + 30
  const rightX = peakX + 42
  const rightY = peakY + 34
  const front = [`M0 ${height}`, `L0 ${height - 22 - rand() * 12}`]
  for (let x = 30; x < leftX; x += 28) front.push(`L${x} ${lerp(height - 26, leftY, x / leftX) + jitter(rand, 8)}`)
  front.push(`L${leftX} ${leftY}`, `L${peakX} ${peakY}`, `L${rightX} ${rightY}`)
  for (let x = rightX + 28; x < width; x += 28) {
    front.push(`L${x} ${lerp(rightY, height - 24, (x - rightX) / (width - rightX)) + jitter(rand, 8)}`)
  }
  front.push(`L${width} ${height - 20 - rand() * 14}`, `L${width} ${height} Z`)

  const cap = 0.62
  const snowLeftX = peakX - 38 * cap
  const snowLeftY = peakY + 30 * cap
  const snowRightX = peakX + 42 * cap
  const snowRightY = peakY + 34 * cap
  const snow = [
    `M${peakX} ${peakY}`,
    `L${snowRightX} ${snowRightY}`,
    `L${peakX + 14} ${snowRightY - 5}`,
    `L${peakX + 5} ${snowRightY + 3}`,
    `L${peakX - 6} ${snowLeftY - 4}`,
    `L${peakX - 14} ${snowLeftY + 2}`,
    `L${snowLeftX} ${snowLeftY}`,
    'Z',
  ]

  return { back: back.join(' '), front: front.join(' '), snow: snow.join(' ') }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function jitter(rand: () => number, amount: number): number {
  return (rand() - 0.5) * 2 * amount
}

/** Mulberry32 с начальным числом из строки. */
function seededRandom(text: string): () => number {
  let seed = 0
  for (const ch of text) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
