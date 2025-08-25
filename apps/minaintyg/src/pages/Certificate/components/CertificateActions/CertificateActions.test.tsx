import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../../../mocks/server'
import type { AvailableFunction } from '../../../../schema/certificate.schema'
import {
  AvailableFunctionsTypeEnum,
  availableFunctionSchema,
  certificateMetadataSchema,
  certificateRecipientSchema,
  certificateSchema,
} from '../../../../schema/certificate.schema'
import { api } from '../../../../store/api'
import { store } from '../../../../store/store'
import { CertificateActions } from './CertificateActions'

const id = 'id'

const sendFunction = fakerFromSchema(availableFunctionSchema)({
  type: AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE,
  name: 'Skicka intyg',
  information: [],
  enabled: true,
})

const printFunction = fakerFromSchema(availableFunctionSchema)({
  type: AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE,
  name: 'Skicka intyg',
  information: [
    {
      id: null,
      text: 'lakarintyg_for_sjukpenning',
      type: 'FILENAME',
    },
  ],
})

const customizeFunction = fakerFromSchema(availableFunctionSchema)({
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

async function setupStore(availableFunctions: AvailableFunction[]) {
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          availableFunctions,
          certificate: fakerFromSchema(certificateSchema)({ metadata: fakerFromSchema(certificateMetadataSchema)({ id }) }),
          texts: {
            PREAMBLE_TEXT:
              'Det här är ditt intyg. Intyget innehåller all information som vården fyllt i. Du kan inte ändra något i ditt intyg. Har du frågor kontaktar du den som skrivit ditt intyg. Det här intyget behöver du skriva ut och skicka själv. När du klickar på “skriv ut” kan du välja om du vill visa eller dölja din diagnos. Ingen annan information kan döljas.',
          },
        })
      )
    )
  )
  store.dispatch(api.endpoints.getCertificate.initiate({ id }))
  await waitFor(() => expect(api.endpoints.getCertificate.select({ id })(store.getState()).isSuccess).toBe(true))
}

async function renderComponent(props: ComponentProps<typeof CertificateActions>, availableFunctions: AvailableFunction[] = []) {
  await setupStore(availableFunctions)
  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="root" path="/" element={<CertificateActions {...props} />} />,
            <Route key="skicka" path="/skicka" element={<p>Send page</p>} />,
          ])
        )}
      />
    </Provider>
  )
}

describe('Send certificate action', () => {
  it('Should hide send button when there is no provided recipient', async () => {
    await renderComponent({ id }, [sendFunction])
    expect(screen.queryByRole('button', { name: 'Skicka intyg' })).not.toBeInTheDocument()
  })

  it('Should hide send button when there is no send available function', async () => {
    await renderComponent({ recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }), id }, [])
    expect(screen.queryByRole('button', { name: 'Skicka intyg' })).not.toBeInTheDocument()
  })

  it('Should show send button when there is a provided recipient', async () => {
    await renderComponent(
      {
        recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }),
        id,
      },
      [sendFunction]
    )
    expect(screen.getByRole('button', { name: 'Skicka intyg' })).toBeInTheDocument()
  })

  it('Should display modal if certificate is already sent', async () => {
    await renderComponent(
      {
        recipient: fakerFromSchema(certificateRecipientSchema)({ sent: faker.date.recent().toISOString() }),
        id,
      },
      [{ ...sendFunction, enabled: false }]
    )
    expect(screen.queryByText(/intyget har redan skickats och kan inte skickas igen/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
    expect(screen.getByText(/intyget har redan skickats och kan inte skickas igen/i)).toBeInTheDocument()
  })

  it('Should navigate to /skicka when pressing send button', async () => {
    await renderComponent(
      {
        recipient: fakerFromSchema(certificateRecipientSchema)({ sent: null }),
        id,
      },
      [sendFunction]
    )
    await userEvent.click(screen.getByRole('button', { name: 'Skicka intyg' }))
    expect(screen.getByText(/send page/i)).toBeInTheDocument()
  })
})

describe('Print certificate action', () => {
  it('Should hide print button when there is no print availableFunction provided', async () => {
    await renderComponent({ id })
    expect(screen.queryByRole('button', { name: 'Skriv ut' })).not.toBeInTheDocument()
  })

  it('Should show print link when there is print availableFunction provided', async () => {
    await renderComponent({ id }, [printFunction])
    expect(screen.getByRole('link', { name: 'Skriv ut' })).toBeInTheDocument()
  })

  it('Should have correct address for print link', async () => {
    await renderComponent({ id }, [printFunction])
    expect(screen.getByRole('link', { name: 'Skriv ut' })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/api\/certificate\/id\/pdf\/lakarintyg_for_sjukpenning_\d{2}-\d{2}-\d{2}_\d{4}.pdf$/)
    )
    expect(screen.getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('target', '_blank')
  })

  describe('customizable PDF', () => {
    it('Should have print button when the print is customizable', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      expect(screen.getByRole('button', { name: 'Skriv ut' })).toBeInTheDocument()
    })

    it('Should be able to open customize dialog', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })

      expect(dialog).not.toHaveAttribute('data-open', 'true')

      await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

      expect(dialog).toHaveAttribute('data-open', 'true')
    })

    it('Should have print link button', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
      await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))
      expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute(
        'href',
        expect.stringMatching(/\/api\/certificate\/id\/pdf\/lakarintyg_for_sjukpenning_\d{2}-\d{2}-\d{2}_\d{4}.pdf$/)
      )
      expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('target', '_blank')
    })

    it('Should be able to cancel dialog with button', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })

      await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

      expect(dialog).toHaveAttribute('data-open', 'true')

      await userEvent.click(within(dialog).getByRole('button', { name: 'Avbryt' }))

      expect(dialog).toHaveAttribute('data-open', 'false')
    })

    it('Should change link when selecting second option', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const dialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })

      expect(screen.queryByText(/Information om diagnos kan vara viktig/i)).not.toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Skriv ut' }))

      await userEvent.click(within(dialog).getByRole('radio', { name: 'Dölj Diagnos' }))
      expect(within(dialog).getByText(/Information om diagnos kan vara viktig/i)).toBeInTheDocument()
      expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute(
        'href',
        expect.stringMatching(
          /\/api\/certificate\/id\/pdf\/lakarintyg_for_sjukpenning_\d{2}-\d{2}-\d{2}_\d{4}.pdf\?customizationId=!diagnoser$/
        )
      )
      expect(within(dialog).getByRole('link', { name: 'Skriv ut' })).toHaveAttribute('target', '_blank')
    })
  })
})

describe('Save certificate action', () => {
  it('Should hide save button when there is no print availableFunction provided', async () => {
    await renderComponent({ id })
    expect(screen.queryByRole('button', { name: 'Spara PDF' })).not.toBeInTheDocument()
  })

  it('Should show save button when there is print availableFunction provided', async () => {
    await renderComponent({ id }, [printFunction])
    expect(screen.getByRole('button', { name: 'Spara PDF' })).toBeInTheDocument()
  })

  it('Should display save warning when pressing button', async () => {
    await renderComponent({ id }, [printFunction])
    const dialog = screen.getByRole('dialog', { name: 'Spara intyg som PDF' })

    expect(dialog).not.toHaveAttribute('data-open', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Spara PDF' }))

    expect(dialog).toHaveAttribute('data-open', 'true')
  })

  it('Should be able to cancel dialog with button', async () => {
    await renderComponent({ id }, [printFunction])
    const dialog = screen.getByRole('dialog', { name: 'Spara intyg som PDF' })

    await userEvent.click(screen.getByRole('button', { name: 'Spara PDF' }))

    expect(dialog).toHaveAttribute('data-open', 'true')

    await userEvent.click(within(dialog).getByRole('button', { name: 'Avbryt' }))

    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('Should have save link button', async () => {
    await renderComponent({ id }, [printFunction])
    const dialog = screen.getByRole('dialog', { name: 'Spara intyg som PDF' })

    await userEvent.click(screen.getByRole('button', { name: 'Spara PDF' }))

    expect(within(dialog).getByRole('link', { name: 'Spara' })).toBeInTheDocument()

    expect(within(dialog).getByRole('link', { name: 'Spara' })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/api\/certificate\/id\/pdf\/lakarintyg_for_sjukpenning_\d{2}-\d{2}-\d{2}_\d{4}.pdf$/)
    )
    expect(within(dialog).getByRole('link', { name: 'Spara' })).toHaveAttribute('download')
  })

  describe('customizable PDF', () => {
    it('Should be able to open customize dialog', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const customizeDialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
      await userEvent.click(screen.getByRole('button', { name: 'Spara PDF' }))

      expect(customizeDialog).toHaveAttribute('data-open', 'true')
      expect(within(customizeDialog).getByRole('button', { name: 'Spara' })).toBeInTheDocument()
    })

    it('Should be able to open save warning dialog from customize dialog', async () => {
      await renderComponent({ id }, [printFunction, customizeFunction])
      const saveWarningDialog = screen.getByRole('dialog', { name: 'Spara intyg som PDF' })
      const customizeDialog = screen.getByRole('dialog', { name: 'Vill du visa eller dölja diagnos?' })
      await userEvent.click(screen.getByRole('button', { name: 'Spara PDF' }))

      expect(saveWarningDialog).not.toHaveAttribute('data-open', 'true')

      await userEvent.click(within(customizeDialog).getByRole('button', { name: 'Spara' }))

      expect(saveWarningDialog).toHaveAttribute('data-open', 'true')
    })
  })
})

describe('Inera Mobile App', () => {
  beforeAll(() => {
    vi.stubGlobal('navigator', {
      userAgent: '1177-appen',
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it('Should hide print button when using Inera 1177 mobile app', async () => {
    await renderComponent({ id }, [printFunction])
    expect(screen.queryByRole('button', { name: 'Skriv ut' })).not.toBeInTheDocument()
  })

  it('Should hide save button when using Inera 1177 mobile app', async () => {
    await renderComponent({ id }, [printFunction])
    expect(screen.queryByRole('button', { name: 'Spara PDF' })).not.toBeInTheDocument()
  })
})
