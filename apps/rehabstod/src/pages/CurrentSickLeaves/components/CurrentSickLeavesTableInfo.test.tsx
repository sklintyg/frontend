import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { CurrentSickLeavesTableInfo } from './CurrentSickLeavesTableInfo'

function renderComponent() {
  return renderWithRouter(
    <CurrentSickLeavesTableInfo listLength={10} totalNumber={20} daysBetweenCertificates="5" daysAfterSickLeaveEnd="3" />
  )
}

it('Should show info text of list length', () => {
  renderComponent()
  expect(screen.getByText('10 av 20', { exact: false })).toBeInTheDocument()
})

it('Should show info text of days between', () => {
  renderComponent()
  expect(screen.getByText('5 dagar', { exact: false })).toBeInTheDocument()
})

it('Should show info text of days after', () => {
  renderComponent()
  expect(screen.getByText('3 dagar', { exact: false })).toBeInTheDocument()
})

describe('Show personal information', () => {
  it('should show hide personal information', () => {
    renderComponent()
    expect(screen.getByText('Visa personuppgifter')).toBeInTheDocument()
  })

  it('should check hide personal information checkbox as default', () => {
    renderComponent()
    const checkbox = screen.getByLabelText('Visa personuppgifter', { exact: false })
    expect(checkbox).toBeChecked()
  })

  it('should uncheck hide personal information checkbox if clicked', async () => {
    renderComponent()
    const checkbox = screen.getByLabelText('Visa personuppgifter', { exact: false })
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
