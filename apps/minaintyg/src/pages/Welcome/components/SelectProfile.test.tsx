import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { testabilityPersonSchema } from '../../../schema/testability/person.schema'
import { SelectProfile } from './SelectProfile'

const persons = Array.from({ length: 5 }, fakerFromSchema(testabilityPersonSchema, { seed: 1 }))

it('Should render persons as options', () => {
  render(<SelectProfile persons={persons} onChange={vi.fn()} />)
  expect(screen.getAllByRole('option')).toHaveLength(5)
})

it('Should call onChange when clicking on option', async () => {
  const onChange = vi.fn()
  render(<SelectProfile persons={persons} onChange={onChange} />)

  await userEvent.selectOptions(screen.getByRole('listbox'), screen.getByRole('option', { name: 'Alberto Stamm (198303193968)' }))
  expect(onChange).toHaveBeenCalledTimes(1)
})
