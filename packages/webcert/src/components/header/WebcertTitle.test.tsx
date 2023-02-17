import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import WebcertTitle from './WebcertTitle'

it('displays image', (): void => {
  render(<WebcertTitle />)
  expect(screen.getByRole('img')).toBeInTheDocument()
})
