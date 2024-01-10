import { type Options } from 'markdown-it';
import * as NuxtSchema from '@nuxt/schema';
import * as MarkDownIt from 'markdown-it';

interface ModuleOptions extends Options {
    runtime?: boolean
    preset: string
    linkify: boolean
    breaks: boolean
    use: Array<[string, Record<string, any>] | string>
}

declare module '#app' {
    interface NuxtApp {
        $md: MarkDownIt;
    }
}

declare module '@nuxt/schema' {
    interface NuxtConfig {
        ['markdownit']?: Partial<ModuleOptions>
    }
    interface NuxtOptions {
        ['markdownit']?: ModuleOptions
    }
}

declare const NuxtMarkdownIt: NuxtSchema.NuxtModule<ModuleOptions>

export {
    ModuleOptions,
    NuxtMarkdownIt as default
};