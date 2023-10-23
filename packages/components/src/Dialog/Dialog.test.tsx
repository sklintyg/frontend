import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Dialog } from './Dialog'

function DialogWrapper({ intialOpen }: { intialOpen: boolean }) {
  const [open, setOpen] = useState(intialOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
