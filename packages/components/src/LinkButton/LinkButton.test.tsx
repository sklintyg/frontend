import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LinkButton } from './LinkButton'

it('Should render as expected', () => {
  render(<LinkButton href="//some-link">Test</LinkButton>)
  expect(screen.getByRole('link', { name: 'Test' })).toBeInTheDocument()
})
