import { fakeCertificate, fakeTextAreaElement, ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { getByText, queryByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { updateCertificate, updateValidationErrors } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import SignAndSendButton from '../SignAndSendButton'

const commonProps = {
  body: 'Sign modal body',
  canSign: true,
  description: 'Sign button description',
  enabled: true,
  functionDisabled: false,
  name: 'Sign button name',
  type: ResourceLinkType.SIGN_CERTIFICATE,
}

let testStore: EnhancedStore

const renderDefaultComponent = (props: ComponentProps<typeof SignAndSendButton>) => {
  render(
    <Provider store={testStore}>
      <SignAndSendButton {...props} />
    </Provider>
  )
}

describe('Sign certificate without confirmation modal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

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
    expect(dispatchedActions).toHaveLength(1)
  })
})

describe('Sign certificate with confirmation modal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
    testStore.dispatch(updateCertificate(fakeCertificate({ data: fakeTextAreaElement({ id: 'id' }) })))
    testStore.dispatch(updateValidationErrors([]))
    clearDispatchedActions()
  })

  afterEach(() => {
    clearDispatchedActions()
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
    expect(dispatchedActions).toHaveLength(0)
  })

  it('Click Sign button and modal confirm', () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    userEvent.click(button)

    const modalBody = document.querySelector("[role='dialog'] .ic-button-group") as HTMLDivElement
    const confirmButton = getByText(modalBody, commonProps.name)
    userEvent.click(confirmButton)
    expect(dispatchedActions).toHaveLength(1)
  })

  it('Should not display confirmation modal when there are unresolved validation errors', () => {
    testStore.dispatch(
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
