import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { sjfMetaDataSchema } from '../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { PatientOverview } from './PatientOverview'

const renderComponent = () => {
  const sjfMetaData = fakerFromSchema(sjfMetaDataSchema)({ haveSekretess: false, blockingServiceError: false, consentServiceError: false })
  renderWithRouter(
    <PatientOverview sjfMetaData={sjfMetaData} patientId="191212121212" isPersonResponseMissing={false} encryptedPatientId="" />
  )
}

describe('PatientOverview', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('same care provider', () => {
    it('should show title not protected information', () => {
      renderComponent()
      expect(screen.getByText('Ospärrad information inom egen vårdgivare')).toBeInTheDocument()
    })

    it('should show title protected information', () => {
      renderComponent()
      expect(screen.getByText('Ospärrad information inom egen vårdgivare')).toBeInTheDocument()
    })
  })
})
