import React from 'react'
import { ValueDate } from '../../../types/certificateDataValue'
import { Badge } from '../Badge'

export const UvDate: React.FC<{ value: ValueDate }> = ({ value }) => (
  <Badge>{typeof value.date === 'string' && value.date.length > 0 ? value.date : 'Ej angivet'}</Badge>
)
