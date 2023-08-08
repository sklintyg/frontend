import { render, screen } from '@testing-library/react'
import { fakeUser } from '../../utils/fake/fakeUser'
import { TableInfoMessage } from './TableInfoMessage'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from './utils/tableTextGeneratorUtils'

const user = fakeUser({ urval: '' })
const TABLE_NAME = 'pågående sjukfall'

const renderComponent = (isLoading: boolean, hasAppliedFilters: boolean, content: { name: string }[] | null) => {
  render(
    <table>
      <TableInfoMessage
        isLoading={isLoading}
        tableLength={10}
        tableName={TABLE_NAME}
        user={user}
        content={content}
        hasAppliedFilters={hasAppliedFilters}
      />
    </table>
  )
}

describe('TableInfoMessage', () => {
  it('should render without throwing errors', () => {
    expect(() => renderComponent(true, true, [])).not.toThrow()
  })

  it('should display spinner if table loading', () => {
    renderComponent(true, true, [])
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should display search text if content is null', () => {
    renderComponent(false, false, null)
    expect(screen.getByText(getSearchText(false, TABLE_NAME), { exact: false })).toBeInTheDocument()
  })

  it('should display empty table text if content is empty but filters have not been applied', () => {
    renderComponent(false, false, [])
    expect(screen.getByText(getEmptyTableText(user, TABLE_NAME))).toBeInTheDocument()
  })

  it('should display empty table text filtration if content is empty and filters have  been applied', () => {
    renderComponent(false, true, [])
    expect(screen.getByText(getEmptyFiltrationText(TABLE_NAME))).toBeInTheDocument()
  })
})
