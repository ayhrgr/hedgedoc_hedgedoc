/*
 * SPDX-FileCopyrightText: 2023 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { AppExtension } from '../../../../extensions/base/app-extension'
import type { CheatsheetExtension } from '../../../editor-page/cheatsheet/cheatsheet-extension'
import { basicCompletion } from '../../../editor-page/editor-pane/autocompletions/basic-completion'
import type { MarkdownRendererExtension } from '../base/markdown-renderer-extension'
import { BasicMarkdownSyntaxMarkdownExtension } from './basic-markdown-syntax-markdown-extension'
import type { CompletionSource } from '@codemirror/autocomplete'
import { t } from 'i18next'

export class BasicMarkdownSyntaxAppExtension extends AppExtension {
  buildMarkdownRendererExtensions(): MarkdownRendererExtension[] {
    return [new BasicMarkdownSyntaxMarkdownExtension()]
  }

  buildCheatsheetExtensions(): CheatsheetExtension[] {
    return [
      {
        i18nKey: 'basics.basicFormatting',
        categoryI18nKey: 'basic'
      },
      {
        i18nKey: 'basics.abbreviation',
        categoryI18nKey: 'basic'
      },
      {
        i18nKey: 'basics.footnote',
        categoryI18nKey: 'basic'
      },
      {
        i18nKey: 'basics.headlines',
        categoryI18nKey: 'basic',
        entries: [
          {
            i18nKey: 'hashtag'
          },
          {
            i18nKey: 'equal'
          }
        ]
      },
      {
        i18nKey: 'basics.code',
        categoryI18nKey: 'basic',
        entries: [{ i18nKey: 'inline' }, { i18nKey: 'block' }]
      },
      {
        i18nKey: 'basics.lists',
        categoryI18nKey: 'basic',
        entries: [{ i18nKey: 'unordered' }, { i18nKey: 'ordered' }]
      },
      {
        i18nKey: 'basics.images',
        categoryI18nKey: 'basic',
        entries: [{ i18nKey: 'basic' }, { i18nKey: 'size' }]
      },
      {
        i18nKey: 'basics.links',
        categoryI18nKey: 'basic'
      }
    ]
  }

  buildAutocompletion(): CompletionSource[] {
    return [basicCompletion(/(^|\s)\[/, '[](https://)', t('editor.autocompletions.link') ?? undefined)]
  }
}
