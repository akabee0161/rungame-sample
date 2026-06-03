import { describe, it, expect } from 'vitest'
import { calculateScore, getSpawnInterval } from '../utils/scoreManager'

describe('calculateScore', () => {
  it('returns 0 at start', () => {
    expect(calculateScore(0, 0)).toBe(0)
  })

  it('returns 10 per second of survival', () => {
    expect(calculateScore(1000, 0)).toBe(10)
    expect(calculateScore(5000, 0)).toBe(50)
  })

  it('returns 50 per coin collected', () => {
    expect(calculateScore(0, 1)).toBe(50)
    expect(calculateScore(0, 3)).toBe(150)
  })

  it('combines time score and coin score', () => {
    expect(calculateScore(3000, 2)).toBe(30 + 100)
  })

  it('truncates sub-second elapsed time', () => {
    expect(calculateScore(1999, 0)).toBe(10)
    expect(calculateScore(2000, 0)).toBe(20)
  })
})

describe('getSpawnInterval', () => {
  it('returns SPAWN_INTERVAL_START (2500) at time 0', () => {
    expect(getSpawnInterval(0)).toBe(2500)
  })

  it('reduces by 250ms at 20 seconds', () => {
    expect(getSpawnInterval(20_000)).toBe(2250)
  })

  it('reduces by 500ms at 40 seconds', () => {
    expect(getSpawnInterval(40_000)).toBe(2000)
  })

  it('does not go below SPAWN_INTERVAL_MIN (800)', () => {
    expect(getSpawnInterval(1_000_000)).toBe(800)
  })

  it('reaches minimum at 7th step (140 seconds)', () => {
    // (2500 - 800) / 250 = 6.8 → step 7 = 140s
    expect(getSpawnInterval(140_000)).toBe(800)
  })
})
