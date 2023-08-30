export interface Column {
  name: string
  width?: number
  description?: string
  sticky?: 'left' | 'top' | 'right'
  sortable?: boolean
}
