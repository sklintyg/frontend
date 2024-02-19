import { fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
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
          information: [
            {
              id: null,
              text: 'filename',
              type: 'FILENAME',
            },
          ],
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
            {
              id: null,
              text: 'filename',
              type: 'FILENAME',
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
  const datetime = format(Date.now(), 'yy-MM-dd_HHmm')
  await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith(`/api/certificate/4b740d71/pdf/filename_${datetime}`, '_blank')
  })
})

it('Should open file on _self for PRINT_CERTIFICATE when using mobile app', async () => {
  vi.stubGlobal('navigator', {
    userAgent:
      'Mozilla/5.0 (Linux; Android 9; SM-A530F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.110 Mobile Safari/537.36 1177-appen_1.0.6_Android_9.0',
  })
  renderWithPrint()
  const openSpy = vi.spyOn(window, 'open')
  await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('/api/certificate/4b740d71/pdf/filename_'), '_self')
  })
  vi.unstubAllGlobals()
})

it('Should not render when there are no availableFuntions', () => {
  const { container } = render(<PrintCertificateAction id="4b740d71" availableFunctions={[]} />)
  expect(container).toBeEmptyDOMElement()
})

describe('CUSTOMIZE_PRINT_CERTIFICATE', () => {
  it('Should be able to open dialog', async () => {
    renderCustomizePrint()

    expect(screen.getByRole('dialog')).not.toHaveAttribute('show', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'true')
  })

  it('Should be able to close dialog with button', async () => {
    renderCustomizePrint()

    await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
    await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }))

    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'false')
  })

  it('Should be able to open file from dialog', async () => {
    const openSpy = vi.spyOn(window, 'open')
    const datetime = format(Date.now(), 'yy-MM-dd_HHmm')
    renderCustomizePrint()

    await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Skriv ut' }))
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith(`/api/certificate/4b740d71/pdf/filename_${datetime}`, '_blank')
    })
  })

  it('Should close dialog after open file from dialog', async () => {
    renderCustomizePrint()

    await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Skriv ut' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('show', 'false')
  })

  it('Should be able to select second option and open file', async () => {
    const openSpy = vi.spyOn(window, 'open')
    const datetime = format(Date.now(), 'yy-MM-dd_HHmm')
    renderCustomizePrint()

    expect(screen.queryByText(/Information om diagnos kan vara viktig/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Dölj Diagnos' }))
    expect(screen.getByText(/Information om diagnos kan vara viktig/i)).toBeInTheDocument()

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Skriv ut' }))
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith(`/api/certificate/4b740d71/pdf/filename_${datetime}?customizationId=!diagnoser`, '_blank')
    })
  })
})
