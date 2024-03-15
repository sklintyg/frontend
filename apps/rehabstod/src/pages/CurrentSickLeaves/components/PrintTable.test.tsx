import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { act } from 'react-dom/test-utils'
import { Table } from '../../../components/Table/Table'
import { server } from '../../../mocks/server'
import { sickLeaveFilterOptions, sickLeaveInfoSchema } from '../../../schemas/sickLeaveSchema'
import { api } from '../../../store/api'
import { updateShowPersonalInformation } from '../../../store/slices/settings.slice'
import { SickLeaveColumn, hideColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PrintTable } from './PrintTable'

beforeEach(() => {
  server.use(
    rest.get('/api/sickleaves/filters', (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakerFromSchema(sickLeaveFilterOptions)({ srsActivated: true })))
    )
  )
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ urval: 'ALL' })))))
  store.dispatch(api.endpoints.getUser.initiate())
})

it.each(Object.values(SickLeaveColumn).map((col) => (col === 'Personnummer' ? [col, 'Personnr'] : [col, col])))(
  'Should render and hide %s column',
  async (column, displayName) => {
    renderWithRouter(
      <Table print={<PrintTable title="" tableInfo="" sickLeaves={Array.from({ length: 1 }, fakerFromSchema(sickLeaveInfoSchema))} />} />
    )
    expect(await screen.findByText(displayName)).toBeInTheDocument()

    await act(() => store.dispatch(hideColumn(column)))

    expect(screen.queryByText(displayName)).not.toBeInTheDocument()
  }
)

it('Should hide personal information', async () => {
  store.dispatch(updateShowPersonalInformation(false))
  renderWithRouter(
    <Table print={<PrintTable title="" tableInfo="" sickLeaves={Array.from({ length: 1 }, fakerFromSchema(sickLeaveInfoSchema))} />} />
  )
  expect(await screen.findByText(/diagnos/i)).toBeInTheDocument()
  expect(screen.queryByText(/personnr/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/namn/i)).not.toBeInTheDocument()
})

it('Should render ended sickleaves as italic', async () => {
  store.dispatch(updateShowPersonalInformation(false))
  renderWithRouter(
    <Table
      print={
        <PrintTable
          title=""
          tableInfo=""
          sickLeaves={Array.from({ length: 1 }, () => fakerFromSchema(sickLeaveInfoSchema)({ slut: '1496-05-12' }))}
        />
      }
    />
  )
  expect(await screen.findByTestId('sickleave-row')).toBeInTheDocument()
  expect(screen.getByTestId('sickleave-row')).toHaveClass('italic')
})
