/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CheatsheetExtension } from '../../../components/editor-page/cheatsheet/cheatsheet-extension'
import { basicCompletion } from '../../../components/editor-page/editor-pane/autocompletions/basic-completion'
import type { MarkdownRendererExtension } from '../../../components/markdown-renderer/extensions/base/markdown-renderer-extension'
import { AppExtension } from '../../base/app-extension'
import { AlertMarkdownExtension } from './alert-markdown-extension'
import type { CompletionSource } from '@codemirror/autocomplete'
import { t } from 'i18next'

const alertRegex = /(?:^|\s):(?::|::|::\w+)?/

/**
 * Adds alert boxes to the markdown rendering.
 */
export class AlertAppExtension extends AppExtension {
  buildMarkdownRendererExtensions(): MarkdownRendererExtension[] {
    return [new AlertMarkdownExtension()]
  }

  buildCheatsheetExtensions(): CheatsheetExtension[] {
    return [{ i18nKey: 'alert' }]
  }

  buildAutocompletion(): CompletionSource[] {
    return [
      basicCompletion(alertRegex, ':::success\n\n:::', t('editor.autocompletions.successBox') ?? undefined),
      basicCompletion(alertRegex, ':::info\n\n:::', t('editor.autocompletions.infoBox') ?? undefined),
      basicCompletion(alertRegex, ':::warning\n\n:::', t('editor.autocompletions.warningBox') ?? undefined),
      basicCompletion(alertRegex, ':::danger\n\n:::', t('editor.autocompletions.errorBox') ?? undefined)
    ]
  }
}
