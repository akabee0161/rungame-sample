import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lockLandscape } from '../utils/orientationLock'

describe('lockLandscape', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls screen.orientation.lock with "landscape"', async () => {
    const lockMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(screen, 'orientation', {
      value: { lock: lockMock },
      configurable: true,
    })
    await lockLandscape()
    expect(lockMock).toHaveBeenCalledWith('landscape')
  })

  it('does not throw when screen.orientation is undefined', async () => {
    Object.defineProperty(screen, 'orientation', {
      value: undefined,
      configurable: true,
    })
    await expect(lockLandscape()).resolves.toBeUndefined()
  })

  it('does not throw when lock() rejects', async () => {
    Object.defineProperty(screen, 'orientation', {
      value: { lock: vi.fn().mockRejectedValue(new Error('not allowed')) },
      configurable: true,
    })
    await expect(lockLandscape()).resolves.toBeUndefined()
  })
})
