import { useNuxtApp } from '#imports';
import * as MarkDownIt from 'markdown-it';

export const useMd = (): MarkDownIt => useNuxtApp().$md