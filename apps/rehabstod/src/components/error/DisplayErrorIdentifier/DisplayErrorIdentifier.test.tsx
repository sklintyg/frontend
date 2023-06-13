import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DisplayErrorIdentifier } from './DisplayErrorIdentifier'

it('Should be possible to copy identifier to clipboard', async () => {
  userEvent.setup()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText')
  render(<DisplayErrorIdentifier id="abc123" />)
  await userEvent.click(screen.getByRole('button'))
  expect(screen.queryByText(/fel-id kopierat till urklipp/i)).toBeInTheDocument()
  expect(writeText).toHaveBeenCalledWith('abc123')
})
