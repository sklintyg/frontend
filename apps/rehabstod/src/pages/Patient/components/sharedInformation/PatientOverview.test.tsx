import { render, screen } from '@testing-library/react'
import { fakerFromSchema } from '@frontend/fake'
import { PatientOverview } from './PatientOverview'
import { SjfMetaData, sjfMetaDataSchema } from '../../../../schemas/patientSchema'

const renderComponent = () => {
  render(<PatientOverview sjfMetaData={(fakerFromSchema(sjfMetaDataSchema) as unknown) as SjfMetaData} patientId="191212121212" />)
}

describe('PatientOverview', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('same care provider', () => {
    describe('not protected information', () => {
      it('should show title', () => {
        renderComponent()
        expect(screen.getByText('Ospärrad information inom vårdgivare')).toBeInTheDocument()
      })

      it('should show information text', () => {
        renderComponent()
        expect(
          screen.getByText(
            'Det finns ospärrad information hos en annan vårdenhet inom din vårdgivare. Du kan klicka nedan för att visa vilka vårdenheter som har denna information och få möjlighet att inhämta den.'
          )
        ).toBeInTheDocument()
      })
    })
  })
})
