import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserOptions as StyleXOptions } from '@stylexjs/unplugin'
import * as stylex from '@stylexjs/unplugin/vite'
import { fileURLToPath, URL } from 'node:url'

const stylexPlugin = stylex.default as unknown as (
  options: Partial<StyleXOptions>,
) => PluginOption

const stylexConstantsPath = fileURLToPath(
  new URL('./src/styles/constants.stylex.ts', import.meta.url),
)

// The dev CSS endpoint can be requested before Vite has traversed a consumer's
// imports. Register selector constants first so breakpoints never reach
// Lightning CSS as unresolved `var(...)` selectors.
const preloadStylexConstants = (): PluginOption => {
  let preload: Promise<void> | undefined

  return {
    name: 'preload-stylex-constants',
    apply: 'serve',
    enforce: 'pre',
    async transform(_code, id) {
      if (id.split('?')[0] === stylexConstantsPath) return null

      preload ??= (async () => {
        const constantsModule = await this.resolve(stylexConstantsPath)
        if (constantsModule) await this.load(constantsModule)
      })()
      await preload

      return null
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    preloadStylexConstants(),
    stylexPlugin({
      aliases: {
        '@/*': '/ROOT/src/*',
      },
      rewriteAliases: true,
      useCSSLayers: {
        before: ['reset'],
      },
    }),
    react(),
  ],
})
