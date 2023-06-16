import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
        <PopoverTrigger>
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
        <button type="button" aria-label="My Button">
          Press me
        </button>
      </PopoverTrigger>
    </Popover>
  )

  expect(screen.getByRole('button', { name: 'My Button' })).toBeInTheDocument()
  const dialog = screen.getByRole('button', { name: 'My Button' }).parentElement
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
        <button type="button" aria-label="My Button">
          Press me
        </button>
      </PopoverTrigger>
    </Popover>
  )

  expect(screen.getByRole('button', { name: 'My Button' })).toBeInTheDocument()
  const dialog = screen.getByRole('button', { name: 'My Button' }).parentElement
  expect(dialog).toHaveAttribute('aria-expanded', 'true')
  expect(dialog).toHaveAttribute('aria-haspopup', 'dialog')
  expect(dialog).toHaveAttribute('data-state', 'open')
})

it('Should display content when popover trigger is pressed', async () => {
  userEvent.setup()
  render(
    <Popover>
      <PopoverContent>
        <p>Hello</p>
      </PopoverContent>
      <PopoverTrigger>
        <button type="button" aria-label="My Button">
          Press me
        </button>
      </PopoverTrigger>
    </Popover>
  )
  await userEvent.click(screen.getByRole('button', { name: 'My Button' }))
  const dialog = screen.getByRole('button', { name: 'My Button' }).parentElement
  expect(dialog).toHaveAttribute('aria-expanded', 'true')
  expect(dialog).toHaveAttribute('aria-haspopup', 'dialog')
  expect(dialog).toHaveAttribute('data-state', 'open')
})
