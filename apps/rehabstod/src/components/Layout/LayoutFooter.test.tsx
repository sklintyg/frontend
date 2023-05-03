import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { LayoutFooter } from './LayoutFooter'

it('Should display links', async () => {
  renderWithRouter(<LayoutFooter />)

  expect(await screen.findByText('ineraManualRehabstod')).toBeInTheDocument()
  expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  expect(await screen.findByText('ineraMainPage')).toBeInTheDocument()
  expect(await screen.findByText('ineraBehandlingPersonuppgifter')).toBeInTheDocument()
})
