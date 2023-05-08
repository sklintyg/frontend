import { screen } from '@testing-library/react'
import { fakerFromSchema } from '@frontend/fake'
import { PatientOverview } from './PatientOverview'
import { SjfMetaData, sjfMetaDataSchema } from '../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

const renderComponent = () => {
  renderWithRouter(
    <PatientOverview
      sjfMetaData={(fakerFromSchema(sjfMetaDataSchema) as unknown) as SjfMetaData}
      patientId="191212121212"
      isPersonResponseMissing={false}
    />
  )
}

describe('PatientOverview', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('same care provider', () => {
    it('should show title not protected information', () => {
      renderComponent()
      expect(screen.getByText('Ospärrad information inom vårdgivare')).toBeInTheDocument()
    })

    it('should show title protected information', () => {
      renderComponent()
      expect(screen.getByText('Ospärrad information inom vårdgivare')).toBeInTheDocument()
    })
  })
})
