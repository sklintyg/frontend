import { fakerFromSchema } from 'fake'
import { render, screen } from '@testing-library/react'
import { availableFunctionSchema, AvailableFunctionsTypeEnum } from '../../../../schema/certificate.schema'
import { CertificateAttentionAlert } from './CertificateAttentionAlert'

const availableActionsWithPrint = [
  fakerFromSchema(availableFunctionSchema)({
    type: AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE,
    name: 'Skicka intyg',
    information: [],
  }),
]
const availableActionsWithInfo = [
  fakerFromSchema(availableFunctionSchema)({
    type: AvailableFunctionsTypeEnum.enum.ATTENTION,
    name: 'Presentera informationsruta',
    body: 'text',
    information: [],
  }),
]
it('Should hide info alert when there is no info availableFunction provided', () => {
  render(<CertificateAttentionAlert availableFunctions={availableActionsWithPrint} />)
  expect(screen.queryByRole('alert', { name: 'Presentera informationsruta' })).not.toBeInTheDocument()
})

it('Should show info alert when there is info availableFunction provided', () => {
  render(<CertificateAttentionAlert availableFunctions={availableActionsWithInfo} />)
  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <ids-alert
      role="alert"
    >
      text
    </ids-alert>
  `)
})
