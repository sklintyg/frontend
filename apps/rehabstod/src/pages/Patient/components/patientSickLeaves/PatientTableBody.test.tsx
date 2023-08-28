import { faker, fakerFromSchema } from '@frontend/fake'
import { act, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { ReactNode } from 'react'
import { Table } from '../../../../components/Table/Table'
import { server } from '../../../../mocks/server'
import { patientSjukfallIntygSchema } from '../../../../schemas/patientSchema'
import { api } from '../../../../store/api'
import { PatientColumn, hideColumn } from '../../../../store/slices/patientTableColumns.slice'
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
  server.use(rest.get('/api/sickleaves/filters', (_, res, ctx) => res(ctx.status(200), ctx.json({ srsActivated: true }))))
})

it('Should list all certificates columns except Visa', async () => {
  const certificates = Array.from(
    { length: 10 },
    fakerFromSchema(patientSjukfallIntygSchema, { stringMap: { vardgivareId: faker.datatype.uuid } })
  )
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor={false} />
    </ComponentWrapper>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(Object.keys(PatientColumn).length - 1)
}, 20000)

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
}, 20000)

it('Should not display visa button for other units if otherVardgivare', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ valdVardenhet: { id: 'foo' } })))))
  const certificates = Array.from({ length: 1 }, (_, index) =>
    fakerFromSchema(patientSjukfallIntygSchema)({ intygsId: index.toString(), otherVardgivare: true })
  )
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(1))
  expect(screen.queryByText('Visa')).not.toBeInTheDocument()
})

it('Should not display visa button for other units if otherVardenhet', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ valdVardenhet: { id: 'foo' } })))))
  const certificates = Array.from({ length: 1 }, (_, index) =>
    fakerFromSchema(patientSjukfallIntygSchema)({ intygsId: index.toString(), otherVardenhet: true })
  )
  renderWithRouter(
    <ComponentWrapper>
      <PatientTableBody certificates={certificates} isDoctor />
    </ComponentWrapper>
  )

  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(1))
  expect(screen.queryByText('Visa')).not.toBeInTheDocument()
})
