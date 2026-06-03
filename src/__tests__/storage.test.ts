import { describe, it, expect, beforeEach } from 'vitest'
import { getHighScore, saveHighScore } from '../utils/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns 0 when no score has been saved', () => {
    expect(getHighScore()).toBe(0)
  })

  it('saves and retrieves a high score', () => {
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })

  it('does not overwrite when new score is lower', () => {
    saveHighScore(500)
    saveHighScore(300)
    expect(getHighScore()).toBe(500)
  })

  it('overwrites when new score is higher', () => {
    saveHighScore(300)
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })

  it('handles corrupted localStorage value gracefully', () => {
    localStorage.setItem('spaceRunner_highScore', 'invalid')
    expect(getHighScore()).toBe(0)
  })

  it('handles equal score without throwing', () => {
    saveHighScore(500)
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })
})
