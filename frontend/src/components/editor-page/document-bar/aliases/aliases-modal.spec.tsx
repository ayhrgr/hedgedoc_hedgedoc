/*
 * SPDX-FileCopyrightText: 2023 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CommonModalProps } from '../../../common/modals/common-modal'
import * as CommonModalModule from '../../../common/modals/common-modal'
import { mockI18n } from '../../../markdown-renderer/test-utils/mock-i18n'
import * as useUiNotificationsModule from '../../../notifications/ui-notification-boundary'
import * as AliasesAddFormModule from './aliases-add-form'
import * as AliasesListModule from './aliases-list'
import { AliasesModal } from './aliases-modal'
import { render } from '@testing-library/react'
import React from 'react'
import type { PropsWithChildren } from 'react'

jest.mock('./aliases-list')
jest.mock('./aliases-add-form')
jest.mock('../../../common/modals/common-modal')
jest.mock('../../../notifications/ui-notification-boundary')

describe('AliasesModal', () => {
  beforeEach(async () => {
    await mockI18n()
    jest.spyOn(CommonModalModule, 'CommonModal').mockImplementation((({ children }) => {
      return (
        <span>
          This is a mock implementation of a Modal: <dialog>{children}</dialog>
        </span>
      )
    }) as React.FC<PropsWithChildren<CommonModalProps>>)
    jest.spyOn(AliasesListModule, 'AliasesList').mockImplementation((() => {
      return <span>This is a mock for the AliasesList that is tested separately.</span>
    }) as React.FC)
    jest.spyOn(AliasesAddFormModule, 'AliasesAddForm').mockImplementation((() => {
      return <span>This is a mock for the AliasesAddForm that is tested separately.</span>
    }) as React.FC)
    jest.spyOn(useUiNotificationsModule, 'useUiNotifications').mockReturnValue({
      showErrorNotification: jest.fn(),
      dismissNotification: jest.fn(),
      dispatchUiNotification: jest.fn()
    })
  })

  afterAll(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('renders the modal', () => {
    const view = render(<AliasesModal show={true} />)
    expect(view.container).toMatchSnapshot()
  })
})
