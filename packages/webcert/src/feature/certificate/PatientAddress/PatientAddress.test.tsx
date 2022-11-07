import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import PatientAddress from './PatientAddress'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import reducer from '../../../store/reducers'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { Certificate, getCertificate, ResourceLinkType } from '@frontend/common'

describe('CertificateFooter', () => {
  let testStore: EnhancedStore
  let certificate: Certificate

  const renderComponent = () => {
    render(
      <Provider store={testStore}>
        <PatientAddress />
      </Provider>
    )
  }

  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, certificateMiddleware),
    })
  })

  describe('Patient address component', () => {
    beforeEach(() => {
      certificate = getCertificate()
      certificate.links = [
        {
          type: ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE,
          name: 'Patient adddress',
          description: 'RFS description',
          enabled: false,
        },
      ]
      testStore.dispatch(updateCertificate(certificate))
      renderComponent()
    })

    it('should show category title', () => {
      const heading = screen.getByText('Patientens adressuppgifter')
      expect(heading).toBeInTheDocument()
    })

    it('should show disabled textboxes', () => {
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).toBeDisabled()
      })
    })

    it('should show patients address in the textboxes', () => {
      const textboxes = screen.getAllByRole('textbox')
      expect(textboxes[0]).toHaveValue('Street 1')
      expect(textboxes[1]).toHaveValue('12345')
      expect(textboxes[2]).toHaveValue('City')
    })
  })

  describe('Patient address editable', () => {
    beforeEach(() => {
      certificate = getCertificate()
      certificate.links = [
        {
          type: ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE,
          name: 'Patient adddress',
          description: 'RFS description',
          enabled: true,
        },
        { type: ResourceLinkType.EDIT_CERTIFICATE, name: 'Certificate editable', description: 'RFS description', enabled: true },
      ]
      testStore.dispatch(updateCertificate(certificate))
      renderComponent()
    })

    it('should show enabled textboxes', () => {
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach((textbox) => {
        expect(textbox).not.toBeDisabled()
      })
    })
  })
})
