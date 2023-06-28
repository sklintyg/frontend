import { render, screen } from '@testing-library/react'
import { EmptyPatientTableMessage } from './EmptyPatientTableMessage'
import { fakeUser } from '../../utils/fake/fakeUser'

describe('EmptyPatientTableMessage', () => {
  it('should show default text if user is not defined', () => {
    render(<EmptyPatientTableMessage tableName="sjukfall" tableLength={10} />)
    expect(screen.getByText('Patienten har inga sjukfall på enheten.')).toBeInTheDocument()
  })

  it('should show message with unit name if user is defined', () => {
    render(
      <EmptyPatientTableMessage tableName="läkarutlåtanden" tableLength={10} user={fakeUser({ valdVardenhet: { namn: 'unitName' } })} />
    )
    expect(screen.getByText('Patienten har inga läkarutlåtanden på unitName.')).toBeInTheDocument()
  })
})
