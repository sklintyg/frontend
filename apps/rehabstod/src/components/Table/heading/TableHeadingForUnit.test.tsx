import { render, screen } from '@testing-library/react'
import { TableHeadingForUnit } from './TableHeadingForUnit'
import { User, UserUrval } from '../../../schemas'
import { fakeUser } from '../../../utils/fake/fakeUser'

const TABLE_NAME = 'pågående sjukfall'

const renderComponent = (user: User, suffix?: string) => {
  render(<TableHeadingForUnit tableName={TABLE_NAME} user={user} suffix={suffix} />)
}

describe('TableHeadingForUnit', () => {
  it('should render without throwing error', () => {
    expect(() => renderComponent(fakeUser())).not.toThrow()
  })

  it('should show title for doctor', () => {
    renderComponent(fakeUser({ urval: UserUrval.ISSUED_BY_ME, valdVardenhet: { namn: 'enhetsnamn' } }))
    expect(screen.getByText('Mina pågående sjukfall')).toBeInTheDocument()
  })

  it('should show title for reko', () => {
    renderComponent(fakeUser({ urval: '', valdVardenhet: { namn: 'enhetsnamn' } }))
    expect(screen.getByText('Alla pågående sjukfall')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent(fakeUser({ urval: '', valdVardenhet: { namn: 'enhetsnamn' } }))
    expect(screen.getByText('enhetsnamn')).toBeInTheDocument()
  })

  it('should only print title for printing', () => {
    renderComponent(fakeUser({ urval: '', valdVardenhet: { namn: 'enhetsnamn' } }))
    expect(screen.queryByText('Alla pågående sjukfall på enhetsnamn')).toHaveClass('hidden print:block')
  })
})
