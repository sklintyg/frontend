import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  CertificateMetadata,
  CertificateRelationType,
  CertificateStatus,
  ResourceLink,
  ResourceLinkChooseReceivers,
  ResourceLinkType,
} from '@frontend/common'
import HeaderButtons from './HeaderButtons'
import { Provider } from 'react-redux'
import store from '../../../store/store'

describe('Verify header buttons', () => {
  const resourceLinks: ResourceLink[] = []
  const description = 'description'
  const enabled = true

  beforeEach(() => {
    resourceLinks.length = 0
  })

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <HeaderButtons resourceLinks={resourceLinks} certificateMetadata={getMetadata()} />
      </Provider>
    )

  it('shall include replace certificate button when its resource link type is available', () => {
    const expectedButton = 'Ersätt'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.REPLACE_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include replace certificate continue button when its resource link type is available', () => {
    const expectedButton = 'Ersätt'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include send certificate button when its resource link type is available', () => {
    const expectedButton = 'Skicka'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.SEND_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include copy certificate button when its resource link type is available', () => {
    const expectedButton = 'Kopiera'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.COPY_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include print certificate button when its resource link type is available', () => {
    const expectedButton = 'Skriv ut'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.PRINT_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include renew certificate button when its resource link type is available', () => {
    const expectedButton = 'Förnya'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.RENEW_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include remove certificate button when its resource link type is available', () => {
    const expectedButton = 'Radera'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.REMOVE_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include revoke certificate button when its resource link type is available', () => {
    const expectedButton = 'Makulera'
    resourceLinks.push({ name: expectedButton, description, enabled, type: ResourceLinkType.REVOKE_CERTIFICATE })
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('shall include choose receiver button when its resource link type is available', () => {
    const expectedButton = 'Välj mottagare'
    resourceLinks.push({
      name: expectedButton,
      description,
      enabled,
      type: ResourceLinkType.CHOOSE_RECEIVERS,
      receivers: ['receiverOne', 'receiverTwo'],
    } as ResourceLinkChooseReceivers)
    renderComponent()
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })
})

const getMetadata = () => {
  return {
    approvedReceivers: [
      { name: 'receiverOne', approved: true },
      { name: 'receiverTwo', approved: false },
    ],
    relations: {
      parent: null,
      children: [
        {
          certificateId: 'xxxxxx-yyyyyyy-zzzzzz',
          type: CertificateRelationType.REPLACE,
          status: CertificateStatus.UNSIGNED,
          created: new Date().toISOString(),
        },
      ],
    },
  } as CertificateMetadata
}
