import React from 'react'
import { Value } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvInteger: React.FC<{ number: Value }> = ({ number }) => (
  <Badge>{typeof number.value === 'number' && number.value ? number.value.toString() : 'Ej angivet'}</Badge>
)
