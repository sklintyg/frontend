import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { BlockedOtherCard } from './BlockedOtherCard'

it('should render without problems', () => {
  expect(() => renderWithRouter(<BlockedOtherCard sjfMetaData={fakerFromSchema(sjfMetaDataSchema)()} />)).not.toThrow()
})

it('Should render empty text when there are no items', () => {
  renderWithRouter(
    <BlockedOtherCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        andraVardgivareMedSparr: [],
      })}
    />
  )
  expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
})

it('Should render items', async () => {
  renderWithRouter(
    <BlockedOtherCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        andraVardgivareMedSparr: ['first', 'second', 'third'],
      })}
    />
  )
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByText('first')).toBeInTheDocument()
  expect(screen.getByText('second')).toBeInTheDocument()
  expect(screen.getByText('third')).toBeInTheDocument()
})
