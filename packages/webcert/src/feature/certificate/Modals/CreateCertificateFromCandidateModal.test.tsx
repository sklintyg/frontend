import { ResourceLink, ResourceLinkType } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import CreateCertificateFromCandidateModal from './CreateCertificateFromCandidateModal'

const NAME = 'Name'
const BODY = 'Body'

const resourceLinkEnabled: ResourceLink = {
  type: ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE,
  name: NAME,
  body: BODY,
  description: '',
  enabled: true,
}

const resourceLinkDisabled: ResourceLink = {
  type: ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE,
  name: NAME,
  body: BODY,
  description: '',
  enabled: false,
}

const renderDefaultComponent = () => {
  render(<CreateCertificateFromCandidateModal resourceLink={resourceLinkEnabled}></CreateCertificateFromCandidateModal>)
}

beforeEach(() => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Create certificate from candidate modal', () => {
  it('shall render without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    render(<CreateCertificateFromCandidateModal resourceLink={resourceLinkDisabled}></CreateCertificateFromCandidateModal>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shall not show modal if resourcelink is undefined', () => {
    render(<CreateCertificateFromCandidateModal resourceLink={undefined}></CreateCertificateFromCandidateModal>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shall set title for modal', () => {
    renderDefaultComponent()
    expect(screen.getByText(NAME)).toBeInTheDocument()
  })

  it('shall set body for modal', () => {
    renderDefaultComponent()
    expect(screen.getByText(BODY)).toBeInTheDocument()
  })
})
