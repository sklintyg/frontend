import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { tableColumnSchema } from '../../../schemas/tableSchema'
import { ModifyTableColumns } from './ModifyTableColumns'

const fakeTableColumn = fakerFromSchema(tableColumnSchema)

it('Should render without crash', async () => {
  const columns = Array.from({ length: 3 }, () => fakeTableColumn({ visible: true }))
  expect(() =>
    render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={vi.fn()} />)
  ).not.toThrow()
})

it('Should present a list of columns', async () => {
  const columns = Array.from({ length: 3 }, () => fakeTableColumn({ visible: true }))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('combobox', { name: 'Anpassa tabeller' }))

  expect(screen.getAllByLabelText(/flytta upp/i)).toHaveLength(3)
  expect(screen.getAllByLabelText(/flytta ner/i)).toHaveLength(3)
  expect(screen.getByRole('button', { name: 'Återställ', hidden: true })).toBeInTheDocument()
})

it('Should trigger reset when pressing the button', async () => {
  const onReset = vi.fn()
  const columns = Array.from({ length: 3 }, () => fakeTableColumn({ visible: true }))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={onReset} onVisibilityChange={vi.fn()} />)

  await userEvent.click(screen.getByRole('combobox', { name: 'Anpassa tabeller' }))

  await userEvent.click(screen.getByRole('button', { name: 'Återställ', hidden: true }))

  expect(onReset).toHaveBeenCalledTimes(1)
})

it('Should trigger visibility change on desired column', async () => {
  const onVisibleChange = vi.fn()
  const columns = Array.from({ length: 3 }, () => fakeTableColumn({ disabled: false, visible: true }))
  render(<ModifyTableColumns columns={columns} onReorder={vi.fn()} onReset={vi.fn()} onVisibilityChange={onVisibleChange} />)

  await userEvent.click(screen.getByRole('combobox', { name: 'Anpassa tabeller' }))

  await userEvent.click(screen.getAllByRole('checkbox', { hidden: true })[0])

  expect(onVisibleChange).toHaveBeenCalledTimes(1)
  expect(onVisibleChange).toHaveBeenCalledWith(columns[0].name, false)
})
