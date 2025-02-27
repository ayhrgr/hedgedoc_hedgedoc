/*
 * SPDX-FileCopyrightText: 2023 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { UiIcon } from '../../../common/icons/ui-icon'
import type { PermissionDisabledProps } from './permission-disabled.prop'
import { AccessLevel } from './types'
import React, { useMemo } from 'react'
import { Button, ToggleButtonGroup } from 'react-bootstrap'
import { Eye as IconEye } from 'react-bootstrap-icons'
import { Pencil as IconPencil } from 'react-bootstrap-icons'
import { X as IconX } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

interface PermissionEntryButtonI18nKeys {
  remove: string
  setReadOnly: string
  setWriteable: string
}

export enum PermissionType {
  USER,
  GROUP
}

export interface PermissionEntryButtonsProps {
  type: PermissionType
  currentSetting: AccessLevel
  name: string
  onSetReadOnly: () => void
  onSetWriteable: () => void
  onRemove: () => void
}

/**
 * Buttons next to a user or group permission entry to change the permissions or remove the entry.
 *
 * @param name The name of the user or group.
 * @param type The type of the entry. Either {@link PermissionType.USER} or {@link PermissionType.GROUP}.
 * @param currentSetting How the permission is currently set.
 * @param onSetReadOnly Callback that is fired when the entry is changed to read-only permission.
 * @param onSetWriteable Callback that is fired when the entry is changed to writeable permission.
 * @param onRemove Callback that is fired when the entry is removed.
 * @param disabled If the user is not the owner, functionality is disabled.
 */
export const PermissionEntryButtons: React.FC<PermissionEntryButtonsProps & PermissionDisabledProps> = ({
  name,
  type,
  currentSetting,
  onSetReadOnly,
  onSetWriteable,
  onRemove,
  disabled
}) => {
  const { t } = useTranslation()

  const i18nKeys: PermissionEntryButtonI18nKeys = useMemo(() => {
    switch (type) {
      case PermissionType.USER:
        return {
          remove: 'editor.modal.permissions.removeUser',
          setReadOnly: 'editor.modal.permissions.viewOnlyUser',
          setWriteable: 'editor.modal.permissions.editUser'
        }
      case PermissionType.GROUP:
        return {
          remove: 'editor.modal.permissions.removeGroup',
          setReadOnly: 'editor.modal.permissions.viewOnlyGroup',
          setWriteable: 'editor.modal.permissions.editGroup'
        }
    }
  }, [type])

  return (
    <div>
      <Button
        variant='light'
        className={'text-danger me-2'}
        disabled={disabled}
        title={t(i18nKeys.remove, { name }) ?? undefined}
        onClick={onRemove}>
        <UiIcon icon={IconX} />
      </Button>
      <ToggleButtonGroup type='radio' name='edit-mode' value={currentSetting}>
        <Button
          disabled={disabled}
          title={t(i18nKeys.setReadOnly, { name }) ?? undefined}
          variant={currentSetting === AccessLevel.READ_ONLY ? 'secondary' : 'outline-secondary'}
          onClick={onSetReadOnly}>
          <UiIcon icon={IconEye} />
        </Button>
        <Button
          disabled={disabled}
          title={t(i18nKeys.setWriteable, { name }) ?? undefined}
          variant={currentSetting === AccessLevel.WRITEABLE ? 'secondary' : 'outline-secondary'}
          onClick={onSetWriteable}>
          <UiIcon icon={IconPencil} />
        </Button>
      </ToggleButtonGroup>
    </div>
  )
}
