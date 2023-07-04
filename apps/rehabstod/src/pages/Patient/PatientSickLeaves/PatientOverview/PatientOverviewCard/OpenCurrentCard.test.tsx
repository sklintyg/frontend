import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { sjfItemSchema, sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { OpenCurrentCard } from './OpenCurrentCard'

it('should render without problems', () => {
  expect(() => renderWithRouter(<OpenCurrentCard sjfMetaData={fakerFromSchema(sjfMetaDataSchema)()} patientId="123" />)).not.toThrow()
})

it('Should render empty text when there are no items', () => {
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

it('Should render items', async () => {
  const sjfMetaData = fakerFromSchema(sjfMetaDataSchema)({
    kraverInteSamtycke: [fakerFromSchema(sjfItemSchema)(), fakerFromSchema(sjfItemSchema)(), fakerFromSchema(sjfItemSchema)()],
  })
  renderWithRouter(<OpenCurrentCard sjfMetaData={sjfMetaData} patientId="123" />)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByText(sjfMetaData.kraverInteSamtycke[0].itemName)).toBeInTheDocument()
  expect(screen.getByText(sjfMetaData.kraverInteSamtycke[1].itemName)).toBeInTheDocument()
  expect(screen.getByText(sjfMetaData.kraverInteSamtycke[2].itemName)).toBeInTheDocument()
})
