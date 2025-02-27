/*
 * SPDX-FileCopyrightText: 2023 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { optionalAppExtensions } from '../../../../../extensions/extra-integrations/optional-app-extensions'
import { autocompletion } from '@codemirror/autocomplete'
import type { Extension } from '@codemirror/state'
import { useMemo } from 'react'

/**
 * Returns a configured autocompletion extension that uses the autocompletions from the app extensions.
 */
export const useCodeMirrorAutocompletionsExtension = (): Extension => {
  return useMemo(() => {
    return autocompletion({
      override: optionalAppExtensions.flatMap((extension) => extension.buildAutocompletion())
    })
  }, [])
}
