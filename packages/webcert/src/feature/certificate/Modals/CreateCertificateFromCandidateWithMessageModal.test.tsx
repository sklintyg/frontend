import { Certificate, getCertificate, ResourceLink, ResourceLinkType } from '@frontend/common/src'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { Provider } from 'react-redux'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { CreateCertificateFromCandidateWithMessageSuccess, updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
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
      <CreateCertificateFromCandidateWithMessageModal resourceLink={resourceLinkEnabled}></CreateCertificateFromCandidateWithMessageModal>
    </Provider>
  )
}

describe('Create certificate from candidate modal', () => {
  const createCertificateFromCandidateWithMessageSuccess: CreateCertificateFromCandidateWithMessageSuccess = {
    modal: { title: 'Test title', message: 'test message' },
  }
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware])
    certificate = getCertificate()
    testStore.dispatch(updateCertificate(certificate))
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onPost(`/api/certificate/${certificate.metadata.id}/candidate`).reply(200, createCertificateFromCandidateWithMessageSuccess)
  })

  it('shall render without crashing', () => {
    renderDefaultComponent()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    render(
      <Provider store={testStore}>
        <CreateCertificateFromCandidateWithMessageModal
          resourceLink={resourceLinkDisabled}></CreateCertificateFromCandidateWithMessageModal>
      </Provider>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shall not show modal if resourcelink is undefined', () => {
    render(
      <Provider store={testStore}>
        <CreateCertificateFromCandidateWithMessageModal resourceLink={undefined}></CreateCertificateFromCandidateWithMessageModal>
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

  it('When show is clicked, new message and show button removed, but cancel button remaining', () => {
    renderDefaultComponent()
    const showButton = screen.getByText('Visa')
    userEvent.click(showButton)
    setTimeout(() => {
      expect(showButton).not.toBeInTheDocument()
      expect(screen.getByText('Avbryt')).toBeInTheDocument()
      expect(screen.getByText(createCertificateFromCandidateWithMessageSuccess.modal.title)).toBeInTheDocument()
      expect(screen.getByText(createCertificateFromCandidateWithMessageSuccess.modal.message)).toBeInTheDocument()
    }, 500)
  })
})
