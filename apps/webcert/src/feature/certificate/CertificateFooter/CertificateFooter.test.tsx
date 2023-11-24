import { CertificateSignStatus, fakeCertificate, fakeCertificateMetaData, fakeTextFieldElement, ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate, updateCertificateSignStatus, updateValidationErrors } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { CertificateFooter } from './CertificateFooter'

describe('CertificateFooter', () => {
  let testStore: EnhancedStore

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
  })

  describe('Ready for signing', () => {
    describe('Ready for signing or Sign certificate when resource link doesnt exists', () => {
      beforeEach(() => {
        testStore.dispatch(updateCertificate(fakeCertificate()))
      })

      it('shall not show readyForSign button when certificate isValidForSigning is true', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).not.toBeInTheDocument()
      })

      it('No sign button if no sign or sign confirm resource link', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Sign certificate')
        expect(button).not.toBeInTheDocument()
      })

      it('No sign button if certificate already signed', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        testStore.dispatch(updateCertificateSignStatus(CertificateSignStatus.SIGNED))
        const button = screen.queryByText('Sign certificate')
        expect(button).not.toBeInTheDocument()
      })
    })

    describe('Ready for signing when resource link exists and certificate is not set as ready to sign', () => {
      beforeEach(() => {
        testStore.dispatch(
          updateCertificate(
            fakeCertificate({
              data: fakeTextFieldElement({ id: 'id' }),
              links: [{ type: ResourceLinkType.READY_FOR_SIGN, name: 'Ready For sign', description: 'RFS description', enabled: true }],
            })
          )
        )
      })

      it('shall show readyForSign button when resourcelink exists and certificate isValidForSigning is true', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeEnabled()
      })

      it('shall not show readyForSign button when certificate is already signed', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        testStore.dispatch(updateCertificateSignStatus(CertificateSignStatus.SIGNED))
        const button = screen.queryByText('Ready For sign')
        expect(button).not.toBeInTheDocument()
      })

      it('shall show readyForSign button when resourcelink exists and certificate isValidForSigning is false', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const button = screen.queryByText('Ready For sign')
        expect(button).toBeEnabled()
      })

      it('shall show draft is marked as ready to sign when resourcelink exists', () => {
        renderComponent()
        const text = screen.queryByText('Utkastet är sparat och markerat klart för signering.')
        expect(text).not.toBeInTheDocument()
      })

      it('shall show validation error switch even if the draft contains validation errors', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Visa vad som saknas')
        expect(text).toBeInTheDocument()
      })
    })

    describe('Ready for signing when resource link exists and certificate is already set as ready to sign', () => {
      beforeEach(() => {
        testStore.dispatch(
          updateCertificate(
            fakeCertificate({
              data: fakeTextFieldElement({ id: 'id' }),
              metadata: fakeCertificateMetaData({ readyForSign: new Date().toISOString() }),
              links: [{ type: ResourceLinkType.READY_FOR_SIGN, name: 'Ready For sign', description: 'RFS description', enabled: true }],
            })
          )
        )
      })

      it('shall NOT show readyForSign button when resourcelink exists and certificate isValidForSigning is true', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([]))
        const button = screen.queryByText('Ready For sign')
        expect(button).not.toBeInTheDocument()
      })

      it('shall NOT show readyForSign button when resourcelink exists and certificate isValidForSigning is false', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const button = screen.queryByText('Ready For sign')
        expect(button).not.toBeInTheDocument()
      })

      it('shall show draft is marked as ready to sign when resourcelink exists', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Utkastet är sparat och markerat klart för signering.')
        expect(text).toBeInTheDocument()
      })

      it('shall NOT show validation error switch even if the draft contains validation errors', () => {
        renderComponent()
        testStore.dispatch(updateValidationErrors([{ type: 'type', category: 'category', field: 'field', id: 'id', text: 'text' }]))
        const text = screen.queryByText('Visa vad som saknas')
        expect(text).not.toBeInTheDocument()
      })
    })
  })

  describe('Signing when resource link exists and certificate can be signed but no confirmation is needed', () => {
    beforeEach(() => {
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            links: [{ type: ResourceLinkType.SIGN_CERTIFICATE, name: 'Sign certificate', description: 'Sign description', enabled: true }],
          })
        )
      )
    })

    it('Sign button active', () => {
      renderComponent()
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Signing when resource link exists and certificate can be signed and confirmation is needed', () => {
    beforeEach(() => {
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            links: [
              { type: ResourceLinkType.SIGN_CERTIFICATE, name: 'Sign certificate', description: 'Sign description', enabled: true },
              {
                type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION,
                name: 'Sign certificate',
                description: 'Sign description',
                body: 'Body for signing modal',
                enabled: true,
              },
            ],
          })
        )
      )
    })

    it('Sign button active', () => {
      renderComponent()
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Signing when resource link exists and certificate can not be signed but confirmation modal is to be displayed', () => {
    beforeEach(() => {
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            links: [
              {
                type: ResourceLinkType.SIGN_CERTIFICATE_CONFIRMATION,
                name: 'Sign certificate',
                description: 'Sign description',
                body: 'Body for signing modal',
                enabled: true,
              },
            ],
          })
        )
      )
    })

    it('Sign button active', () => {
      renderComponent()
      testStore.dispatch(updateValidationErrors([]))
      const button = screen.queryByText('Sign certificate')
      expect(button).toBeInTheDocument()
    })
  })
})
