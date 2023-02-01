import { EnhancedStore } from '@reduxjs/toolkit'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificate, updateValidationErrors } from '../../../store/certificate/certificateActions'
import { Certificate, getCertificate, ResourceLinkType } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import React from 'react'
import { CertificateFooter } from './CertificateFooter'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

describe('CertificateFooter', () => {
  let testStore: EnhancedStore
  let certificate: Certificate

  const renderComponent = () => {
    render(
      <Provider store={testStore}>
        <CertificateFooter />
      </Provider>
    )
  }

  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
    renderComponent()
  })

  describe('Ready for signing', () => {
    describe('Ready for signing or Sign certificate when resource link doesnt exists', () => {
      beforeEach(() => {
        certificate = getCertificate()
        testStore.dispatch(updateCertificate(certificate))
      })

      it('shall not show readyForSign button when certificate isValidForSigning is true', () => {
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeFalsy()
      })

      it('No sign button if no sign or sign confirm resource link', () => {
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Sign certificate')
        expect(button).not.toBeInTheDocument()
      })
    })

    describe('Ready for signing when resource link exists and certificate is not set as ready to sign', () => {
      beforeEach(() => {
        certificate = getCertificate()
        certificate.links = [
          { type: ResourceLinkType.READY_FOR_SIGN, name: 'Ready For sign', description: 'RFS description', enabled: true },
        ]
        testStore.dispatch(updateCertificate(certificate))
      })

      it('shall show readyForSign button when resourcelink exists and certificate isValidForSigning is true', () => {
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeEnabled()
      })

      it('shall show readyForSign button when resourcelink exists and certificate isValidForSigning is false', () => {
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeEnabled()
      })

      it('shall show draft is marked as ready to sign when resourcelink exists', () => {
        const text = screen.queryByText('Utkastet är sparat och markerat klart för signering.')
        expect(text).toBeFalsy()
      })

      it('shall show validation error switch even if the draft contains validation errors', () => {
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Visa vad som saknas')
        expect(text).toBeTruthy()
      })
    })

    describe('Ready for signing when resource link exists and certificate is already set as ready to sign', () => {
      beforeEach(() => {
        certificate = getCertificate()
        certificate.links = [
          { type: ResourceLinkType.READY_FOR_SIGN, name: 'Ready For sign', description: 'RFS description', enabled: true },
        ]
        certificate.metadata.readyForSign = new Date().toISOString()
        testStore.dispatch(updateCertificate(certificate))
      })

      it('shall NOT show readyForSign button when resourcelink exists and certificate isValidForSigning is true', () => {
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeFalsy()
      })

      it('shall NOT show readyForSign button when resourcelink exists and certificate isValidForSigning is false', () => {
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeFalsy()
      })

      it('shall show draft is marked as ready to sign when resourcelink exists', () => {
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Utkastet är sparat och markerat klart för signering.')
        expect(text).toBeTruthy()
      })

      it('shall NOT show validation error switch even if the draft contains validation errors', () => {
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Visa vad som saknas')
        expect(text).toBeFalsy()
      })
    })
  })

  describe('Signing when resource link exists and certificate can be signed but no confirmation is needed', () => {
    beforeEach(() => {
      certificate = getCertificate()
      certificate.links = [
        { type: ResourceLinkType.SIGN_CERTIFICATE, name: 'Sign certificate', description: 'Sign description', enabled: true },
      ]
      testStore.dispatch(updateCertificate(certificate))
    })

    it('Sign button active', () => {
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Signing when resource link exists and certificate can be signed and confirmation is needed', () => {
    beforeEach(() => {
      certificate = getCertificate()
      certificate.links = [
        { type: ResourceLinkType.SIGN_CERTIFICATE, name: 'Sign certificate', description: 'Sign description', enabled: true },
        {
          type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION,
          name: 'Sign certificate',
          description: 'Sign description',
          body: 'Body for signing modal',
          enabled: true,
        },
      ]
      testStore.dispatch(updateCertificate(certificate))
    })

    it('Sign button active', () => {
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Signing when resource link exists and certificate can not be signed but confirmation modal is to be displayed', () => {
    beforeEach(() => {
      certificate = getCertificate()
      certificate.links = [
        {
          type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION,
          name: 'Sign certificate',
          description: 'Sign description',
          body: 'Body for signing modal',
          enabled: true,
        },
      ]
      testStore.dispatch(updateCertificate(certificate))
    })

    it('Sign button active', () => {
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })
})
