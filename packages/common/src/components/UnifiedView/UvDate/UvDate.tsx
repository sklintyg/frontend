import React from 'react'
import { Badge } from '../Badge'
import { ValueDate } from '../../../types/certificate'

export const UvDate: React.FC<{ value: ValueDate }> = ({ value }) => (
  <Badge label={typeof value.date === 'string' ? value.date : 'Ej angivet'} />
)
