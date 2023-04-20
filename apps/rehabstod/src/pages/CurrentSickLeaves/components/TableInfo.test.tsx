import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { TableInfo } from './TableInfo'
import { renderWithRouter } from '../../../utils/renderWithRouter'

function ComponentWrapper() {
  const [checked, updateChecked] = useState(true)

  return (
    <TableInfo
      onShowPersonalInformationChange={() => updateChecked(!checked)}
      showPersonalInformation={checked}
      listLength={10}
      totalNumber={20}
      daysBetweenCertificates="5"
      daysAfterSickLeaveEnd="3"
    />
  )
}

beforeEach(() => {
  renderWithRouter(<ComponentWrapper />)
})

describe('TableInfo', () => {
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
      const checkbox = screen.getByLabelText('Visa personuppgifter', { exact: false })
      expect(checkbox).toBeChecked()
    })

    it('should uncheck hide personal information checkbox if clicked', async () => {
      const checkbox = screen.getByLabelText('Visa personuppgifter', { exact: false })
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
  })
})
