/*
 * SPDX-FileCopyrightText: 2023 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useOnInputChange } from '../../../../hooks/common/use-on-input-change'
import { UiIcon } from '../../../common/icons/ui-icon'
import type { PermissionDisabledProps } from './permission-disabled.prop'
import React, { useCallback, useState } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { Plus as IconPlus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

export interface PermissionAddEntryFieldProps {
  onAddEntry: (identifier: string) => void
  i18nKey: string
}

/**
 * Permission entry row containing a field for adding new user permission entries.
 *
 * @param onAddEntry Callback that is fired with the entered username as identifier of the entry to add.
 * @param i18nKey The localization key for the submit button.
 * @param disabled If the user is not the owner, functionality is disabled.
 */
export const PermissionAddEntryField: React.FC<PermissionAddEntryFieldProps & PermissionDisabledProps> = ({
  onAddEntry,
  i18nKey,
  disabled
}) => {
  const { t } = useTranslation()

  const [newEntryIdentifier, setNewEntryIdentifier] = useState('')
  const onChange = useOnInputChange(setNewEntryIdentifier)

  const onSubmit = useCallback(() => {
    onAddEntry(newEntryIdentifier)
  }, [newEntryIdentifier, onAddEntry])

  return (
    <li className={'list-group-item'}>
      <InputGroup className={'me-1 mb-1'}>
        <FormControl
          value={newEntryIdentifier}
          placeholder={t(i18nKey) ?? undefined}
          onChange={onChange}
          disabled={disabled}
        />
        <Button
          variant='light'
          className={'text-secondary ms-2'}
          title={t(i18nKey) ?? undefined}
          onClick={onSubmit}
          disabled={disabled}>
          <UiIcon icon={IconPlus} />
        </Button>
      </InputGroup>
    </li>
  )
}
