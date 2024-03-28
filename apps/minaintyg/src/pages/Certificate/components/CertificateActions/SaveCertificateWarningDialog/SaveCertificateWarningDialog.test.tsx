import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../../../../../store/store'
import { PrintCertificateContextProvider, usePrintCertificate } from '../hooks/usePrintCertificate'
import { SaveCertificateWarningDialog } from './SaveCertificateWarningDialog'

function ComponentWrapper({ value, children }: { value: Partial<ReturnType<typeof usePrintCertificate>>; children: ReactNode }) {
  const defaultValue = usePrintCertificate('id')
  return (
    <PrintCertificateContextProvider value={{ ...defaultValue, ...value, setSaveWarningDialogOpen: vi.fn() }}>
      {children}
    </PrintCertificateContextProvider>
  )
}

function renderComponent(value: Partial<ReturnType<typeof usePrintCertificate>>) {
  return render(
    <Provider store={store}>
      <ComponentWrapper value={value}>
        <SaveCertificateWarningDialog />
      </ComponentWrapper>
    </Provider>
  )
}

it('Should render as expected', () => {
  renderComponent({ saveWarningDialogOpen: true })
  expect(screen.getByRole('dialog', { name: 'Spara intyg som PDF' })).toBeInTheDocument()
  expect(screen.getByText(/viktigt! Ditt intyg har information om dig, som ditt namn och andra personuppgifter/i)).toBeInTheDocument()
  expect(screen.getByText(/när du sparar intyget som en PDF-fil, sparas filen på den enhet du använder/i)).toBeInTheDocument()
})
