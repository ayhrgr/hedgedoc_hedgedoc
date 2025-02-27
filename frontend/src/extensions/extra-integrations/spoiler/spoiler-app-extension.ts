/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CheatsheetExtension } from '../../../components/editor-page/cheatsheet/cheatsheet-extension'
import { basicCompletion } from '../../../components/editor-page/editor-pane/autocompletions/basic-completion'
import type { MarkdownRendererExtension } from '../../../components/markdown-renderer/extensions/base/markdown-renderer-extension'
import { AppExtension } from '../../base/app-extension'
import { SpoilerMarkdownExtension } from './spoiler-markdown-extension'
import type { CompletionSource } from '@codemirror/autocomplete'
import { t } from 'i18next'

const spoilerRegex = /(?:^|\s):(?::|::|::\w+)?/

/**
 * Adds support for html spoiler tags.
 *
 * @see https://www.w3schools.com/tags/tag_details.asp
 */
export class SpoilerAppExtension extends AppExtension {
  buildMarkdownRendererExtensions(): MarkdownRendererExtension[] {
    return [new SpoilerMarkdownExtension()]
  }

  buildCheatsheetExtensions(): CheatsheetExtension[] {
    return [{ i18nKey: 'spoiler' }]
  }

  buildAutocompletion(): CompletionSource[] {
    return [
      basicCompletion(spoilerRegex, ':::spoiler Label text\n\n:::', t('editor.autocompletions.spoiler') ?? undefined)
    ]
  }
}
