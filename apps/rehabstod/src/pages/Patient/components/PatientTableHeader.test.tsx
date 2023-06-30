import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Table } from '../../../components/Table/Table'
import { api } from '../../../store/api'
import { hideColumn, PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientTableHeader } from './PatientTableHeader'
import { server } from '../../../mocks/server'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
  server.use(rest.get('/api/sickleaves/filters', (_, res, ctx) => res(ctx.status(200), ctx.json({ srsActivated: true }))))
})

it('Should render all columns but Visa', async () => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor={false} />
    </Table>
  )

  expect(await screen.findByRole('columnheader', { name: '#' })).toBeInTheDocument()
  expect(await screen.findAllByRole('columnheader')).toHaveLength(Object.keys(PatientColumn).length - 1)
  expect(screen.queryByRole('columnheader', { name: 'Visa' })).not.toBeInTheDocument()
})

it('Should render all columns but Visa and doctor if user is doctor', async () => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor />
    </Table>
  )

  expect(await screen.findByRole('columnheader', { name: '#' })).toBeInTheDocument()
  expect(await screen.findAllByRole('columnheader')).toHaveLength(Object.keys(PatientColumn).length - 2)
  expect(screen.queryByRole('columnheader', { name: 'Läkare' })).not.toBeInTheDocument()
})

it.each(Object.values(PatientColumn).filter((name) => name !== PatientColumn.Visa))('Should render and hide %s column', async (column) => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor={false} />
    </Table>
  )
  expect(await screen.findByRole('columnheader', { name: column })).toBeInTheDocument()

  await act(() => store.dispatch(hideColumn(column)))

  expect(screen.queryByRole('columnheader', { name: column })).not.toBeInTheDocument()
})
