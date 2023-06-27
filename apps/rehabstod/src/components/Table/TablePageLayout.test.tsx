import { screen, within } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { TablePageLayout } from './TablePageLayout'

it('Should display alert when request for fetching doctors is empty', async () => {
  renderWithRouter(
    <TablePageLayout
      printable
      tableName="läkarutlåtanden"
      filters={undefined}
      tableInfo={undefined}
      heading={undefined}
      modifyTableColumns={undefined}
      emptyTableAlert
    >
      <div>children</div>
    </TablePageLayout>
  )
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(within(screen.getByRole('alert')).getByText(/Det finns inga läkarutlåtanden på/i)).toBeInTheDocument()
})
