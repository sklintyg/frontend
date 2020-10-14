import React from 'react'
import { render, screen } from '@testing-library/react'
import WebcertTitle from './WebcertTitle'

it('displays image', (): void => {
  render(<WebcertTitle />)
  screen.getByRole('img')
})
