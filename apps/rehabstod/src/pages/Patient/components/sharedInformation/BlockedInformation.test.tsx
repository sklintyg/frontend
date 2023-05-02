import { render, screen } from '@testing-library/react'
import { OpenInformation } from './OpenInformation'
import { BlockedInformation } from './BlockedInformation'

const ITEMS = ['1', 'V2', 'Test test 3']

const renderComponent = () => {
  render(<BlockedInformation items={ITEMS} />)
}

describe('OpenInformation', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show list of items', () => {
    renderComponent()
    expect(screen.getByText(ITEMS[0])).toBeInTheDocument()
    expect(screen.getByText(ITEMS[1])).toBeInTheDocument()
    expect(screen.getByText(ITEMS[2])).toBeInTheDocument()
  })

  it('should not show get information button', () => {
    renderComponent()
    expect(screen.queryAllByText('Hämta')).toHaveLength(0)
  })

  it('should not show has gotten information message', () => {
    renderComponent()
    expect(screen.queryAllByText('Hämtad')).toHaveLength(0)
  })
})
