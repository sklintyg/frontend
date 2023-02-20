import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import RemovedCertificate from './RemovedCertificate'

it('displays that the certificate is removed', () => {
  render(<RemovedCertificate />)
  expect(screen.getByRole('img')).toBeInTheDocument()
  expect(screen.getByText(/utkastet är borttaget/i)).toBeInTheDocument()
})
