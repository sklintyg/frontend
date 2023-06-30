import { fakerFromSchema } from '@frontend/fake'
import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { ReactNode } from 'react'
import { Table } from '../../../../components/Table/Table'
import { server } from '../../../../mocks/server'
import { patientSjukfallIntygSchema } from '../../../../schemas/patientSchema'
import { api } from '../../../../store/api'
import { hideColumn, PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { store } from '../../../../store/store'
import { fakeUser } from '../../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { PatientContext, usePatientState } from '../../hooks/usePatient'
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

it('Should list all certificates columns except Visa', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 1)
})

it('Should list all certificates columns besides doctor if user is doctor', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 2)
})

it('Should be possible to hide columns', async () => {
  const certificates = Array.from({ length: 10 }, fakerFromSchema(patientSjukfallIntygSchema))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 1)

  await act(() => store.dispatch(hideColumn(PatientColumn.Grad)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 2)

  await act(() => store.dispatch(hideColumn(PatientColumn.Num)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 3)

  await act(() => store.dispatch(hideColumn(PatientColumn.Diagnos)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 4)
})

it('Should not display visa button for other units if otherVardgivare', () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ valdVardenhet: { id: 'foo' } })))))
  const certificates = Array.from({ length: 10 }, () => fakerFromSchema(patientSjukfallIntygSchema)({ otherVardgivare: true }))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  expect(screen.queryByText('Visa')).not.toBeInTheDocument()
})

it('Should not display visa button for other units if otherVardenhet', () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ valdVardenhet: { id: 'foo' } })))))
  const certificates = Array.from({ length: 10 }, () => fakerFromSchema(patientSjukfallIntygSchema)({ otherVardenhet: true }))
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  expect(screen.queryByText('Visa')).not.toBeInTheDocument()
})
