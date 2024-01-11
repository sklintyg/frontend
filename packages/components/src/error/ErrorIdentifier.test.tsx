import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { ErrorIdentifier } from './ErrorIdentifier'

it('Should be possible to copy identifier to clipboard', async () => {
  const user = userEvent.setup()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText')
  render(<ErrorIdentifier id="abc123" />)
  await user.click(screen.getByRole('button'))
  expect(screen.getByText(/fel-id kopierat till urklipp/i)).toBeInTheDocument()
  expect(writeText).toHaveBeenCalledWith('abc123')
})

it('Should not show title if showTitle is false', async () => {
  render(<ErrorIdentifier id="abc123" showTitle={false} />)
  expect(screen.queryByText('Fel-id:')).not.toBeInTheDocument()
})

it('Should show title if showTitle is true', async () => {
  render(<ErrorIdentifier id="abc123" showTitle />)
  expect(screen.getByText('Fel-id:')).toBeInTheDocument()
})

it('Should show title as default', async () => {
  render(<ErrorIdentifier id="abc123" />)
  expect(screen.getByText('Fel-id:')).toBeInTheDocument()
})
