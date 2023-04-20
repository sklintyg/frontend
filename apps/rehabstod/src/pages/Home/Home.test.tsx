import { renderWithRouter } from '../../utils/renderWithRouter'
import { Home } from './Home'

it('Should render without error', () => {
  expect(() => renderWithRouter(<Home />)).not.toThrow()
})
