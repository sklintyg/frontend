import { renderWithRouter } from '../../utils/renderWithRouter'
import { NoMatch } from './NoMatch'

it('Should render without error', () => {
  expect(() => renderWithRouter(<NoMatch />)).not.toThrow()
})
