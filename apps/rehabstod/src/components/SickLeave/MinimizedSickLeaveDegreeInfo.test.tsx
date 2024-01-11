import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { MinimizedSickLeaveDegreeInfo } from './MinimizedSickLeaveDegreeInfo'

const renderComponent = (degrees: number[]) => {
  render(<MinimizedSickLeaveDegreeInfo degrees={degrees} />)
}
describe('MinimizedSickLeaveDegreeInfo', () => {
  it('should show first sick leave degree', () => {
    renderComponent([25, 50, 75, 100])
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('should show last sick leave degree', () => {
    renderComponent([25, 50, 75, 100])
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should not show second sick leave degree', () => {
    renderComponent([25, 50, 75, 100])
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('should not show third sick leave degree', () => {
    renderComponent([25, 50, 75, 100])
    expect(screen.queryByText('75%')).not.toBeInTheDocument()
  })

  it('should show unknown if no degrees', () => {
    renderComponent([])
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })
})
