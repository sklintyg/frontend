import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import { Route, Routes } from 'react-router-dom'
import { Table } from '../../../components/Table/Table'
import { sickLeaveInfoSchema } from '../../../schemas/sickLeaveSchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TableBodyRows } from './TableBodyRows'

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
    expect(screen.getAllByRole('row')).toHaveLength(2)

    expect(document.body).toHaveFocus()

    await user.tab()

    expect(screen.getAllByRole('row')[0]).toHaveFocus()
  })

  it('Should change focus with arrow keys', async () => {
    expect(screen.getAllByRole('row')).toHaveLength(2)

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
                  sickLeaves={[fakerFromSchema(sickLeaveInfoSchema)({ uid: 'aperiam' })]}
                  unitId="Alfa Vårdenhet"
                  isDoctor={false}
                />
              </tbody>
            </Table>
          }
        />
        <Route path="/pagaende-sjukfall/aperiam" element={<p>Patient Route</p>} />
      </Routes>
    )

    user = result.user
  })

  it('Should navigate to patient on click', async () => {
    await user.click(screen.getAllByRole('row')[0])

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on enter key', async () => {
    screen.getAllByRole('row')[0].focus()

    await user.keyboard('{Enter}')

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })

  it('Should navigate to patient on space key', async () => {
    screen.getAllByRole('row')[0].focus()

    await user.keyboard('[Space]')

    expect(screen.getByText('Patient Route')).toBeInTheDocument()
  })
})
