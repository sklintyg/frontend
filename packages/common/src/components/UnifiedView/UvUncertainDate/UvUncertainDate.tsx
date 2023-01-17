import React from 'react'
import { Badge } from '../Badge'
import { ValueUncertainDate } from '../../../types/certificate'

export const UvUncertainDate: React.FC<{ value: ValueUncertainDate }> = ({ value }) => (
  <Badge>{typeof value.value === 'string' ? value.value : 'Ej angivet'}</Badge>
)
