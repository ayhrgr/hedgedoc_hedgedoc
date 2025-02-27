/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CheatsheetExtension } from '../../../components/editor-page/cheatsheet/cheatsheet-extension'
import {
  basicCompletion,
  codeFenceRegex
} from '../../../components/editor-page/editor-pane/autocompletions/basic-completion'
import type { MarkdownRendererExtension } from '../../../components/markdown-renderer/extensions/base/markdown-renderer-extension'
import { AppExtension } from '../../base/app-extension'
import { GraphvizMarkdownExtension } from './graphviz-markdown-extension'
import type { CompletionSource } from '@codemirror/autocomplete'

/**
 * Adds support for graphviz to the markdown rendering.
 */
export class GraphvizAppExtension extends AppExtension {
  buildMarkdownRendererExtensions(): MarkdownRendererExtension[] {
    return [new GraphvizMarkdownExtension()]
  }

  buildCheatsheetExtensions(): CheatsheetExtension[] {
    return [{ i18nKey: 'graphviz', categoryI18nKey: 'charts', readMoreUrl: new URL('https://graphviz.org/') }]
  }

  buildAutocompletion(): CompletionSource[] {
    return [basicCompletion(codeFenceRegex, '```graphviz\n\n```')]
  }
}
