import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import RevokeParentStatus from './RevokeParentStatus'
import { CertificateMetadata } from '@frontend/common'
import { BrowserRouter } from 'react-router-dom'

const isRevokedSpy = jest.spyOn(utils, 'isRevoked')
const isHasParentSpy = jest.spyOn(utils, 'isHasParent')
const isParentRevoked = jest.spyOn(utils, 'isParentRevoked')

it('displays that the certificate has a parent that might need to be revoked', () => {
  isRevokedSpy.mockReturnValue(true)
  isHasParentSpy.mockReturnValue(true)
  isParentRevoked.mockReturnValue(false)

  const mockCert: CertificateMetadata = {
    // @ts-expect-error: we don't need to fill the whole object
    relations: { parent: { certificateId: '1' } },
  }

  render(
    <BrowserRouter>
      <RevokeParentStatus certificateMetadata={mockCert} />
    </BrowserRouter>
  )
  expect(screen.getByText(/intyget ersatte ett tidigare intyg som också kan behöva makuleras./i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /öppna intyget/i })).toBeInTheDocument()
})

it('doesnt render anything', () => {
  isRevokedSpy.mockReturnValue(false)
  isHasParentSpy.mockReturnValue(false)
  isParentRevoked.mockReturnValue(true)

  render(
    <BrowserRouter>
      <RevokeParentStatus />
    </BrowserRouter>
  )
  expect(screen.queryByText(/Intyget har ersatts av/i)).not.toBeInTheDocument()
})
