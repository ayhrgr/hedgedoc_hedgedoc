/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { ContentFormatter } from '../../../change-content-context/use-change-editor-content-callback'
import { wrapSelection } from '../formatters/wrap-selection'
import { ToolbarButton } from '../toolbar-button'
import React, { useCallback } from 'react'
import { TypeStrikethrough as IconTypeStrikethrough } from 'react-bootstrap-icons'

/**
 * Renders a button to strike through the selection in the {@link Editor editor}.
 */
export const StrikethroughButton: React.FC = () => {
  const formatter: ContentFormatter = useCallback(({ currentSelection }) => {
    return wrapSelection(currentSelection, '~~', '~~')
  }, [])
  return <ToolbarButton i18nKey={'strikethrough'} icon={IconTypeStrikethrough} formatter={formatter}></ToolbarButton>
}
