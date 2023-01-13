import React from 'react'
import { Badge } from '../Badge'
import { Value } from '../../../types/certificate'

export const UvText: React.FC<{ value: Value }> = ({ value }) => (
  <Badge>{typeof value.text === 'string' && value.text.length > 0 ? value.text : 'Ej angivet'}</Badge>
)
