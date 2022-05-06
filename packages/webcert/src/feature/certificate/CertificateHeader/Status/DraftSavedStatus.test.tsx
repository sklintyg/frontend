import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { createCertificateMetadata } from './statusTestUtils'
import { CertificateStatus } from '@frontend/common/src'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (isSigned: boolean, isValidating: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={createCertificateMetadata(isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED, false, 'lisjp')}
          questions={[]}
          isValidForSigning={false}
          isValidating={isValidating}
        />
      </BrowserRouter>
    </Provider>
  )
}

describe('Draft saved status', () => {
  it('displays that the draft is saved', () => {
    renderComponent(false, false)
    expect(screen.getByText('Utkastet är sparat')).toBeInTheDocument()
  })

  it('displays that the draft is being saved', () => {
    renderComponent(false, true)
    expect(screen.getByText('Utkastet sparas')).toBeInTheDocument()
  })

  it('doesnt render status if signed', async () => {
    renderComponent(true, false)
    expect(screen.queryByText('Utkastet är sparat')).not.toBeInTheDocument()
    expect(screen.queryByText('Utkastet sparas')).not.toBeInTheDocument()
  })
})
