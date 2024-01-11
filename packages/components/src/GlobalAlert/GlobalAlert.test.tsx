import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { GlobalAlert, PriorityEnum } from './GlobalAlert'

const renderComponent = (priority: PriorityEnum) => {
  render(
    <GlobalAlert priority={priority}>
      <p>Children</p>
    </GlobalAlert>
  )
}

describe('GlobalAlert', () => {
  it('should render without issues', () => {
    expect(() => renderComponent(PriorityEnum.OBSERVE)).not.toThrow()
  })

  it('should render alert', () => {
    renderComponent(PriorityEnum.OBSERVE)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render children', () => {
    renderComponent(PriorityEnum.OBSERVE)
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('should render info icon', () => {
    renderComponent(PriorityEnum.INFO)
    expect(screen.getByTestId('LOW_ICON')).toBeInTheDocument()
  })

  it('should render observe icon', () => {
    renderComponent(PriorityEnum.OBSERVE)
    expect(screen.getByTestId('MEDIUM_ICON')).toBeInTheDocument()
  })

  it('should render error icon', () => {
    renderComponent(PriorityEnum.ERROR)
    expect(screen.getByTestId('HIGH_ICON')).toBeInTheDocument()
  })
})
