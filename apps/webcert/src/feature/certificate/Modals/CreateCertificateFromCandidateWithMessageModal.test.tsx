import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { fakeCertificate } from '../../../faker'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import type { CreateCertificateFromCandidateWithMessageSuccess } from '../../../store/certificate/certificateActions'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
import type { Certificate, ResourceLink } from '../../../types'
import { ResourceLinkType } from '../../../types'
import CreateCertificateFromCandidateWithMessageModal from './CreateCertificateFromCandidateWithMessageModal'

let fakeAxios: MockAdapter
let testStore: EnhancedStore
let certificate: Certificate
const NAME = 'Name'
const BODY = 'Body'

const resourceLinkEnabled: ResourceLink = {
  type: ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE,
  name: NAME,
  body: BODY,
  description: '',
  enabled: true,
}

const resourceLinkDisabled: ResourceLink = {
  type: ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE,
  name: NAME,
  body: BODY,
  description: '',
  enabled: false,
}

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <CreateCertificateFromCandidateWithMessageModal resourceLink={resourceLinkEnabled} />
    </Provider>
  )
}

describe('Create certificate from candidate modal', () => {
  const createCertificateFromCandidateWithMessageSuccess: CreateCertificateFromCandidateWithMessageSuccess = {
    modal: { title: 'Test title', message: 'test message' },
  }
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware])
    certificate = fakeCertificate()
    testStore.dispatch(updateCertificate(certificate))
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onPost(`/api/certificate/${certificate.metadata.id}/candidate`).reply(200, createCertificateFromCandidateWithMessageSuccess)
  })

  it('shall render without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    render(
      <Provider store={testStore}>
        <CreateCertificateFromCandidateWithMessageModal resourceLink={resourceLinkDisabled} />
      </Provider>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shall not show modal if resourcelink is undefined', () => {
    render(
      <Provider store={testStore}>
        <CreateCertificateFromCandidateWithMessageModal resourceLink={undefined} />
      </Provider>
    )
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

  it('shall have buttons', () => {
    renderDefaultComponent()
    expect(screen.getByText('Visa')).toBeInTheDocument()
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })
})
