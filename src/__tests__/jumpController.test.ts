import { describe, it, expect } from 'vitest'
import { JumpController } from '../utils/jumpController'

describe('JumpController', () => {
  it('allows first jump from ground', () => {
    const ctrl = new JumpController(2)
    expect(ctrl.canJump()).toBe(true)
  })

  it('allows second jump in air', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(true)
  })

  it('prevents third jump', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(false)
  })

  it('resets jump count on landing', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    ctrl.onLand()
    expect(ctrl.canJump()).toBe(true)
    expect(ctrl.jumpsUsed).toBe(0)
  })

  it('tracks jumps used correctly', () => {
    const ctrl = new JumpController(2)
    expect(ctrl.jumpsUsed).toBe(0)
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(1)
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(2)
  })

  it('respects maxJumps = 1', () => {
    const ctrl = new JumpController(1)
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(false)
  })

  it('onJump does nothing when jumps exhausted', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(2)
  })
})
