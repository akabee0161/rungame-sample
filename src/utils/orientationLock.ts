export async function lockLandscape(): Promise<void> {
  try {
    await screen.orientation.lock('landscape')
  } catch {
    // API 非対応または未許可 — 無視して続行
  }
}
