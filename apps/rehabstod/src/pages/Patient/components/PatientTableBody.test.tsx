import { fakerFromSchema } from '@frontend/fake'
import { act, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { Table } from '../../../components/Table/Table'
import { patientSjukfallIntygSchema } from '../../../schemas/patientSchema'
import { api } from '../../../store/api'
import { PatientColumn, hideColumn } from '../../../store/slices/patientTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientContext, usePatientState } from '../hooks/usePatient'
import { PatientTableBody } from './PatientTableBody'

function ComponentWrapper({ children }: { children: ReactNode }) {
  const state = usePatientState()
  return (
    <PatientContext.Provider value={state}>
      <Table>{children}</Table>
    </PatientContext.Provider>
  )
}

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

it('Should list all certificates columns', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(10)
})

it('Should list all certificates columns besides doctor if user is doctor', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(9)
})

it('Should be possible to hide columns', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </ComponentWrapper>
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
