export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ')
}

/** Index of the largest value in a numeric array. */
export function primaryDim(w: readonly number[]): number {
  let best = 0
  for (let i = 1; i < w.length; i++) if (w[i] > w[best]) best = i
  return best
}