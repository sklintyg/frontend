import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { OpenCurrentCard } from './OpenCurrentCard'

it('should render without problems', () => {
  expect(() => renderWithRouter(<OpenCurrentCard sjfMetaData={fakerFromSchema(sjfMetaDataSchema)()} patientId="123" />)).not.toThrow()
})

it('Should render empty text when there is no content', () => {
  renderWithRouter(
    <OpenCurrentCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        kraverInteSamtycke: [],
      })}
      patientId="123"
    />
  )
  expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
})
