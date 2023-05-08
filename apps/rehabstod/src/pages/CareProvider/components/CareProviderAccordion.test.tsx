import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock, vi } from 'vitest'
import { fakeVardenhet } from '../../../utils/fake/fakeVardenhet'
import { fakeVardgivare } from '../../../utils/fake/fakeVardgivare'
import { CareProviderAccordion } from './CareProviderAccordion'

let selectedRadio: string | null
let handleChooseUnit: Mock<unknown[], unknown>
let children: string | number | boolean | JSX.Element | null | undefined
const vardenhet = fakeVardenhet({ namn: 'Alfa regionen' })
const vardgivare = fakeVardgivare({ namn: 'Alfa Medicin' })

beforeEach(() => {
  selectedRadio = null
  handleChooseUnit = vi.fn()
  children = <div>Accordion content</div>
})

function renderComponent() {
  return render(
    <CareProviderAccordion unit={vardenhet} provider={vardgivare} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
      {children}
    </CareProviderAccordion>
  )
}

it('renders the unit name in the label', () => {
  renderComponent()
  const label = screen.getByText(vardenhet.namn)
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
  expect(summary).toHaveTextContent(vardenhet.namn)
})

it('selects the correct radio button when passed a selectedRadio value', async () => {
  selectedRadio = vardenhet.namn
  renderComponent()

  const summary = screen.getByRole('button')
  userEvent.click(summary)

  const radioBtn = screen.getByLabelText(vardenhet.namn)
  expect(radioBtn).toBeInTheDocument()

  await waitFor(() => {
    expect(radioBtn).toBeTruthy()
  })
})

it('calls the handleChooseUnit function when a radio button is clicked', async () => {
  renderComponent()

  const radioBtn = screen.getByLabelText(vardenhet.namn)
  expect(radioBtn).toBeInTheDocument()

  userEvent.click(radioBtn)

  await waitFor(() => {
    expect(handleChooseUnit).toHaveBeenCalledWith(expect.anything(), vardgivare, vardenhet)
  })
})

it('renders the accordion as closed by default', () => {
  renderComponent()

  const accordion = screen.getByRole('group')
  expect(accordion).not.toHaveAttribute('open')
})
