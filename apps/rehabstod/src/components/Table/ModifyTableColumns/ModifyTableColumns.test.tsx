import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { tableColumnSchema } from '../../../schemas/tableSchema'
import { ModifyTableColumns } from './ModifyTableColumns'

it('Should render without crash', async () => {
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  expect(() =>
    render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibleChange={vi.fn()} />)
  ).not.toThrow()
})

it('Should present a list of columns', async () => {
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibleChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('button'))

  expect(screen.getAllByLabelText(/flytta upp/i)).toHaveLength(3)
  expect(screen.getAllByLabelText(/flytta ner/i)).toHaveLength(3)
  expect(screen.getByRole('button', { name: 'Återställ' })).toBeInTheDocument()
})

it('Should trigger reset when pressing the button', async () => {
  const onReset = vi.fn()
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={onReset} onVisibleChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('button'))

  await userEvent.click(screen.getByRole('button', { name: 'Återställ' }))

  expect(onReset).toHaveBeenCalledTimes(1)
})

it('Should trigger visibility change on pressing checkboxes', async () => {
  const onVisibleChange = vi.fn()
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibleChange={onVisibleChange} />)

  await userEvent.click(screen.getByRole('button'))

  await userEvent.click(screen.getAllByRole('checkbox')[0])

  screen.debug(screen.getAllByRole('checkbox'))

  expect(onVisibleChange).toHaveBeenCalledTimes(1)
})
