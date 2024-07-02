import React from 'react'
import { ValueUncertainDate } from '../../../types/certificateDataValue'
import { Badge } from '../Badge'

export const UvUncertainDate: React.FC<{ value: ValueUncertainDate }> = ({ value }) => (
  <Badge>{typeof value.value === 'string' ? value.value : 'Ej angivet'}</Badge>
)
