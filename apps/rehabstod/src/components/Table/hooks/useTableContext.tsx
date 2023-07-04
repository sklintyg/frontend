import { useContext } from 'react'
import { TableContext } from './useTable'

export const useTableContext = () => {
  const context = useContext(TableContext)

  if (context == null) {
    throw new Error('Table components must be wrapped in <Table />')
  }

  return context
}
