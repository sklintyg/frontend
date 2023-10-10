import { fakerFromSchema } from '@frontend/fake'
import { act, screen, within } from '@testing-library/react'
import { rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { Table } from '../../../components/Table/Table'
import { server } from '../../../mocks/server'
import { sickLeaveInfoSchema } from '../../../schemas/sickLeaveSchema'
import { api } from '../../../store/api'
import { SickLeaveColumn, hideColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TableBodyRows } from './TableBodyRows'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

describe('Change focus', () => {
  function renderComponent() {
    return renderWithRouter(
      <Table>
        <tbody>
          <TableBodyRows
            isLoading={false}
            showPersonalInformation
            sickLeaves={Array.from({ length: 2 }, fakerFromSchema(sickLeaveInfoSchema))}
            user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
            isDoctor={false}
          />
        </tbody>
      </Table>
    )
  }

  it('Should gain focus with tab', async () => {
    const { user } = renderComponent()
    expect(await screen.findAllByRole('row')).toHaveLength(2)

    expect(document.body).toHaveFocus()

    await user.tab()

    expect(screen.getAllByRole('row')[0]).toHaveFocus()
  })

  it('Should change focus with arrow keys', async () => {
    const { user } = renderComponent()
    expect(await screen.findAllByRole('row')).toHaveLength(2)

    screen.getAllByRole('row')[0].focus()

    await user.keyboard('{ArrowDown}')

    expect(screen.getAllByRole('row')[1]).toHaveFocus()

    await user.keyboard('{ArrowUp}')

    expect(screen.getAllByRole('row')[0]).toHaveFocus()
  })
})

describe('Navigate', () => {
  function renderComponent() {
    return renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <Table>
              <tbody>
                <TableBodyRows
                  isLoading={false}
                  showPersonalInformation
                  sickLeaves={[fakerFromSchema(sickLeaveInfoSchema)({ encryptedPatientId: 'aperiam' })]}
                  user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
                  isDoctor={false}
                />
              </tbody>
            </Table>
          }
        />
        <Route path="/pagaende-sjukfall/aperiam" element={<p>Patient Route</p>} />
      </Routes>
    )
  }

  it('Should navigate to patient on click', async () => {
    const { user } = renderComponent()
    expect(await screen.findByRole('row')).toBeInTheDocument()
    await user.click(screen.getAllByRole('row')[0])

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on enter key', async () => {
    const { user } = renderComponent()
    expect(await screen.findByRole('row')).toBeInTheDocument()
    screen.getAllByRole('row')[0].focus()

    await user.keyboard('{Enter}')

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on space key', async () => {
    const { user } = renderComponent()
    expect(await screen.findByRole('row')).toBeInTheDocument()

    screen.getAllByRole('row')[0].focus()

    await user.keyboard('[Space]')

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })
})

it('Should render all sickleave columns', async () => {
  const sickLeaves = Array.from({ length: 10 }, fakerFromSchema(sickLeaveInfoSchema))
  renderWithRouter(
    <Table>
      <tbody>
        <TableBodyRows
          sickLeaves={sickLeaves}
          isLoading={false}
          showPersonalInformation
          user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
          isDoctor={false}
        />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(15)
})

it('Should render all but doctor column if user is doctor', async () => {
  const sickLeaves = Array.from({ length: 10 }, fakerFromSchema(sickLeaveInfoSchema))
  renderWithRouter(
    <Table>
      <tbody>
        <TableBodyRows
          sickLeaves={sickLeaves}
          isLoading={false}
          showPersonalInformation
          user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
          isDoctor
        />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(14)
})

it('Should render risk column if feature is activated', async () => {
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

  const sickLeaves = Array.from({ length: 10 }, fakerFromSchema(sickLeaveInfoSchema))
  renderWithRouter(
    <Table>
      <tbody>
        <TableBodyRows
          sickLeaves={sickLeaves}
          isLoading={false}
          showPersonalInformation
          user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
          isDoctor={false}
        />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(16)
})

it('Should be possible to hide columns', async () => {
  const sickLeaves = Array.from({ length: 10 }, fakerFromSchema(sickLeaveInfoSchema))
  renderWithRouter(
    <Table>
      <tbody>
        <TableBodyRows
          sickLeaves={sickLeaves}
          isLoading={false}
          showPersonalInformation
          user={fakeUser({ valdVardenhet: { namn: 'Alfa Vårdenhet' } })}
          isDoctor={false}
        />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(15)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Grad)))
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(14)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Intyg)))
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(13)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Diagnos)))
  expect(within(screen.getAllByRole('row')[0]).getAllByRole('cell')).toHaveLength(12)
})
