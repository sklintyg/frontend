import React from 'react'
import { Value } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvYear: React.FC<{ value: Value }> = ({ value }) => (
  <Badge>{typeof value.year === 'number' && value.year ? value.year.toString() : 'Ej angivet'}</Badge>
)
