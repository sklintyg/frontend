import React from 'react'
import { render, screen } from '@testing-library/react'
import { CertificateMetadata } from '@frontend/common'
import CertificateInfo from './CertificateInfo'
import { Provider } from 'react-redux'
import store from '../../../store/store'

const mockData: CertificateMetadata = {
  name: 'Test cert name',
  patient: { fullName: 'Tolvan', personId: { id: '123' }, previousPersonId: { id: '345', type: 'TEST' } },
}

function renderDefaultComponent() {
  render(
    <Provider store={store}>
      <CertificateInfo certificateMetadata={mockData} />
    </Provider>
  )
}

describe('CertificateInfo', () => {
  it('displays certificate name, patients name and date', () => {
    renderDefaultComponent()
    expect(screen.getByRole('heading', { name: /Test cert name/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Tolvan - 123/i })).toBeInTheDocument()
  })

  it('displays previous patient id when set', () => {
    renderDefaultComponent()
    expect(screen.getByText('fd. 345')).toBeInTheDocument()
  })
})
