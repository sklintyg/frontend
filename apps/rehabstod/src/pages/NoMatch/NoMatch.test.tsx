import { expect, it } from 'vitest'
import { NoMatch } from './NoMatch'
import { renderWithRouter } from '../../utils/renderWithRouter'

it('Should render without error', () => {
  expect(() => renderWithRouter(<NoMatch />)).not.toThrow()
})
