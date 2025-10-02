import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { expect, it } from 'vitest'
import { fakeAlert, fakeCertificateConfirmationModal } from '../../../faker/certificate/fakeCertificateConfirmationModal'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import type { Alert, CertificateModalActionType } from '../../../types/confirmModal'
import { ConfirmationModal } from './ConfirmationModal'

let testStore: EnhancedStore

function renderComponent(props: ComponentProps<typeof ConfirmationModal>) {
  return render(
    <Provider store={testStore}>
      <ConfirmationModal {...props} />
    </Provider>
  )
}

beforeEach(() => {
  testStore = configureApplicationStore([])
})

it('Should render dynamic texts', () => {
  const text = 'text'
  const alert: Alert = fakeAlert()
  const data = fakeCertificateConfirmationModal({ text, alert })
  renderComponent({ ...data, open: true, setOpen: vi.fn() })
  expect(screen.getByText(data.title)).toBeInTheDocument()
  expect(screen.getByText(text)).toBeInTheDocument()
  expect(screen.getByText(alert.text)).toBeInTheDocument()
  expect(screen.getByText(data.checkboxText)).toBeInTheDocument()
})

it('Should close modal on CANCEL action', async () => {
  const data = fakeCertificateConfirmationModal({ secondaryAction: 'CANCEL' })
  const setOpen = vi.fn()
  renderComponent({ ...data, open: true, setOpen })

  await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }))
  expect(setOpen).toHaveBeenCalledWith(false)
})

it('Should reset primary action to disabled if action is used', async () => {
  const data = fakeCertificateConfirmationModal()
  renderComponent({ ...data, open: true, setOpen: vi.fn() })

  await expect(screen.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
  await userEvent.click(screen.getByRole('checkbox', { name: data.checkboxText }))
  await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }))
  await expect(screen.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
})

it('Should enable primary action when checkbox is pressed', async () => {
  const data = fakeCertificateConfirmationModal()
  renderComponent({ ...data, open: true, setOpen: vi.fn() })

  await expect(screen.getByRole('button', { name: 'Gå vidare' })).toBeDisabled()
  await userEvent.click(screen.getByRole('checkbox', { name: data.checkboxText }))
  await expect(screen.getByRole('button', { name: 'Gå vidare' })).toBeEnabled()
})

it.each(['DELETE', 'READ'] as CertificateModalActionType[])('Should fire on %s action', async (primaryAction) => {
  const data = fakeCertificateConfirmationModal({ primaryAction })
  const setOpen = vi.fn()
  renderComponent({ ...data, certificateId: '123', patientId: '456', certificateType: 'A', open: true, setOpen })

  const dispatchListener = vi.fn()
  testStore.subscribe(dispatchListener)

  await userEvent.click(screen.getByRole('checkbox', { name: data.checkboxText }))
  await userEvent.click(screen.getByRole('button', { name: primaryAction === 'READ' ? 'Gå vidare' : 'Radera' }))

  expect(dispatchListener).toHaveBeenCalledTimes(1)
  expect(setOpen).toHaveBeenCalledWith(false)
})
