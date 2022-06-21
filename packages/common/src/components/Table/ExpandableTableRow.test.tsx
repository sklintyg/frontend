import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ExpandableTableRow from './ExpandableTableRow'
import userEvent from '@testing-library/user-event'

const renderComponent = () => {
  const rowContent = ['Click here', '4', '6']

  const handleClick = () => {
    return null
  }

  render(
    <ExpandableTableRow rowContent={rowContent} id="tableRowId" handleClick={handleClick}>
      <tr>
        <td>Expanded child 1</td>
        <td>10</td>
        <td>5</td>
      </tr>
    </ExpandableTableRow>
  )
}

describe('Expandable table row', () => {
  it('should show row content', () => {
    renderComponent()
    expect(screen.getByText('Click here')).toBeInTheDocument()
  })

  it('should expand rows when click on arrow', () => {
    renderComponent()
    userEvent.click(screen.getByTestId('arrowToggle'))
    expect(screen.getByText('Expanded child 1')).toBeInTheDocument()
  })

  it('should make first cell in table row a button link', () => {
    renderComponent()
    expect(screen.getAllByRole('button')[1]).toBeInTheDocument()
  })
})
