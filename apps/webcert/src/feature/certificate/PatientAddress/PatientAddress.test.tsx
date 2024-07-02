import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakePatient } from '../../../faker'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import type { Certificate} from '../../../types';
import { ResourceLinkType } from '../../../types'
import PatientAddress from './PatientAddress'

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
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

  describe('Patient address component', () => {
    beforeEach(() => {
      certificate = fakeCertificate({
        metadata: {
          patient: fakePatient({
            personId: {
              id: '',
              type: '',
            },
            firstName: '',
            fullName: '',
            lastName: '',
            street: 'Street 1',
            zipCode: '12345',
            city: 'City',
          }),
        },
        links: [
          {
            type: ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE,
            name: 'Patient adddress',
            description: 'RFS description',
            enabled: false,
          },
        ],
      })
      testStore.dispatch(updateCertificate(certificate))
    })

    it('should show category title', () => {
      renderComponent()
      const heading = screen.getByText('Patientens adressuppgifter')
      expect(heading).toBeInTheDocument()
    })

    it('should show disabled textboxes', () => {
      renderComponent()
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach(async (textbox) => {
        await expect(textbox).toBeDisabled()
      })
    })

    it('should show patients address in the textboxes', async () => {
      renderComponent()
      const textboxes = screen.getAllByRole('textbox')
      await expect(textboxes[0]).toHaveValue('Street 1')
      await expect(textboxes[1]).toHaveValue('12345')
      await expect(textboxes[2]).toHaveValue('City')
    })
  })

  describe('Patient address editable', () => {
    beforeEach(() => {
      certificate = fakeCertificate({
        links: [
          {
            type: ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE,
            name: 'Patient adddress',
            description: 'RFS description',
            enabled: true,
          },
          { type: ResourceLinkType.EDIT_CERTIFICATE, name: 'Certificate editable', description: 'RFS description', enabled: true },
        ],
      })
      testStore.dispatch(updateCertificate(certificate))
    })

    it('should show enabled textboxes', () => {
      renderComponent()
      const textboxes = screen.getAllByRole('textbox')
      textboxes.forEach(async (textbox) => {
        await expect(textbox).toBeEnabled()
      })
    })
  })
})
