import { CertificateStatus } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { expect, it, describe } from 'vitest'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata } from './statusTestUtils'
import store from '../../../../store/store'

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
