import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { Popover } from './Popover'
import { PopoverContent } from './PopoverContent'
import { PopoverTrigger } from './PopoverTrigger'

it('Should render without crash', () => {
  expect(() =>
    render(
      <Popover>
        <PopoverContent>
          <p>Hello</p>
        </PopoverContent>
        <PopoverTrigger asChild>
          <button type="button">Button</button>
        </PopoverTrigger>
      </Popover>
    )
  ).not.toThrow()
})

it('Should be closed by default', () => {
  render(
    <Popover>
      <PopoverContent>
        <p>Hello</p>
      </PopoverContent>
      <PopoverTrigger>
        <div aria-label="My Button">Press me</div>
      </PopoverTrigger>
    </Popover>
  )

  expect(screen.getByLabelText('My Button')).toBeInTheDocument()

  const dialog = screen.getByRole('button', { name: 'My Button' })
  expect(dialog).toHaveAttribute('aria-expanded', 'false')
  expect(dialog).toHaveAttribute('aria-haspopup', 'dialog')
  expect(dialog).toHaveAttribute('data-state', 'closed')
})

it('Should be possible to control open state', () => {
  render(
    <Popover open>
      <PopoverContent>
        <p>Hello</p>
      </PopoverContent>
      <PopoverTrigger>
        <div aria-label="My Button">Press me</div>
      </PopoverTrigger>
    </Popover>
  )

  expect(screen.getByLabelText('My Button')).toBeInTheDocument()
  const dialog = screen.getByRole('button', { name: 'My Button' })
  expect(dialog).toHaveAttribute('aria-expanded', 'true')
  expect(dialog).toHaveAttribute('aria-haspopup', 'dialog')
  expect(dialog).toHaveAttribute('data-state', 'open')
})

it('Should display content when popover trigger is pressed', async () => {
  render(
    <Popover>
      <PopoverContent>
        <p>Hello</p>
      </PopoverContent>
      <PopoverTrigger>
        <div aria-label="My Button">Press me</div>
      </PopoverTrigger>
    </Popover>
  )
  await userEvent.click(screen.getByLabelText('My Button'))
  const dialog = screen.getByRole('button', { name: 'My Button' })
  expect(dialog).toHaveAttribute('aria-expanded', 'true')
  expect(dialog).toHaveAttribute('aria-haspopup', 'dialog')
  expect(dialog).toHaveAttribute('data-state', 'open')
})
