import { render, screen } from '@testing-library/react'
import { fakeUser } from '../../../../utils/fake/fakeUser'
import { EmptyPatientTableMessage } from './EmptyPatientTableMessage'

describe('EmptyPatientTableMessage', () => {
  it('should show default text if user is not defined', () => {
    render(
      <table>
        <tbody>
          <EmptyPatientTableMessage tableName="sjukfall" tableLength={10} />
        </tbody>
      </table>
    )
    expect(screen.getByText('Patienten har inga sjukfall på enheten.')).toBeInTheDocument()
  })

  it('should show message with unit name if user is defined', () => {
    render(
      <table>
        <tbody>
          <EmptyPatientTableMessage tableName="läkarutlåtanden" tableLength={10} user={fakeUser({ valdVardenhet: { namn: 'unitName' } })} />
        </tbody>
      </table>
    )
    expect(screen.getByText('Patienten har inga läkarutlåtanden på unitName.')).toBeInTheDocument()
  })
})
