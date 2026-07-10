import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('icons.json validity', () => {
  it('should be valid JSON with consistent count metadata', () => {
    const manifestPath = path.resolve(process.cwd(), 'icons.json')
    const raw = fs.readFileSync(manifestPath, 'utf-8')
    const parsed = JSON.parse(raw)

    expect(parsed).toHaveProperty('version')
    expect(parsed).toHaveProperty('generatedAt')
    expect(Array.isArray(parsed.icons)).toBe(true)
    expect(parsed.totalCount).toBe(parsed.icons.length)
  })
})
