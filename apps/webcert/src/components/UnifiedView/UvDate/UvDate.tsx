import type React from 'react'
import { Badge } from '../Badge'
import type { ValueDate } from '../../../types/certificate'

export const UvDate: React.FC<{ value: ValueDate }> = ({ value }) => (
  <Badge>{typeof value.date === 'string' && value.date.length > 0 ? value.date : 'Ej angivet'}</Badge>
)
