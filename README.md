# markdown-it for Nuxt 3

This is an alternaive module for @nuxtjs/markdownit.

## Setup
1. Add the `@nuxt-alt/markdown-it` dependency to your project

```bash
yarn add @nuxt-alt/markdown-it
```

2. Add `@nuxt-alt/markdown-it` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/markdown-it'
    ],
    // [optional] markdownit options
    // See https://github.com/markdown-it/markdown-it
    markdownit: {
        preset: 'default',
        linkify: true,
        breaks: true,
        use: [
            'markdown-it-div',
            ['markdown-it-attrs', { ...options }]
        ]
    }
});
```

## Usage

### Using `$md` to render markdown

`nuxt.config.ts`:
```ts
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/markdown-it'
    ],
    markdownit: {
        runtime: true
    }
});
```

`hello.vue`:
```html
<template>
  <div v-html="$md.render(model)"></div>
</template>

<script lang="ts" setup>
const model = '# Hello World!'
</script>
```