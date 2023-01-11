import React from 'react'
import { Badge } from '../Badge'
import { Value } from '../../../types/certificate'

export const UvText: React.FC<{ value: Value }> = ({ value }) => (
  <Badge label={typeof value.text === 'string' ? value.text : 'Ej angivet'} />
)
