import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { testabilityPersonSchema } from '../../../schema/testability/person.schema'
import { ResultTextArea } from './ResultTextArea'

const fakePerson = fakerFromSchema(testabilityPersonSchema)

it('Should display freeText before person', () => {
  render(<ResultTextArea freeText="text 123" person={fakePerson()} onChange={vi.fn()} />)
  expect(screen.getByRole('textbox')).toHaveValue('text 123')
})

it('Should display person as JSON when freeText is undefined', () => {
  const expected = { personId: '194112128154', personName: 'Alve Alfredsson' }
  render(<ResultTextArea person={fakePerson(expected)} onChange={vi.fn()} />)
  expect(screen.getByRole('textbox')).toHaveValue(JSON.stringify(expected, null, 2))
})

it('Should call onChange when text is written', async () => {
  const onChange = vi.fn()
  const text = 'Some text'
  render(<ResultTextArea freeText="text 123" person={fakePerson()} onChange={onChange} />)
  await userEvent.type(screen.getByRole('textbox'), text)
  expect(onChange).toHaveBeenCalledTimes(text.length)
})
