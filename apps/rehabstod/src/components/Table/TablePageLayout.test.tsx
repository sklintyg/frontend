import { rest } from 'msw'
import { screen, within } from '@testing-library/react'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { TablePageLayout } from './TablePageLayout'

it('Should display alert when request for fetching doctors is empty', async () => {
  server.use(rest.get('/api/certificate/lu/doctors', (_, res, ctx) => res(ctx.status(200), ctx.json({ doctors: [] }))))
  renderWithRouter(
    <TablePageLayout
      printable={false}
      tableName="tableName"
      filters={undefined}
      tableInfo={undefined}
      heading={undefined}
      modifyTableColumns={undefined}
    >
      <div>children</div>
    </TablePageLayout>
  )
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(within(screen.getByRole('alert')).getByText(/Det finns inga läkarutlåtanden på/i)).toBeInTheDocument()
})
