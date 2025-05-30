import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, expect } from 'vitest'
import { fakeCategoryElement, fakeCertificate, fakeTextAreaElement } from '../../../faker'
import { fakeCertificateConfirmationModal } from '../../../faker/certificate/fakeCertificateConfirmationModal'
import { updateCertificate, validateCertificateSuccess } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { ResourceLinkType } from '../../../types'
import SignAndSendButton from './SignAndSendButton'

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

  it('Enabled Sign button and no modal', async () => {
    renderDefaultComponent({ ...commonProps })
    const button = screen.getByRole('button')
    await expect(button).toBeEnabled()
  })

  it('Disabled Sign button', async () => {
    renderDefaultComponent({ ...commonProps, enabled: false })
    const button = screen.getByRole('button')
    await expect(button).toBeDisabled()
  })

  it('Click Sign button and no modal', async () => {
    renderDefaultComponent({ ...commonProps })
    const button = screen.getByRole('button')
    await userEvent.click(button)
    expect(dispatchedActions).toHaveLength(1)
  })
})

describe('Sign certificate with confirmation modal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: {
            ...fakeTextAreaElement({ id: 'id', parent: 'category' }),
            ...fakeCategoryElement({ id: 'category' }),
          },
        })
      )
    )
    testStore.dispatch(validateCertificateSuccess({ validationErrors: [] }))
    clearDispatchedActions()
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('Enabled Sign button and no modal', async () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await expect(button).toBeEnabled()
  })

  it('Disabled Sign button', async () => {
    renderDefaultComponent({ ...commonProps, enabled: false, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await expect(button).toBeDisabled()
  })

  it('Click Sign button and modal', async () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(commonProps.body)).toBeInTheDocument()
    const modalBody = screen.getByRole('dialog')
    expect(within(modalBody).getByRole('button', { name: commonProps.name })).toBeInTheDocument()
    expect(within(modalBody).getByText('Avbryt')).toBeInTheDocument()
  })

  it('Click Sign button and modal from metadata', async () => {
    const modal = fakeCertificateConfirmationModal()
    renderDefaultComponent({ ...commonProps, signConfirmationModal: modal })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(modal.checkboxText)).toBeInTheDocument()
    expect(screen.getByText(modal.title)).toBeInTheDocument()
  })

  it('Should first show SIGN_CERTIFICATE_CONFIRMATION and then signConfirmationModal when both exists', async () => {
    const modal = fakeCertificateConfirmationModal()

    renderDefaultComponent({
      ...commonProps,
      type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION,
      signConfirmationModal: modal,
    })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(commonProps.body)).toBeInTheDocument()

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fortsätt signering' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(modal.checkboxText)).toBeInTheDocument()
    expect(screen.getByText(modal.title)).toBeInTheDocument()
  })

  it('Click Sign button and modal cancel', async () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    const modalBody = screen.getByRole('dialog')
    await userEvent.click(within(modalBody).getByText('Avbryt'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(dispatchedActions).toHaveLength(0)
  })

  it('Click Sign button and modal confirm', async () => {
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    const modalBody = screen.getByRole('dialog')

    await userEvent.click(within(modalBody).getByRole('button', { name: commonProps.name }))
    expect(dispatchedActions).toHaveLength(1)
  })

  it('Should not display confirmation modal when there are unresolved validation errors', async () => {
    testStore.dispatch(
      validateCertificateSuccess({
        validationErrors: [
          {
            category: 'category',
            field: 'field',
            id: 'id',
            text: 'text',
            type: 'type',
          },
        ],
      })
    )
    renderDefaultComponent({ ...commonProps, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Should hide modal confirmation button when canSign is false', async () => {
    renderDefaultComponent({ ...commonProps, canSign: false, type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION })
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const modalBody = screen.getByRole('dialog')
    expect(within(modalBody).queryByRole('button', { name: commonProps.name })).not.toBeInTheDocument()
    expect(within(modalBody).getByText('Stäng')).toBeInTheDocument()
  })
})
