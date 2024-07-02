import type React from 'react'
import { Badge } from '../Badge'
import type { ValueUncertainDate } from '../../../types/certificate'

export const UvUncertainDate: React.FC<{ value: ValueUncertainDate }> = ({ value }) => (
  <Badge>{typeof value.value === 'string' ? value.value : 'Ej angivet'}</Badge>
)
