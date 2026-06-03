export class JumpController {
  private count = 0
  readonly maxJumps: number

  constructor(maxJumps = 2) {
    this.maxJumps = maxJumps
  }

  canJump(): boolean {
    return this.count < this.maxJumps
  }

  onJump(): void {
    if (this.canJump()) this.count++
  }

  onLand(): void {
    this.count = 0
  }

  get jumpsUsed(): number {
    return this.count
  }
}
