import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Table } from '../../../components/Table/Table'
import { api } from '../../../store/api'
import { hideColumn, SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TableHeaderRow } from './TableHeaderRow'
import { server } from '../../../mocks/server'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it('Should render all columns', async () => {
  renderWithRouter(
    <Table>
      <thead>
        <TableHeaderRow showPersonalInformation isDoctor={false} />
      </thead>
    </Table>
  )

  expect(await screen.findAllByRole('columnheader')).toHaveLength(13)
})

it('Should render all but doctor column if user is doctor', async () => {
  renderWithRouter(
    <Table>
      <thead>
        <TableHeaderRow showPersonalInformation isDoctor />
      </thead>
    </Table>
  )

  expect(await screen.findAllByRole('columnheader')).toHaveLength(12)
  expect(screen.queryByRole('columnheader', { name: 'Läkare' })).not.toBeInTheDocument()
})

describe('Risk column activated', () => {
  beforeEach(() => {
    server.use(
      rest.get('/api/sickleaves/filters', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            srsActivated: true,
          })
        )
      )
    )
  })

  it.skip('Should render risk column if feature is activated', async () => {
    renderWithRouter(
      <Table>
        <thead>
          <TableHeaderRow showPersonalInformation isDoctor={false} />
        </thead>
      </Table>
    )

    expect(await screen.findAllByRole('columnheader')).toHaveLength(14)
  })

  it.each(Object.values(SickLeaveColumn))('Should render and hide %s column', async (column) => {
    renderWithRouter(
      <Table>
        <thead>
          <TableHeaderRow showPersonalInformation isDoctor={false} />
        </thead>
      </Table>
    )
    expect(await screen.findByRole('columnheader', { name: column })).toBeInTheDocument()

    await act(() => store.dispatch(hideColumn(column)))

    expect(screen.queryByRole('columnheader', { name: column })).not.toBeInTheDocument()
  })
})
