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
import { FlowchartMarkdownExtension } from './flowchart-markdown-extension'
import type { CompletionSource } from '@codemirror/autocomplete'

/**
 * Adds support for flow charts to the markdown rendering.
 */
export class FlowchartAppExtension extends AppExtension {
  buildMarkdownRendererExtensions(): MarkdownRendererExtension[] {
    return [new FlowchartMarkdownExtension()]
  }

  buildCheatsheetExtensions(): CheatsheetExtension[] {
    return [{ i18nKey: 'flowchart', categoryI18nKey: 'charts', readMoreUrl: new URL('https://flowchart.js.org/') }]
  }

  buildAutocompletion(): CompletionSource[] {
    return [basicCompletion(codeFenceRegex, '```flow\n\n```')]
  }
}
