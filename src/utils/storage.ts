const HIGH_SCORE_KEY = 'spaceRunner_highScore'

export function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY)
  if (!stored) return 0
  const parsed = parseInt(stored, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function saveHighScore(score: number): void {
  if (score > getHighScore()) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString())
  }
}
