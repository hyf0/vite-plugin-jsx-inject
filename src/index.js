// @ts-check
import { createFilter } from '@rollup/pluginutils'

export const queryRE = /\?.*$/s
export const hashRE = /#.*$/s
/**
 * 
 * @param {string} url 
 * @returns {string}
 */
export const cleanUrl = (url) =>
  url.replace(hashRE, '').replace(queryRE, '')

/**
 * @type {(injected: string) => import('vite').Plugin}
 */
const jsxInjectPlugin = (injected) =>  {
  /** @type {ReturnType<import('@rollup/pluginutils').CreateFilter>} */
  let filter
  /** @type {import('vite').ResolvedConfig} */
  let resolveConfig
  return {
    name: 'vite-jsx-inject',
    enforce: 'pre',
    configResolved(resolveConfig) {
      const esbuildOptions = resolveConfig.esbuild
      if (typeof esbuildOptions !== 'object') return
      if (typeof esbuildOptions.jsxInject === 'string') {
        throw new Error('Do not using vite.config.js#esbuild.jsxInject')
      }
      filter = createFilter(
        esbuildOptions.include || /\.(tsx?|jsx)$/,
        esbuildOptions.exclude || /\.js$/
      )
    },
    async transform(code, id) {
      if (!resolveConfig.esbuild || !injected || resolveConfig.command === 'build') return
      const jsxInject = injected
      if (filter(id) || filter(cleanUrl(id))) {
        if (jsxInject && /\.(?:j|t)sx\b/.test(id)) {
          code = jsxInject + ';' + code
        }
        return code
      }
    }
  }
}

module.exports = jsxInjectPlugin