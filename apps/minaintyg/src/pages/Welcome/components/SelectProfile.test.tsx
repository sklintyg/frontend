import { faker, fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { testabilityPersonSchema } from '../../../schema/testability/person.schema'
import { SelectProfile } from './SelectProfile'

faker.seed(1234)
const persons = Array.from({ length: 5 }, fakerFromSchema(testabilityPersonSchema))

it('Should render persons as options', () => {
  render(<SelectProfile persons={persons} onChange={vi.fn()} />)
  expect(screen.getAllByRole('option')).toHaveLength(5)
})

it('Should call onChange when clicking on option', async () => {
  const onChange = vi.fn()
  render(<SelectProfile persons={persons} onChange={onChange} />)

  await userEvent.selectOptions(screen.getByRole('listbox'), screen.getByRole('option', { name: 'Lula Schmitt V (197105016834)' }))
  expect(onChange).toHaveBeenCalledTimes(1)
})
