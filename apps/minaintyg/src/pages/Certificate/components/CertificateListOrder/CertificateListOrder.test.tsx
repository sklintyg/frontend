import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { CertificateListOrder } from './CertificateListOrder'

it('Should render with order set to "descending"', () => {
  const { container } = render(<CertificateListOrder order="descending" setOrder={vi.fn()} />)
  expect(container).toMatchSnapshot()
})

it('Should render with order set to "ascending"', () => {
  const { container } = render(<CertificateListOrder order="ascending" setOrder={vi.fn()} />)
  expect(container).toMatchSnapshot()
})

it('Should return "descending" when newest is pressed', async () => {
  const setOrder = vi.fn()
  render(<CertificateListOrder order="ascending" setOrder={setOrder} />)
  await userEvent.click(screen.getByRole('button', { name: 'Nyast först' }))
  expect(setOrder).toHaveBeenCalledTimes(1)
  expect(setOrder).toHaveBeenCalledWith('descending')
})

it('Should return "ascending" when oldest is pressed', async () => {
  const setOrder = vi.fn()
  render(<CertificateListOrder order="descending" setOrder={setOrder} />)
  await userEvent.click(screen.getByRole('button', { name: 'Äldst först' }))
  expect(setOrder).toHaveBeenCalledTimes(1)
  expect(setOrder).toHaveBeenCalledWith('ascending')
})
