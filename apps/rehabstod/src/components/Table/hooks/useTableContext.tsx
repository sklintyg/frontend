import { useContext } from 'react'
import { TableContext } from '../Table'

export const useTableContext = () => {
  const context = useContext(TableContext)

  if (context == null) {
    throw new Error('Table components must be wrapped in <Table />')
  }

  return context
}
