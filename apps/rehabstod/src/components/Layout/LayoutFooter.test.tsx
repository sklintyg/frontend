import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LayoutFooter } from './LayoutFooter'
import { renderWithRouter } from '../../utils/renderWithRouter'

it('Should display links', async () => {
  renderWithRouter(<LayoutFooter />)

  expect(
    screen.getByText(
      'Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering.'
    )
  ).toBeInTheDocument()

  expect(await screen.findAllByText('ineraManualRehabstod')).toHaveLength(2)
  expect(await screen.findAllByText('ineraNationellKundservice')).toHaveLength(2)
  expect(await screen.findAllByText('ineraMainPage')).toHaveLength(2)
  expect(await screen.findAllByText('ineraBehandlingPersonuppgifter')).toHaveLength(2)
})
