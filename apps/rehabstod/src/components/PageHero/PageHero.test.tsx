import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PageHero } from './PageHero'

it('Should render without error', () => {
  expect(() => render(<PageHero />)).not.toThrow()
})
