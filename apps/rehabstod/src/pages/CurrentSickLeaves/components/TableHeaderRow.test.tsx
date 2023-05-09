import { act, screen } from '@testing-library/react'
import { Table } from '../../../components/Table/Table'
import { api } from '../../../store/api'
import { hideColumn, SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TableHeaderRow } from './TableHeaderRow'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it('Should render all columns', async () => {
  renderWithRouter(
    <Table>
      <thead>
        <TableHeaderRow showPersonalInformation />
      </thead>
    </Table>
  )

  expect(await screen.findAllByRole('columnheader')).toHaveLength(12)
})

it.each(Object.values(SickLeaveColumn))('Should render and hide %s column', async (column) => {
  renderWithRouter(
    <Table>
      <thead>
        <TableHeaderRow showPersonalInformation />
      </thead>
    </Table>
  )
  expect(await screen.findByRole('columnheader', { name: column })).toBeInTheDocument()

  await act(() => store.dispatch(hideColumn(column)))

  expect(screen.queryByRole('columnheader', { name: column })).not.toBeInTheDocument()
})
