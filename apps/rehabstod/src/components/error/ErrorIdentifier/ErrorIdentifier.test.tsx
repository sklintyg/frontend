import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ErrorIdentifier } from './ErrorIdentifier'

it('Should be possible to copy identifier to clipboard', async () => {
  const user = userEvent.setup()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText')
  render(<ErrorIdentifier id="abc123" />)
  await user.click(screen.getByRole('button'))
  expect(screen.queryByText(/fel-id kopierat till urklipp/i)).toBeInTheDocument()
  expect(writeText).toHaveBeenCalledWith('abc123')
})
