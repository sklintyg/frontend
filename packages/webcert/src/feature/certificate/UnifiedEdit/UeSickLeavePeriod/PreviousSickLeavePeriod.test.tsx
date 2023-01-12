import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { PreviousSickLeavePeriod } from './PreviousSickLeavePeriod'

const renderComponent = (previousSickLeavePeriod: string) => {
  render(<PreviousSickLeavePeriod previousSickLeavePeriod={previousSickLeavePeriod} />)
}

describe('Previous Sick leave period', () => {
  it('renders without crashing', () => {
    renderComponent('Text')
  })

  it('does not display previous sick leave period if empty', () => {
    renderComponent('')
    expect(screen.queryByRole('p')).not.toBeInTheDocument()
  })

  it('does display previous sick leave period', () => {
    const expectedPreviousSickLeavePeriod = 'This is the previous sick leave period'
    renderComponent(expectedPreviousSickLeavePeriod)
    expect(screen.queryByText(expectedPreviousSickLeavePeriod)).toBeInTheDocument()
  })
})
