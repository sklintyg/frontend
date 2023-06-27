import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { tableColumnSchema } from '../../../schemas/tableSchema'
import { ModifyTableColumns } from './ModifyTableColumns'

it('Should present a list of columns', async () => {
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibleChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('button', { name: 'Anpassa tabeller' }))
  expect(screen.getAllByRole('button')).toHaveLength(10)
})
