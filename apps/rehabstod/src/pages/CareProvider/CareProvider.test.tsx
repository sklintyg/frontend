import { renderWithRouter } from '../../utils/renderWithRouter'
import { CareProvider } from './CareProvider'

it('Should render without error', () => {
  expect(() => renderWithRouter(<CareProvider />)).not.toThrow()
})
