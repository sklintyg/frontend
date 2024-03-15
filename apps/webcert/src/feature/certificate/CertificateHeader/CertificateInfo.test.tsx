import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import CertificateInfo from './CertificateInfo'
import { PersonId, Patient, CertificateMetadata } from '../../../types'

const mockData = {
  name: 'Test cert name',
  patient: {
    fullName: 'Tolvan',
    personId: { id: '123' } as PersonId,
    previousPersonId: { id: '345', type: 'TEST' },
  } as Patient,
} as CertificateMetadata

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
