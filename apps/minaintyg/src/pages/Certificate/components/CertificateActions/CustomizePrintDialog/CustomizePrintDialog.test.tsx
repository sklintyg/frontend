import { fakerFromSchema } from '@frontend/fake'
import { render, screen, within } from '@testing-library/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { AvailableFunctionsTypeEnum, availableFunctionSchema } from '../../../../../schema/certificate.schema'
import { store } from '../../../../../store/store'
import { PrintCertificateContextProvider, usePrintCertificate } from '../hooks/usePrintCertificate'
import { CustomizePrintDialog } from './CustomizePrintDialog'

const customizePrintFunction = fakerFromSchema(availableFunctionSchema)({
  type: AvailableFunctionsTypeEnum.enum.CUSTOMIZE_PRINT_CERTIFICATE,
  name: 'Anpassa intyget för utskrift',
  title: 'Vill du visa eller dölja diagnos?',
  description:
    'Information om diagnos kan vara viktig för din arbetsgivare. Det kan underlätta anpassning av din arbetssituation. Det kan också göra att du snabbare kommer tillbaka till arbetet.',
  body: 'När du skriver ut ett läkarintyg du ska lämna till din arbetsgivare kan du välja om du vill att din diagnos ska visas eller döljas. Ingen annan information kan döljas. ',
  information: [
    {
      id: null,
      text: 'Visa Diagnos',
      type: 'OPTIONS',
    },
    {
      id: '!diagnoser',
      text: 'Dölj Diagnos',
      type: 'OPTIONS',
    },
    {
      id: null,
      text: 'filename',
      type: 'FILENAME',
    },
  ],
})

function ComponentWrapper({ value, children }: { value: Partial<ReturnType<typeof usePrintCertificate>>; children: ReactNode }) {
  const defaultValue = usePrintCertificate('id')
  return <PrintCertificateContextProvider value={{ ...defaultValue, ...value }}>{children}</PrintCertificateContextProvider>
}

function renderComponent(value: Partial<ReturnType<typeof usePrintCertificate>>) {
  return render(
    <Provider store={store}>
      <ComponentWrapper value={value}>
        <CustomizePrintDialog />
      </ComponentWrapper>
    </Provider>
  )
}

it('Should display dialog', () => {
  renderComponent({ customizePrintDialogOpen: true, customizePrintFunction })
  expect(screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })).toBeInTheDocument()
})

it('Should not have content if customizePrintFunction is missing', () => {
  const { container } = renderComponent({ customizePrintDialogOpen: true })
  expect(container).toBeEmptyDOMElement()
})

it('Should have print butto when customizePrintType is "print"', () => {
  renderComponent({ customizePrintDialogOpen: true, url: 'test.pdf', customizePrintFunction, customizePrintType: 'print' })
  const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
  expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('href', 'test.pdf')
  expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('target', '_blank')
})

it('Should have save butto when customizePrintType is "save"', () => {
  renderComponent({ customizePrintDialogOpen: true, url: 'test.pdf', customizePrintFunction, customizePrintType: 'save' })
  const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
  expect(within(dialog).getByRole('link', { name: 'Spara' })).toHaveAttribute('href', 'test.pdf')
  expect(within(dialog).getByRole('link', { name: 'Spara' })).toHaveAttribute('download')
})
