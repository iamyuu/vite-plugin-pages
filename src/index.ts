import { MODULE_ID_VIRTUAL } from './constants'
import { PageContext } from './context'

import { parsePageRequest } from './utils'
import type { UserOptions } from './types'
import type { Plugin } from 'vite'

function pagesPlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext

  return {
    name: 'vite-plugin-pages',
    enforce: 'pre',
    async configResolved(config) {
      userOptions.resolver = 'react'

      ctx = new PageContext(userOptions, config.root)
      ctx.setLogger(config.logger)
      await ctx.searchGlob()
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    resolveId(id) {
      if (ctx.options.moduleIds.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`

      return null
    },
    async load(id) {
      const {
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId))
        return ctx.resolveRoutes()

      return null
    },
  }
}

export * from './types'
export type { ReactRoute } from './resolvers'

export { syncIndexResolver } from './options'
export { PageContext }
export default pagesPlugin
