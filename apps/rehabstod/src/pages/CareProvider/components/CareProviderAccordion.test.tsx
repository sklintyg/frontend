import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock, vi } from 'vitest'
import { AgandeForm, Vardenheter, Vardgivare } from '../../../store/types/user'
import { CareProviderAccordion } from './CareProviderAccordion'

let unit: Vardenheter
let provider: Vardgivare
let selectedRadio: string | null
let handleChooseUnit: Mock<unknown[], unknown>
let children: string | number | boolean | JSX.Element | null | undefined

beforeEach(() => {
  unit = {
    id: '1',
    namn: 'Unit 1',
    '@class': { key: '', value: '' },
    epost: null,
    postadress: null,
    postnummer: null,
    postort: null,
    mottagningar: [],
    telefonnummer: '555-1234',
    arbetsplatskod: 'ABC',
    vardgivareOrgnr: { key: '', value: '' },
    agandeForm: AgandeForm.Privat,
    start: new Date('2022-01-01'),
    end: null,
  }

  provider = {
    id: '1',
    '@class': 'Vardgivare',
    namn: 'Provider 1',
    vardenheter: [unit],
  }
  selectedRadio = null
  handleChooseUnit = vi.fn()
  children = <div>Accordion content</div>
})

function renderComponent() {
  return render(
    <CareProviderAccordion unit={unit} provider={provider} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
      {children}
    </CareProviderAccordion>
  )
}

it('renders the unit name in the label', () => {
  renderComponent()

  const label = screen.getByText(unit.namn)
  expect(label).not.toBeNull()
})

it('displays accordion content when expanded', async () => {
  renderComponent()

  const summary = screen.getByRole('button')
  expect(summary).not.toBeNull()

  userEvent.click(summary)
  const content = await waitFor(() => screen.getByText('Accordion content'))
  expect(content).not.toBeNull()
})

it('renders the unit name in the summary when collapsed', () => {
  renderComponent()

  const summary = screen.getByRole('button')
  expect(summary).toHaveTextContent(unit.namn)
})

it('selects the correct radio button when passed a selectedRadio value', async () => {
  selectedRadio = unit.namn
  renderComponent()

  const summary = screen.getByRole('button')
  userEvent.click(summary)

  const radioBtn = screen.getByLabelText(unit.namn)
  expect(radioBtn).toBeInTheDocument()

  await waitFor(() => {
    expect(radioBtn).toBeTruthy()
  })
})

it('selects the radio button when clicked on it', async () => {
  renderComponent()

  const radioBtn = screen.getByLabelText(unit.namn)
  expect(radioBtn).toBeInTheDocument()
  expect(radioBtn).not.toBeChecked()

  userEvent.click(radioBtn)

  await waitFor(() => {
    expect(radioBtn).toBeChecked()
  })
})
