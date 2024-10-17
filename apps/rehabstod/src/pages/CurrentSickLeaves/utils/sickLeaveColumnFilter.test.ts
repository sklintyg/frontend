import { fakerFromSchema } from 'fake'
import { tableColumnSchema } from '../../../schemas/tableSchema'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { sickLeaveColumnFilter } from './sickLeaveColumnFilter'

it('Should show columns', () => {
  const column = fakerFromSchema(tableColumnSchema)({ visible: true })
  expect(sickLeaveColumnFilter(true, false, true)(column)).toBe(true)
})

it('Hide invisible columns', () => {
  const column = fakerFromSchema(tableColumnSchema)({ visible: false })
  expect(sickLeaveColumnFilter(true, false, true)(column)).toBe(false)
})

describe('Hide personal columns', () => {
  it.each([SickLeaveColumn.Personnummer, SickLeaveColumn.Namn])('Hide %s column', (name) => {
    const column = fakerFromSchema(tableColumnSchema)({ visible: true, name })
    expect(sickLeaveColumnFilter(false, false, true)(column)).toBe(false)
  })
})

it('Should hide doctor column', () => {
  const column = fakerFromSchema(tableColumnSchema)({ visible: true, name: SickLeaveColumn.Läkare })
  expect(sickLeaveColumnFilter(true, true, true)(column)).toBe(false)
})

it('Should hide srs column', () => {
  const column = fakerFromSchema(tableColumnSchema)({ visible: true, name: SickLeaveColumn.Risk })
  expect(sickLeaveColumnFilter(true, false, false)(column)).toBe(false)
})
