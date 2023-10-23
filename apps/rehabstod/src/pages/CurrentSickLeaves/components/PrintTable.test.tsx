import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Table } from '../../../components/Table/Table'
import { sickLeaveInfoSchema } from '../../../schemas/sickLeaveSchema'
import { api } from '../../../store/api'
import { hideColumn, SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PrintTable } from './PrintTable'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it.each(Object.values(SickLeaveColumn).map((col) => (col === 'Personnummer' ? [col, 'Personnr'] : [col, col])))(
  'Should render and hide %s column',
  async (column, displayName) => {
    renderWithRouter(
      <Table
        print={
          <PrintTable
            title=""
            tableInfo=""
            sickLeaves={Array.from({ length: 1 }, fakerFromSchema(sickLeaveInfoSchema))}
            showPersonalInformation
          />
        }
      />
    )
    expect(await screen.findByText(`${displayName}`, { exact: false })).toBeInTheDocument()

    await act(() => store.dispatch(hideColumn(column)))

    expect(screen.queryByText(`${displayName}`, { exact: false })).not.toBeInTheDocument()
  }
)

it('Should hide personal information', async () => {
  renderWithRouter(
    <Table
      print={
        <PrintTable
          title=""
          tableInfo=""
          sickLeaves={Array.from({ length: 1 }, fakerFromSchema(sickLeaveInfoSchema))}
          showPersonalInformation={false}
        />
      }
    />
  )
  expect(await screen.findByText(/diagnos/i)).toBeInTheDocument()
  expect(screen.queryByText(/personnr/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/namn/i)).not.toBeInTheDocument()
})
