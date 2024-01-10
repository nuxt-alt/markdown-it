import { defineNuxtModule, addPluginTemplate, addTemplate, createResolver, addImports } from '@nuxt/kit'
import { name, version } from '../package.json'
import { serialize } from '@refactorjs/serialize'
import type { ModuleOptions } from './types'
import { defu } from 'defu'

const CONFIG_KEY = 'markdownit'

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name,
        version,
        configKey: CONFIG_KEY,
        compatibility: {
            nuxt: '^3.0.0'
        }
    },
    defaults: {
        runtime: true,
        preset: 'default',
        linkify: true,
        breaks: true,
        use: []
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);
        const moduleConfig = (nuxt.options.runtimeConfig.markdownit = defu(nuxt.options.runtimeConfig.markdownit as any, options)) as ModuleOptions

        // Inject options via virtual template
        nuxt.options.alias['#nuxt-markdownit-options'] = addTemplate({
            filename: 'nuxt-markdownit-options.mjs',
            write: true,
            getContents: () => `export const options = ${serialize(moduleConfig, { space: 4 })}`
        }).dst

        addImports([
            { from: resolver.resolve('runtime/composables'), name: 'useMd' },
        ])

        addPluginTemplate({
            filename: 'nuxt-markdownit-plugin.mjs',
            write: nuxt.options.dev,
            getContents: () => plugin(moduleConfig)
        })
    }
})

const plugin = (moduleConfig: ModuleOptions) => {
    return `import { defineNuxtPlugin } from '#imports'
//@ts-expect-error: virtual file
import { options } from '#nuxt-markdownit-options'
const handlePlugin = (plugin) => plugin.default || plugin

export default defineNuxtPlugin(async (nuxtApp) => {
    const MarkdownIt = await import('markdown-it').then(md => md.default || md)
    let pluginOptions = options
    let preset = pluginOptions.preset || 'default'
    delete pluginOptions.preset
    delete pluginOptions.use

    if (Object.keys(pluginOptions).length === 0) pluginOptions = undefined;

    const md = new MarkdownIt(preset, pluginOptions)

    ${moduleConfig.use.map(config => {
        const hasOpts = Array.isArray(config)
        const plugin = hasOpts ? config.shift() : config
        const opts = hasOpts ? config : []
        return `md.use(handlePlugin(await import('${plugin}')), ${serialize(opts, { space: 4 })})`
    }).join('\n')}
    nuxtApp.provide('md', md)
})
`
}
