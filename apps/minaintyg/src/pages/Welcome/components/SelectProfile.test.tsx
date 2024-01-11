import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SelectProfile } from './SelectProfile'
import { testabilityPersonSchema } from '../../../schema/testability/person.schema'

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
