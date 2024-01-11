import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { Select } from './Select'

const options = Array.from({ length: 5 }, (_, i) => ({ label: `Option ${i}`, value: `${i}` }))

it('Should render label', () => {
  render(<Select label="label" />)
  expect(screen.getByLabelText('label')).toBeInTheDocument()
})

it('Should render first option', () => {
  render(<Select label="" options={[{ value: '', label: 'Visa alla' }]} />)
  expect(screen.getByRole('option', { name: 'Visa alla' })).toBeInTheDocument()
})

it('Should render options', () => {
  render(<Select label="" options={options} />)
  expect(screen.getAllByRole('option')).toHaveLength(5)
})

it('Should call on change if choosing option', async () => {
  const onChangeSpy = vi.fn()
  render(<Select label="Select Label" options={options} onChange={onChangeSpy} />)
  await userEvent.selectOptions(screen.getByLabelText('Select Label'), options[3].value)
  expect(onChangeSpy).toHaveBeenCalled()
  expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: options[3].value }) }))
})

it('Should select initial value', () => {
  render(
    <Select
      label="Select Label"
      options={[
        { label: 'first', value: 'first' },
        { label: 'second', value: 'second' },
        { label: 'third', value: 'third' },
      ]}
      value="second"
    />
  )
  expect(screen.getByLabelText('Select Label')).toHaveValue('second')
})
