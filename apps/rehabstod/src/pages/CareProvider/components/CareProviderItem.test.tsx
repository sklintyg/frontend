import { render, screen, waitFor } from '@testing-library/react'
import { Mock, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CareProviderItem } from './CareProviderItem'
import { fakeVardgivare } from '../../../utils/fake'
import { Mottagning, Vardenhet } from '../../../schemas'

let handleChooseUnit: Mock<unknown[], unknown>
const vardgivare = fakeVardgivare({ namn: 'Alfa Medicin' })
let selectedRadio: string | null
beforeEach(() => {
  handleChooseUnit = vi.fn()
})

function renderComponent() {
  return render(<CareProviderItem handleChooseUnit={handleChooseUnit} provider={vardgivare} selectedRadio={selectedRadio} />)
}

it('renders without error', () => {
  expect(() => renderComponent()).not.toThrow()
})

it('should display care unit', () => {
  renderComponent()
  const expectedValue = vardgivare.vardenheter[0].namn
  const label = screen.getByText(vardgivare.vardenheter[0].namn)
  expect(label.textContent).toBe(expectedValue)
})

it('should display sub care unit', () => {
  renderComponent()
  const receptions: Mottagning[] = vardgivare.vardenheter.flatMap(
    (vardenhet: Vardenhet) => vardenhet.mottagningar ?? [].flatMap((mottagning) => mottagning ?? [])
  )
  const subUnits = receptions.filter((unit) => unit !== undefined)
  const expectedSubUnit = subUnits[0].namn
  const label = screen.getByText(expectedSubUnit)
  expect(label.textContent).toBe(expectedSubUnit)
})

it('should set care unit to selected unit', async () => {
  renderComponent()
  const careUnit = vardgivare.vardenheter[0]
  const radioBtn = screen.getByLabelText(careUnit.namn)
  await userEvent.click(radioBtn)
  await waitFor(() => {
    expect(handleChooseUnit).toHaveBeenCalledTimes(1)
    expect(handleChooseUnit).toHaveBeenCalledWith(expect.anything(), vardgivare, careUnit)
  })
})

it('should set sub care unit to selected unit', async () => {
  renderComponent()
  const receptions: Mottagning[] = vardgivare.vardenheter.flatMap(
    (vardenhet: Vardenhet) => vardenhet.mottagningar ?? [].flatMap((mottagning) => mottagning ?? [])
  )
  const subUnits = receptions.filter((unit) => unit !== undefined)
  const expectedSubUnit = subUnits[0].namn
  const radioBtn = screen.getByLabelText(expectedSubUnit)
  await userEvent.click(radioBtn)
  await waitFor(() => {
    expect(handleChooseUnit).toHaveBeenCalledTimes(1)
    expect(handleChooseUnit).toHaveBeenCalledWith(expect.anything(), vardgivare, subUnits[0])
  })
})
