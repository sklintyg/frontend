import type React from 'react'
import { Badge } from '../Badge'

export const UvText: React.FC<{ value: { text?: string | null } }> = ({ value }) => (
  <Badge>{typeof value.text === 'string' && value.text.length > 0 ? value.text : 'Ej angivet'}</Badge>
)
