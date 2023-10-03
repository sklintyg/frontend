import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { SelectRekoStatus } from './SelectRekoStatus'

const TYPES = [
  { id: 'id', name: 'name' },
  { id: 'id1', name: 'name1' },
]
const PATIENT_ID = '1912121212'
const END_DATE = '2022-01-01'

const renderComponent = (disabled?: boolean) => {
  renderWithRouter(
    <SelectRekoStatus
      patientId={PATIENT_ID}
      endDate={END_DATE}
      startDate={END_DATE}
      rekoStatusTypes={TYPES}
      disabled={disabled}
      description="description"
    />
  )
}

describe('SelectRekoStatus', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render label', () => {
    renderComponent()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should not render default option', () => {
    renderComponent()
    expect(screen.queryByText('Visa alla')).not.toBeInTheDocument()
  })

  it('should render options', () => {
    renderComponent()
    expect(screen.getAllByRole('option')).toHaveLength(TYPES.length)
  })

  it('should be enabled as default', () => {
    renderComponent()
    expect(screen.getByLabelText('Status')).toBeEnabled()
  })

  it('should set disabled value', () => {
    renderComponent(true)
    expect(screen.getByLabelText('Status')).toBeDisabled()
  })
})
