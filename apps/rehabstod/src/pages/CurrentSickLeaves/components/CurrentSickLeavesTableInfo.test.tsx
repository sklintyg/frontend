import { screen } from '@testing-library/react'
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
