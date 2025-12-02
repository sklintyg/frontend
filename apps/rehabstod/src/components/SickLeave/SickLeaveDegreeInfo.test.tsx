import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SickLeaveDegreeInfo } from './SickLeaveDegreeInfo'

describe('SickLeaveDegreeInfo', () => {
  it('should render "Okänt" when degrees array is empty', () => {
    render(<SickLeaveDegreeInfo degrees={[]} />)
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })

  it('should render single degree without arrow', () => {
    render(<SickLeaveDegreeInfo degrees={[50]} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should render multiple degrees with arrows', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50, 75]} />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should apply bold class to active degree', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50, 75]} activeDegree={50} />)
    const activeDegreeElement = screen.getByText('50%')
    expect(activeDegreeElement).toHaveClass('font-bold')
  })

  it('should not apply bold class to non-active degrees', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50, 75]} activeDegree={50} />)
    const nonActiveDegree = screen.getByText('25%')
    expect(nonActiveDegree).not.toHaveClass('font-bold')
  })

  it('should render only first and last degrees when minimal is true', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50, 75, 100]} minimal />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
    expect(screen.queryByText('75%')).not.toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should render all degrees when minimal is false', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50, 75]} minimal={false} />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should render both degrees in minimal mode when only two degrees exist', () => {
    render(<SickLeaveDegreeInfo degrees={[25, 50]} minimal />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
