import { fakerFromSchema } from '@frontend/fake'
import { act, screen } from '@testing-library/react'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import { Route, Routes } from 'react-router-dom'
import { Table } from '../../../components/Table/Table'
import { sickLeaveInfoSchema } from '../../../schemas/sickLeaveSchema'
import { api } from '../../../store/api'
import { hideColumn, SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { store } from '../../../store/store'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TableBodyRows } from './TableBodyRows'

beforeEach(() => {
  store.dispatch(api.endpoints.getUser.initiate())
})

describe('Change focus', () => {
  let user: UserEvent

  beforeEach(() => {
    const result = renderWithRouter(
      <Table>
        <tbody>
          <TableBodyRows
            isLoading={false}
            showPersonalInformation
            sickLeaves={Array.from({ length: 2 }, fakerFromSchema(sickLeaveInfoSchema))}
            unitId="Alfa Vårdenhet"
            isDoctor={false}
          />
        </tbody>
      </Table>
    )

    user = result.user
  })

  it('Should gain focus with tab', async () => {
    expect(await screen.findAllByRole('row')).toHaveLength(2)

    expect(document.body).toHaveFocus()

    await user.tab()

    expect(screen.getAllByRole('row')[0]).toHaveFocus()
  })

  it('Should change focus with arrow keys', async () => {
    expect(await screen.findAllByRole('row')).toHaveLength(2)

    screen.getAllByRole('row')[0].focus()

    await user.keyboard('{ArrowDown}')

    expect(screen.getAllByRole('row')[1]).toHaveFocus()

    await user.keyboard('{ArrowUp}')

    expect(screen.getAllByRole('row')[0]).toHaveFocus()
  })
})

describe('Navigate', () => {
  let user: UserEvent

  beforeEach(() => {
    const result = renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <Table>
              <tbody>
                <TableBodyRows
                  isLoading={false}
                  showPersonalInformation
                  sickLeaves={[fakerFromSchema(sickLeaveInfoSchema)({ patient: { id: 'aperiam' } })]}
                  unitId="Alfa Vårdenhet"
                  isDoctor={false}
                />
              </tbody>
            </Table>
          }
        />
        <Route path={`/pagaende-sjukfall/${btoa('aperiam')}`} element={<p>Patient Route</p>} />
      </Routes>
    )

    user = result.user
  })

  it('Should navigate to patient on click', async () => {
    expect(await screen.findByRole('row')).toBeInTheDocument()
    await user.click(screen.getAllByRole('row')[0])

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on enter key', async () => {
    expect(await screen.findByRole('row')).toBeInTheDocument()
    screen.getAllByRole('row')[0].focus()

    await user.keyboard('{Enter}')

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on space key', async () => {
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
        <TableBodyRows sickLeaves={sickLeaves} isLoading={false} showPersonalInformation unitId="Alfa Vårdenhet" isDoctor={false} />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(12)
})

it('Should be possible to hide columns', async () => {
  const sickLeaves = Array.from({ length: 10 }, fakerFromSchema(sickLeaveInfoSchema))
  renderWithRouter(
    <Table>
      <tbody>
        <TableBodyRows sickLeaves={sickLeaves} isLoading={false} showPersonalInformation unitId="Alfa Vårdenhet" isDoctor={false} />
      </tbody>
    </Table>
  )

  expect(await screen.findAllByRole('row')).toHaveLength(10)
  expect(screen.getAllByRole('row')[0].children).toHaveLength(12)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Grad)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(11)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Intyg)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(10)

  await act(() => store.dispatch(hideColumn(SickLeaveColumn.Diagnos)))
  expect(screen.getAllByRole('row')[0].children).toHaveLength(9)
})
