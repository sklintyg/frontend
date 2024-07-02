import type React from 'react'
import type { ValueYear } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvYear: React.FC<{ value: ValueYear }> = ({ value }) => (
  <Badge>{typeof value.year === 'number' && value.year ? value.year.toString() : 'Ej angivet'}</Badge>
)
