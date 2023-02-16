import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientStatusNotificationWithModal from './PatientStatusNotificationWithModal'

const renderDefaultComponent = (status: boolean) => {
  render(
    <PatientStatusNotificationWithModal status={status} title={INFO_TEXT} modalTitle={MODAL_TITLE} type="info">
      {MODAL_BODY}
    </PatientStatusNotificationWithModal>
  )
}

const INFO_TEXT = 'Patientstatus'
const MODAL_TITLE = 'Modal title'
const MODAL_BODY = 'Modal body'

describe('PatientStatusNotificationWithModal', () => {
  it('shall render notification if status is set', () => {
    renderDefaultComponent(true)
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render notification if status is not set', () => {
    renderDefaultComponent(false)
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall open modal if user clicks on status', () => {
    renderDefaultComponent(true)
    userEvent.click(screen.getByText(INFO_TEXT))
    expect(screen.getByText(MODAL_TITLE)).toBeInTheDocument()
    expect(screen.getByText(MODAL_BODY)).toBeInTheDocument()
  })
})
