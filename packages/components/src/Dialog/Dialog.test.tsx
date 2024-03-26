import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Dialog } from './Dialog'

function DialogWrapper({ intialOpen }: { intialOpen: boolean }) {
  const [open, setOpen] = useState(intialOpen)

  return (
    <Dialog headline="The Dialog Headline" open={open} onOpenChange={setOpen}>
      Content
    </Dialog>
  )
}

it('Should not render children while closed', () => {
  render(<DialogWrapper intialOpen={false} />)
  expect(screen.queryByText('Content')).not.toBeInTheDocument()
})

it('Should render children when open', () => {
  render(<DialogWrapper intialOpen />)
  expect(screen.getByText('Content')).toBeInTheDocument()
})

it('Should have correct headline', () => {
  render(<DialogWrapper intialOpen />)
  expect(screen.getByRole('heading', { name: 'The Dialog Headline', level: 1 })).toBeInTheDocument()
})

it('Should have headline as label', () => {
  render(<DialogWrapper intialOpen />)
  expect(screen.getByRole('dialog', { name: 'The Dialog Headline' })).toBeInTheDocument()
})
