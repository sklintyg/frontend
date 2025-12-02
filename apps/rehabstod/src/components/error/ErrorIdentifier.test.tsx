import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { ErrorIdentifier } from './ErrorIdentifier'

it('Should be possible to copy identifier to clipboard', async () => {
  const user = userEvent.setup()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText')
  render(<ErrorIdentifier id="abc123" />)
  await user.click(screen.getByRole('button'))
  expect(screen.getByText(/fel-id kopierat till urklipp/i)).toBeInTheDocument()
  expect(writeText).toHaveBeenCalledWith('abc123')
})

it('Should show title as default', async () => {
  render(<ErrorIdentifier id="abc123" />)
  expect(screen.getByText('Fel-id:')).toBeInTheDocument()
})
