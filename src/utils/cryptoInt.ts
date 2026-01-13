export function cryptoInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0

  const cryptoObj =
    typeof window !== 'undefined'
      ? (window.crypto ?? (window as unknown as { crypto?: Crypto }).crypto)
      : undefined

  if (!cryptoObj?.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive)
  }

  // Rejection sampling (avoids modulo bias)
  const maxUint32 = 0xffffffff
  const limit = Math.floor((maxUint32 + 1) / maxExclusive) * maxExclusive

  const buf = new Uint32Array(1)
  let x = 0
  do {
    cryptoObj.getRandomValues(buf)
    x = buf[0] ?? 0
  } while (x >= limit)

  return x % maxExclusive
}
