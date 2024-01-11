import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'

const renderComponent = (previousSickLeavePeriod: string) => {
  render(<PreviousSickLeavePeriod previousSickLeavePeriod={previousSickLeavePeriod} />)
}

describe('Previous Sick leave period', () => {
  it('renders without crashing', () => {
    expect(() => renderComponent('Text')).not.toThrow()
  })

  it('does not display previous sick leave period if empty', () => {
    renderComponent('')
    expect(screen.queryByRole('p')).not.toBeInTheDocument()
  })

  it('does display previous sick leave period', () => {
    const expectedPreviousSickLeavePeriod = 'This is the previous sick leave period'
    renderComponent(expectedPreviousSickLeavePeriod)
    expect(screen.getByText(expectedPreviousSickLeavePeriod)).toBeInTheDocument()
  })
})
