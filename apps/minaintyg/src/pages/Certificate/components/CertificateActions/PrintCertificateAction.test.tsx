import { fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { availableFunctionSchema } from '../../../../schema/certificate.schema'
import { PrintCertificateAction } from './PrintCertificateAction'

function renderWithPrint() {
  return render(
    <PrintCertificateAction
      id="4b740d71"
      availableFunctions={[
        fakerFromSchema(availableFunctionSchema)({
          type: 'PRINT_CERTIFICATE',
          name: 'Intyget kan skrivas ut',
          title: null,
          description: null,
          body: null,
          information: [],
        }),
      ]}
    />
  )
}

function renderCustomizePrint() {
  return render(
    <PrintCertificateAction
      id="4b740d71"
      availableFunctions={[
        fakerFromSchema(availableFunctionSchema)({
          type: 'CUSTOMIZE_PRINT_CERTIFICATE',
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
          ],
        }),
      ]}
    />
  )
}

it('Should open file for PRINT_CERTIFICATE', async () => {
  renderWithPrint()
  const openSpy = vi.spyOn(window, 'open')
  await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith('/api/certificate/4b740d71/pdf', '_blank')
  })
})

it('Should not render when there are no availableFuntions', () => {
  const { container } = render(<PrintCertificateAction id="4b740d71" availableFunctions={[]} />)
  expect(container).toBeEmptyDOMElement()
})

describe('CUSTOMIZE_PRINT_CERTIFICATE', () => {
  it('Should be able to open dialog', async () => {
    renderCustomizePrint()

    expect(screen.getByRole('dialog')).not.toHaveAttribute('show', 'true')

    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[0])

    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'true')
  })

  it('Should be able to close dialog with button', async () => {
    renderCustomizePrint()

    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[0])
    await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }))

    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'false')
  })

  it('Should be able to open file from dialog', async () => {
    const openSpy = vi.spyOn(window, 'open')
    renderCustomizePrint()

    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[0])
    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[1])
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith('/api/certificate/4b740d71/pdf', '_blank')
    })
  })

  it('Should be able to select second option and open file', async () => {
    const openSpy = vi.spyOn(window, 'open')
    renderCustomizePrint()

    expect(screen.queryByText(/Information om diagnos kan vara viktig/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[0])
    await userEvent.click(screen.getByRole('radio', { name: 'Dölj Diagnos' }))
    await userEvent.click(screen.getAllByRole('button', { name: 'Skriv ut' })[1])

    expect(screen.getByText(/Information om diagnos kan vara viktig/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith('/api/certificate/4b740d71/pdf?customizationId=!diagnoser', '_blank')
    })
  })
})
