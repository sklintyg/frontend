import { render, screen } from '@testing-library/react'
import { BannerPriority } from '../../../schemas'
import { GlobalAlert } from './GlobalAlert'

const renderComponent = (priority: BannerPriority) => {
  render(
    <GlobalAlert priority={priority}>
      <p>Children</p>
    </GlobalAlert>
  )
}

describe('GlobalAlert', () => {
  it('should render without issues', () => {
    expect(() => renderComponent(BannerPriority.MEDIUM)).not.toThrow()
  })

  it('should render alert', () => {
    renderComponent(BannerPriority.LOW)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render children', () => {
    renderComponent(BannerPriority.LOW)
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('should render low icon', () => {
    renderComponent(BannerPriority.LOW)
    expect(screen.getByTestId('LOW_ICON')).toBeInTheDocument()
  })

  it('should render medium icon', () => {
    renderComponent(BannerPriority.MEDIUM)
    expect(screen.getByTestId('MEDIUM_ICON')).toBeInTheDocument()
  })

  it('should render high icon', () => {
    renderComponent(BannerPriority.HIGH)
    expect(screen.getByTestId('HIGH_ICON')).toBeInTheDocument()
  })
})
