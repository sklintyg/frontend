import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CurrentSickLeavesTableInfo } from './CurrentSickLeavesTableInfo'

const LIST_LENGTH = 10
const TOTAL_NUMBER = 20
const DAYS_BETWEEN = '5'
const DAYS_AFTER = '3'
let onShowPersonalInformation: () => void

const renderComponent = () => {
  onShowPersonalInformation = vi.fn()
  render(
    <CurrentSickLeavesTableInfo
      onShowPersonalInformation={onShowPersonalInformation}
      listLength={LIST_LENGTH}
      totalNumber={TOTAL_NUMBER}
      daysBetweenCertificates={DAYS_BETWEEN}
      daysAfterSickLeaveEnd={DAYS_AFTER}
    />
  )
}
describe('CurrentSickLeavesFilters', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('Should show info text of list length', () => {
    expect(screen.getByText('10 av 20', { exact: false })).toBeInTheDocument()
  })

  it('Should show info text of days between', () => {
    expect(screen.getByText('5 dagar', { exact: false })).toBeInTheDocument()
  })

  it('Should show info text of days after', () => {
    expect(screen.getByText('3 dagar', { exact: false })).toBeInTheDocument()
  })

  it('Should show change button', () => {
    expect(screen.getByText('Ändra')).toBeInTheDocument()
  })

  describe('Show personal information', () => {
    it('should show hide personal information', () => {
      expect(screen.getByText('Visa personuppgifter')).toBeInTheDocument()
    })

    it('should check hide personal information checkbox as default', () => {
      const checkbox = screen.getByLabelText('Visa personuppgifter')
      expect(checkbox).toBeChecked()
    })

    it('should uncheck hide personal information checkbox if clicked', async () => {
      const checkbox = screen.getByLabelText('Visa personuppgifter')
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
  })
})
