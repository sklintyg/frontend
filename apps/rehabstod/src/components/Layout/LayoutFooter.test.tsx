import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { LayoutFooter } from './LayoutFooter'

it('Should display links', async () => {
  renderWithRouter(<LayoutFooter />)

  expect(screen.getByText('Rehabstöd används för att samordna och följa upp sjukskrivna patienters rehabilitering.')).toBeInTheDocument()

  expect(await screen.findAllByText('ineraManualRehabstod')).toHaveLength(2)
  expect(await screen.findAllByText('ineraNationellKundservice')).toHaveLength(2)
  expect(await screen.findAllByText('ineraMainPage')).toHaveLength(2)
  expect(await screen.findAllByText('ineraBehandlingPersonuppgifter')).toHaveLength(2)
})
