import { describe, expect, test } from 'vitest'
import { resolveOptions } from '../src/options'

describe('Options resolve', () => {
  test('react', () => {
    const options = resolveOptions({
      dirs: 'examples/next-style/src/pages',
      resolver: 'react',
    })
    expect(options).toMatchSnapshot({
      root: expect.any(String),
    })
  })
})
