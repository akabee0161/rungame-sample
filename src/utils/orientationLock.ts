export async function lockLandscape(): Promise<void> {
  try {
    // 一部ブラウザで Promise が settle しないまま hang する場合があるため
    // 500ms のタイムアウトを設けて必ずゲームへ進む
    const lockPromise = screen.orientation.lock('landscape').catch(() => {})
    const timeout = new Promise<void>(resolve => setTimeout(resolve, 500))
    await Promise.race([lockPromise, timeout])
  } catch {
    // API 非対応または未許可 — 無視して続行
  }
}
