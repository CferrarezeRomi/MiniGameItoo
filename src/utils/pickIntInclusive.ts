import { cryptoInt } from "./cryptoInt"
import { type Range } from "../interfaces/range"

export function pickIntInclusive(range: Range): number {
  const span = range.max - range.min + 1
  return range.min + cryptoInt(span)
}

export function pickIntInclusiveExcluding(range: Range, excluded: number): number {
  const span = range.max - range.min + 1
  if (span <= 1) return excluded

  // Pick from [0..span-2] and "skip over" excluded (no loops)
  const excludedOffset = excluded - range.min
  const r = cryptoInt(span - 1)
  const offset = r >= excludedOffset ? r + 1 : r
  return range.min + offset
}
