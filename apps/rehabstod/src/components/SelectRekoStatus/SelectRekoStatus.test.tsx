import { screen } from '@testing-library/react'
import { SelectRekoStatus } from './SelectRekoStatus'
import { RekoStatus } from '../../schemas/sickLeaveSchema'
import { renderWithRouter } from '../../utils/renderWithRouter'

const TYPES = [{ status: { id: 'id', name: 'name' } }, { status: { id: 'id1', name: 'name1' } }]
const PATIENT_ID = '1912121212'
const END_DATE = '2022-01-01'

const renderComponent = (statusFromSickLeave: RekoStatus) => {
  renderWithRouter(
    <SelectRekoStatus statusFromSickLeave={statusFromSickLeave.status} patientId={PATIENT_ID} endDate={END_DATE} rekoStatusTypes={TYPES} />
  )
}

describe('SelectRekoStatus', () => {
  it('should render without issues', () => {
    expect(() => renderComponent(TYPES[0])).not.toThrow()
  })

  it('should render label', () => {
    renderComponent(TYPES[0])
    expect(screen.getByText('REKO-status')).toBeInTheDocument()
  })

  it('should not render default option', () => {
    renderComponent(TYPES[0])
    expect(screen.queryByText('Visa alla')).not.toBeInTheDocument()
  })

  it('should render options', () => {
    renderComponent(TYPES[0])
    expect(screen.getAllByRole('option')).toHaveLength(TYPES.length)
  })
})
