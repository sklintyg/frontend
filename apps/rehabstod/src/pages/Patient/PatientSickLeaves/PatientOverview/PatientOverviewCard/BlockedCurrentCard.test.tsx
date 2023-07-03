import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { BlockedCurrentCard } from './BlockedCurrentCard'

it('should render without problems', () => {
  expect(() => renderWithRouter(<BlockedCurrentCard sjfMetaData={fakerFromSchema(sjfMetaDataSchema)()} />)).not.toThrow()
})

it('Should render empty text when there is no content', () => {
  renderWithRouter(
    <BlockedCurrentCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        vardenheterInomVGMedSparr: [],
      })}
    />
  )
  expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
})
