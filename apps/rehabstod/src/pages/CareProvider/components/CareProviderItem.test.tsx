import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { vi } from 'vitest'
import type { Mottagning, Vardenhet } from '../../../schemas'
import { vardenhetSchema } from '../../../schemas'
import { fakeVardgivare } from '../../../utils/fake/fakeVardgivare'
import { CareProviderItem } from './CareProviderItem'

let handleChooseUnit: Mock<unknown[], unknown>
const vardgivare = fakeVardgivare({ namn: 'Alfa Medicin', vardenheter: [fakerFromSchema(vardenhetSchema)({ id: faker.datatype.uuid() })] })
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
  expect(label).toHaveTextContent(expectedValue)
})

it('should display sub care unit', () => {
  renderComponent()
  const receptions: Mottagning[] = vardgivare.vardenheter.flatMap(
    (vardenhet: Vardenhet) => vardenhet.mottagningar ?? [].flatMap((mottagning) => mottagning ?? [])
  )
  const subUnits = receptions.filter((unit) => unit !== undefined)
  const expectedSubUnit = subUnits[0].namn
  const label = screen.getByText(expectedSubUnit)
  expect(label).toHaveTextContent(expectedSubUnit)
})

it('should set care unit to selected unit', async () => {
  renderComponent()
  const careUnit = vardgivare.vardenheter[0]
  const radioBtn = screen.getByLabelText(careUnit.namn)
  await userEvent.click(radioBtn)
  await waitFor(() => expect(handleChooseUnit).toHaveBeenCalledTimes(1))
  expect(handleChooseUnit).toHaveBeenCalledWith(expect.anything(), careUnit)
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
  await waitFor(() => expect(handleChooseUnit).toHaveBeenCalledTimes(1))
  expect(handleChooseUnit).toHaveBeenCalledWith(expect.anything(), subUnits[0])
})
