import type React from 'react'
import { Badge } from '../Badge'
import type { ValueUncertainDate } from '../../../types/certificate'

export const UvUncertainDate = ({ value }: { value: ValueUncertainDate }) => (
  <Badge>{typeof value.value === 'string' ? value.value : 'Ej angivet'}</Badge>
)
