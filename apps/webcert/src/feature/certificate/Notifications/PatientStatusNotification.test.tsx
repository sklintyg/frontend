import { render, screen } from '@testing-library/react'

import PatientStatusNotification from './PatientStatusNotification'

const renderDefaultComponent = (status: boolean) => {
  render(<PatientStatusNotification status={status} title={INFO_TEXT} type="info" />)
}

const INFO_TEXT = 'Patientstatus'

describe('PatientStatusNotification', () => {
  it('shall render notification if status is set', () => {
    renderDefaultComponent(true)
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render notification if status is not set', () => {
    renderDefaultComponent(false)
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})
