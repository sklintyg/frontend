import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { fakeCertificateMetaData } from '../../../faker'
import { validateCertificateStarted } from '../../../store/certificate/certificateActions'
import store from '../../../store/store'
import type { ResourceLink } from '../../../types'
import { CertificateRelationType, CertificateStatus, ResourceLinkType } from '../../../types'
import { HeaderButtons } from './HeaderButtons'

describe('Verify header buttons', () => {
  const description = 'description'
  const enabled = true

  const renderComponent = (resourceLinks: ResourceLink[]) =>
    render(
      <Provider store={store}>
        <HeaderButtons
          functionDisabled={false}
          resourceLinks={resourceLinks}
          certificateMetadata={fakeCertificateMetaData({
            status: CertificateStatus.SIGNED,
            relations: {
              parent: null,
              children: [
                {
                  certificateId: 'xxxxxx-yyyyyyy-zzzzzz',
                  type: CertificateRelationType.REPLACED,
                  status: CertificateStatus.UNSIGNED,
                  created: new Date().toISOString(),
                },
              ],
            },
          })}
        />
      </Provider>
    )

  it('Should include replace certificate button when its resource link type is available', () => {
    const expectedButton = 'Ersätt'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REPLACE_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include replace certificate continue button when its resource link type is available', () => {
    const expectedButton = 'Ersätt'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include send certificate button when its resource link type is available', () => {
    const expectedButton = 'Skicka'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.SEND_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include copy certificate button when its resource link type is available', () => {
    const expectedButton = 'Kopiera'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.COPY_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include print certificate button when its resource link type is available', async () => {
    const expectedButton = 'Skriv ut'
    vi.spyOn(React, 'useRef').mockReturnValueOnce({ current: {} })
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.PRINT_CERTIFICATE }])
    expect(await screen.findByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include print certificate button with modal when its resource link type is available', async () => {
    const expectedButton = 'Skriv ut'
    vi.spyOn(React, 'useRef').mockReturnValueOnce({ current: {} })
    renderComponent([{ name: expectedButton, description, body: 'Expected body', enabled, type: ResourceLinkType.PRINT_CERTIFICATE }])
    await screen.findByRole('button', { name: expectedButton })
    await userEvent.click(screen.getByText(expectedButton))
    expect(screen.getByText('Skriv ut intyg')).toBeInTheDocument()
    expect(screen.getByText('Expected body')).toBeInTheDocument()
  })

  it('Should include renew certificate button when its resource link type is available', () => {
    const expectedButton = 'Förnya'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.RENEW_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include remove certificate button when its resource link type is available', () => {
    const expectedButton = 'Radera'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REMOVE_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should enable remove certificate button when not validating certificate', async () => {
    const expectedButton = 'Radera'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REMOVE_CERTIFICATE }])
    await expect(screen.getByRole('button', { name: expectedButton })).toBeEnabled()
  })

  it('Should disable remove certificate button when validating certificate', async () => {
    const expectedButton = 'Radera'
    store.dispatch(validateCertificateStarted())
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REMOVE_CERTIFICATE }])
    await expect(screen.getByRole('button', { name: expectedButton })).toBeDisabled()
  })

  it('Should include revoke certificate button when its resource link type is available', () => {
    const expectedButton = 'Makulera'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REVOKE_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })

  it('Should include create certificate from template button when its resource link type is available', () => {
    const expectedButton = 'Skapa utkast'
    renderComponent([{ name: expectedButton, description, enabled, type: ResourceLinkType.REVOKE_CERTIFICATE }])
    expect(screen.getByRole('button', { name: expectedButton })).toBeInTheDocument()
  })
})
