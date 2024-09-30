import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakerFromSchema } from 'fake'
import { vi } from 'vitest'
import { testabilityPersonSchema } from '../../../schema/testability/person.schema'
import { SelectProfile } from './SelectProfile'

const persons = Array.from({ length: 5 }, fakerFromSchema(testabilityPersonSchema))

it('Should render persons as options', () => {
  render(<SelectProfile persons={persons} onChange={vi.fn()} />)
  expect(screen.getAllByRole('option')).toHaveLength(5)
})

it('Should call onChange when clicking on option', async () => {
  const onChange = vi.fn()
  render(<SelectProfile persons={persons} onChange={onChange} />)
  await userEvent.selectOptions(screen.getByRole('listbox'), screen.getAllByRole('option')[3])
  expect(onChange).toHaveBeenCalledTimes(1)
})
