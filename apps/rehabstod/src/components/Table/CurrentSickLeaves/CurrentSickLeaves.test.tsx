import { render, screen } from '@testing-library/react'
import {
  CURRENT_SICK_LEAVES_TABLE_HEADERS,
  CURRENT_SICK_LEAVES_TITLE,
  CurrentSickLeaves,
} from '../../../pages/CurrentSickLeaves/CurrentSickLeaves'

const renderComponent = () => render(<CurrentSickLeaves />)

describe('CurrentSickLeaves', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    expect(screen.getByText(CURRENT_SICK_LEAVES_TITLE)).toBeInTheDocument()
  })

  it.skip('should show sub title', () => {
    expect(screen.getByText('ENHETSNAMN')).toBeInTheDocument()
  })

  it.each(CURRENT_SICK_LEAVES_TABLE_HEADERS)('should show table headers', (header) => {
    expect(screen.getByText(header)).toBeInTheDocument()
  })
})
