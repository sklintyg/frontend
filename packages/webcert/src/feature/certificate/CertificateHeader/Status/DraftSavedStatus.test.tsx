import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DraftSavedStatus from './DraftSavedStatus'
import { createCertificateMetadata } from './statusTestUtils'
import { CertificateStatus } from '@frontend/common/src'

const renderComponent = (isSigned: boolean, isValidating: boolean) => {
  render(
    <DraftSavedStatus
      isEditable={true}
      certificateMetadata={createCertificateMetadata(isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED)}
      isValidating={isValidating}
    />
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
