import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { api } from '../../../../../store/api'
import { store } from '../../../../../store/store'
import { PrintCertificateContextProvider, usePrintCertificate } from '../hooks/usePrintCertificate'
import { CustomizePrintDialog } from './CustomizePrintDialog'

function ComponentWrapper({ value, children }: { value: Partial<ReturnType<typeof usePrintCertificate>>; children: ReactNode }) {
  const defaultValue = usePrintCertificate('id')
  return (
    <PrintCertificateContextProvider value={{ ...defaultValue, ...value, setShowCustomizePrintDialog: vi.fn() }}>
      {children}
    </PrintCertificateContextProvider>
  )
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

beforeEach(async () => {
  await store.dispatch(api.endpoints.getCertificate.initiate({ id: 'id' }))
})

it('Should display dialog', () => {
  renderComponent({ customizePrintDialogOpen: true })
  expect(screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })).toBeInTheDocument()
})

it('Should not have content if customizePrintFunction is missing', () => {
  const { container } = renderComponent({ customizePrintDialogOpen: true })
  expect(container).toBeEmptyDOMElement()
})

it('Should have print button when customizePrintType is "print"', () => {
  renderComponent({ customizePrintDialogOpen: true, url: 'test.pdf', customizePrintType: 'print' })
  const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
  expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('href', 'test.pdf')
  expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('target', '_blank')
})

it('Should have save button when customizePrintType is "save"', () => {
  renderComponent({ customizePrintDialogOpen: true, url: 'test.pdf', customizePrintType: 'save' })
  const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
  expect(within(dialog).getByRole('button', { name: 'Spara' })).toBeInTheDocument()
})

it('Should display description when "Dölj Diagnos" is selected', async () => {
  renderComponent({ customizePrintDialogOpen: true })
  const description = /information om diagnos kan vara viktig för din arbetsgivare/i
  const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })

  expect(within(dialog).queryByText(description)).not.toBeInTheDocument()
  await userEvent.click(within(dialog).getByRole('radio', { name: 'Dölj Diagnos' }))
  expect(within(dialog).getByRole('radio', { name: 'Dölj Diagnos' })).toBeChecked()
  expect(within(dialog).getByText(description)).toBeInTheDocument()
})
