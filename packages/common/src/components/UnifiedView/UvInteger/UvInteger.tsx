import React from 'react'
import { ValueInteger } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvInteger: React.FC<{ value: ValueInteger }> = ({ value }) => (
  <Badge>{typeof value.value === 'number' && value.value ? value.value.toString() : 'Ej angivet'}</Badge>
)
