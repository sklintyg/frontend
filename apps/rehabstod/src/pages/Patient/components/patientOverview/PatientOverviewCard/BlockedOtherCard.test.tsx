import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { BlockedOtherCard } from './BlockedOtherCard'

it('should render without problems', () => {
  expect(() => renderWithRouter(<BlockedOtherCard sjfMetaData={fakerFromSchema(sjfMetaDataSchema)()} />)).not.toThrow()
})

it('Should render empty text when there is no content', () => {
  renderWithRouter(
    <BlockedOtherCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        andraVardgivareMedSparr: [],
      })}
    />
  )
  expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
})
