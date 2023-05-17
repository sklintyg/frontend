import { fakerFromSchema } from '@frontend/fake'
import { act, screen } from '@testing-library/react'
import { Table } from '../../../components/Table/Table'
import { patientSjukfallIntygSchema } from '../../../schemas/patientSchema'
import { api } from '../../../store/api'
import { hideColumn, PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientTableBody } from './PatientTableBody'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it('Should list all certificates columns', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <Table>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(10)
})

it('Should list all certificates columns besides doctor if user is doctor', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <Table>
      <PatientTableBody certificates={certificates} isDoctor />
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(9)
})

it('Should be possible to hide columns', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <Table>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(10)

  await act(() => store.dispatch(hideColumn(PatientColumn.Grad)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(9)

  await act(() => store.dispatch(hideColumn(PatientColumn.Num)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(8)

  await act(() => store.dispatch(hideColumn(PatientColumn.Diagnos)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(7)
})
