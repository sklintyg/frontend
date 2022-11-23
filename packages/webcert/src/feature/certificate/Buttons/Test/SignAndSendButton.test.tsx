import { ResourceLinkType } from '@frontend/common/src/types/resourceLink'
import '@testing-library/jest-dom'
import { getByText, queryByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { updateValidationErrors } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import SignAndSendButton from '../SignAndSendButton'

const mockDispatchFn = jest.fn()

const commonProps = {
  body: 'Sign modal body',
  canSign: true,
  description: 'Sign button description',
  enabled: true,
  functionDisabled: false,
  name: 'Sign button name',
  type: ResourceLinkType.SIGN_CERTIFICATE,
}

const renderDefaultComponent = (props: ComponentProps<typeof SignAndSendButton>) => {
  render(
    <Provider store={store}>
      <SignAndSendButton {...props} />
    </Provider>
  )
}

beforeEach(() => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(mockDispatchFn)
})

describe('Sign certificate without confirmation modal', () => {
  it('Enabled Sign button and no modal', () => {
    renderDefaultComponent({ ...commonProps })
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent({ ...commonProps, enabled: false })
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and no modal', () => {
    renderDefaultComponent({ ...commonProps })
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
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('Disabled Sign button', () => {
    renderDefaultComponent({ ...commonProps, enabled: false, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('Click Sign button and modal', () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByText(commonProps.body)).toBeInTheDocument()
    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = queryByText(modalBody, commonProps.name)
    const cancelButton = queryByText(modalBody, 'Avbryt')
    expect(confirmButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('Click Sign button and modal cancel', () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const cancelButton = getByText(modalBody, 'Avbryt')
    userEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })

  it('Click Sign button and modal confirm', () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, commonProps.name)
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
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Should hide modal confirmation button when canSign is false', () => {
    renderDefaultComponent({ ...commonProps, canSign: false, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = queryByText(modalBody, commonProps.name)
    const cancelButton = queryByText(modalBody, 'Avbryt')
    expect(confirmButton).not.toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })
})
