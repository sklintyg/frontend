import { ResourceLinkType } from '@frontend/common/src/types/resourceLink'
import '@testing-library/jest-dom'
import { getByText, queryByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { updateValidationErrors } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import SignAndSendButton from '../SignAndSendButton'

const NAME = 'Sign button name'
const DESCRIPTION = 'Sign button description'
const BODY = 'Sign modal body'

const mockDispatchFn = jest.fn()

const renderDefaultComponent = (enabled: boolean, type: ResourceLinkType, body?: string) => {
  render(
    <Provider store={store}>
      <SignAndSendButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} type={type} body={body} />
    </Provider>
  )
}

beforeEach(() => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(mockDispatchFn)
})

describe('Sign certificate without confirmation modal', () => {
  it('Enabled Sign button and no modal', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent(false, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and no modal', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE)
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })
})

describe('Sign certificate with confirmation modal', () => {
  beforeEach(() => {
    store.dispatch(updateValidationErrors([]))
  })

  it('Enabled Sign button and no modal', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent(false, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and modal', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByText(BODY)).toBeInTheDocument()
    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = queryByText(modalBody, NAME)
    const cancelButton = queryByText(modalBody, 'Avbryt')
    expect(confirmButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('Click Sign button and modal cancel', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const cancelButton = getByText(modalBody, 'Avbryt')
    userEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })

  it('Click Sign button and modal confirm', () => {
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, NAME)
    userEvent.click(confirmButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it('Should not display confirmation modal when there are unresolved validation errors', () => {
    store.dispatch(
      updateValidationErrors([
        {
          category: 'category',
          field: 'field',
          id: 'id',
          text: 'text',
          type: 'type',
        },
      ])
    )
    renderDefaultComponent(true, ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION, BODY)
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
