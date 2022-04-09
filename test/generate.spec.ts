import { describe, expect, test } from 'vitest'
import { PageContext } from '../src/context'

const sensitivity = process.platform === 'win32' ? 'base' : 'variant'

function deepSortArray(arr: any[]) {
  const key = 'element'
  arr.forEach((i) => {
    if (i.children)
      i.children = deepSortArray(i.children)
  })
  if (arr.length === 1) return arr
  return arr.sort((a, b) => {
    return a[key] && b[key] ? a[key].localeCompare(b[key], 'en', { sensitivity }) : !(a[key] && b[key]) ? 0 : a[key] ? 1 : -1
  })
}

describe('Generate routes', () => {
  test('react - match snapshot', async() => {
    const ctx = new PageContext({
      dirs: 'examples/next-style/src/pages',
      resolver: 'react',
      onRoutesGenerated(routes) {
        // eslint-disable-next-line no-console
        routes = deepSortArray(routes)
        expect(routes).toMatchSnapshot('routes')
        return routes
      },
    })
    await ctx.searchGlob()
    const routes = await ctx.resolveRoutes()

    expect(routes).toMatchSnapshot('client code')
  })

  describe('routeStyle', () => {
    test('nuxt style match snapshot', async() => {
      const ctx = new PageContext({
        dirs: 'examples/nuxt-style/src/pages',
        routeStyle: 'nuxt',
        resolver: 'react',
        onRoutesGenerated(routes) {
        // eslint-disable-next-line no-console
          routes = deepSortArray(routes)
          expect(routes).toMatchSnapshot('routes')
          return routes
        },
      })
      await ctx.searchGlob()
      const routes = await ctx.resolveRoutes()

      expect(routes).toMatchSnapshot('client code')
    })

    test('remix Style match snapshot', async() => {
      const ctx = new PageContext({
        dirs: 'examples/remix-style/src/pages',
        routeStyle: 'remix',
        resolver: 'react',
        onRoutesGenerated(routes) {
        // eslint-disable-next-line no-console
          routes = deepSortArray(routes)
          expect(routes).toMatchSnapshot('routes')
          return routes
        },
      })
      await ctx.searchGlob()
      const routes = await ctx.resolveRoutes()

      expect(routes).toMatchSnapshot('client code')
    })
  })
})
