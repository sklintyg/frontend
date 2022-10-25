import React from 'react'
import '@testing-library/jest-dom'
import { getByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import * as redux from 'react-redux'
import SignAndSendButton from '../SignAndSendButton'
import store from '../../../../store/store'
import { ResourceLinkType } from '@frontend/common/src/types/resourceLink'
import ConcurrentModification from '../../../../components/error/modals/ConcurrentModification'

const NAME = 'Sign button name'
const DESCRIPTION = 'Sign button description'
const BODY = 'Sign modal body'

const mockDispatchFn = jest.fn()

const renderDefaultComponent = (enabled: boolean, canSign: boolean, type: ResourceLinkType, body?: string) => {
  render(
    <Provider store={store}>
      <SignAndSendButton
        name={NAME}
        description={DESCRIPTION}
        canSign={canSign}
        enabled={enabled}
        functionDisabled={false}
        type={type}
        body={body}
      />
    </Provider>
  )
}

describe('Show sign button without modal', () => {
  beforeEach(() => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)
  })

  it('Enabled Sign button and no modal', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent(false, true, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and no modal', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })
})

describe('Show sign button with modal', () => {
  it('Enabled Sign button and no modal', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Enabled Sign button when can not sign and modal', () => {
    renderDefaultComponent(true, false, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent(false, true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and modal', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByText(BODY)).toBeInTheDocument()
    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, NAME)
    const cancelButton = getByText(modalBody, 'Avbryt')
    expect(confirmButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('Click Sign button and modal cancel', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const cancelButton = getByText(modalBody, 'Avbryt')
    userEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })

  it('Click Sign button and modal confirm', () => {
    renderDefaultComponent(true, true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, NAME)
    userEvent.click(confirmButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it('Click Sign button when can not sign and modal', () => {
    renderDefaultComponent(true, false, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, NAME)
    const cancelButton = getByText(modalBody, 'Avbryt')
    expect(confirmButton).toBeNull
    expect(cancelButton).toBeInTheDocument()
  })

  it('Click Sign button when can not sign and modal cancel', () => {
    renderDefaultComponent(true, false, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const cancelButton = getByText(modalBody, 'Avbryt')
    userEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })
})
