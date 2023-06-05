import { act, screen } from '@testing-library/react'
import { Table } from '../../../components/Table/Table'
import { api } from '../../../store/api'
import { hideColumn, PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientTableHeader } from './PatientTableHeader'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it('Should render all columns', async () => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor={false} />
    </Table>
  )

  expect(await screen.findAllByRole('columnheader')).toHaveLength(Object.keys(PatientColumn).length)
})

it('Should render all columns but doctor if user is doctor', async () => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor />
    </Table>
  )

  expect(await screen.findAllByRole('columnheader')).toHaveLength(Object.keys(PatientColumn).length - 1)
  expect(screen.queryByRole('columnheader', { name: 'Läkare' })).not.toBeInTheDocument()
})

it.each(Object.values(PatientColumn))('Should render and hide %s column', async (column) => {
  renderWithRouter(
    <Table>
      <PatientTableHeader isDoctor={false} />
    </Table>
  )
  expect(await screen.findByRole('columnheader', { name: column })).toBeInTheDocument()

  await act(() => store.dispatch(hideColumn(column)))

  expect(screen.queryByRole('columnheader', { name: column })).not.toBeInTheDocument()
})
