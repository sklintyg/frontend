import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { ModifyTableColumns } from './ModifyTableColumns'
import { tableColumnSchema } from '../../../schemas/tableSchema'

it('Should render without crash', async () => {
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  expect(() =>
    render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={vi.fn()} />)
  ).not.toThrow()
})

it('Should present a list of columns', async () => {
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('button'))

  expect(screen.getAllByLabelText(/flytta upp/i)).toHaveLength(3)
  expect(screen.getAllByLabelText(/flytta ner/i)).toHaveLength(3)
  expect(screen.getByRole('button', { name: 'Återställ' })).toBeInTheDocument()
})

it('Should trigger reset when pressing the button', async () => {
  const onReset = vi.fn()
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={onReset} onVisibilityChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('button'))

  await userEvent.click(screen.getByRole('button', { name: 'Återställ' }))

  expect(onReset).toHaveBeenCalledTimes(1)
})

it('Should trigger visibility change on desired column', async () => {
  const onVisibleChange = vi.fn()
  const columns = Array.from({ length: 3 }, fakerFromSchema(tableColumnSchema)).map((column) => ({
    ...column,
    disabled: false,
    visible: true,
  }))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={onVisibleChange} />)

  await userEvent.click(screen.getByRole('button'))

  await userEvent.click(screen.getAllByRole('checkbox')[0])

  expect(onVisibleChange).toHaveBeenCalledTimes(1)
  expect(onVisibleChange).toHaveBeenCalledWith(columns[0].name, false)
})
