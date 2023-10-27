import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { TextSearchFilter } from './TextSearchFilter'

const TITLE = 'titel'
const DESCRIPTION = 'description'
const PLACEHOLDER = 'placeholder'
const TEXT_VALUE = 'textValue'
const REKO = 'Reko'

let onChange: (value: string) => void

const renderComponent = () => {
  onChange = vi.fn()
  render(
    <TextSearchFilter
      title={TITLE}
      description={DESCRIPTION}
      onTextSearchChange={onChange}
      placeholder={PLACEHOLDER}
      textValue={TEXT_VALUE}
    />
  )
}

it('should render without throwing', () => {
  expect(() => renderComponent()).not.toThrow()
})

it('should show title', () => {
  renderComponent()
  expect(screen.getByLabelText(TITLE)).toBeInTheDocument()
})

it('should call onChange', async () => {
  renderComponent()
  await userEvent.type(await screen.findByLabelText(TITLE), REKO)
  expect(onChange).toBeCalled()
})
