import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles.css', 'utf8')

function block(selector: RegExp): Record<string, string> {
  const m = selector.exec(css)
  if (!m) throw new Error(`no block for ${selector}`)
  const vars: Record<string, string> = {}
  for (const d of m[1].matchAll(/--([a-z-]+):\s*([^;]+);/g)) vars[d[1]] = d[2].trim()
  return vars
}

const light = block(/:root\s*\{([^}]*)\}/)
const dark = { ...light, ...block(/\.dark\s*\{([^}]*)\}/) }

function resolve(vars: Record<string, string>, name: string): string {
  let v = vars[name]
  for (let i = 0; i < 5 && v.startsWith('var('); i++) v = vars[v.slice(6, -1)]
  return v
}

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}
function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const PAIRS: Array<[string, string]> = [
  ['foreground', 'background'],
  ['foreground', 'card'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'card'],
  ['violet-ink', 'background'],
  ['violet-ink', 'card'],
  ['primary-foreground', 'primary'],
]

describe.each([
  ['light', light],
  ['dark', dark],
])('%s contrast', (_name, vars) => {
  it.each(PAIRS)('%s on %s is at least 4.5:1', (fg, bg) => {
    const f = resolve(vars, fg)
    const b = resolve(vars, bg)
    expect(f, `${fg} must be hex`).toMatch(/^#[0-9a-f]{6}$/i)
    expect(b, `${bg} must be hex`).toMatch(/^#[0-9a-f]{6}$/i)
    expect(ratio(f, b)).toBeGreaterThanOrEqual(4.5)
  })

  it('white on the ink panel is at least 4.5:1', () => {
    expect(ratio('#ffffff', resolve(vars, 'ink'))).toBeGreaterThanOrEqual(4.5)
  })
})
