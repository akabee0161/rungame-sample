import {
  SCORE_PER_SECOND,
  COIN_SCORE,
  SPAWN_INTERVAL_START,
  SPAWN_INTERVAL_STEP,
  SPAWN_INTERVAL_MIN,
  DIFFICULTY_STEP_MS,
} from '../constants'

export function calculateScore(elapsedMs: number, coinCount: number): number {
  const timeScore = Math.floor(elapsedMs / 1000) * SCORE_PER_SECOND
  return timeScore + coinCount * COIN_SCORE
}

export function getSpawnInterval(elapsedMs: number): number {
  const steps = Math.floor(elapsedMs / DIFFICULTY_STEP_MS)
  const interval = SPAWN_INTERVAL_START - steps * SPAWN_INTERVAL_STEP
  return Math.max(interval, SPAWN_INTERVAL_MIN)
}
