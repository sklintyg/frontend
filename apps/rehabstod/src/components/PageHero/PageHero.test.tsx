import { render } from '@testing-library/react'
import { PageHero } from './PageHero'

it('Should render without error', () => {
  expect(() => render(<PageHero />)).not.toThrow()
})
