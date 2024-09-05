import type React from 'react'
import type { ConfigUeCheckboxBoolean, ValueBoolean } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvBoolean: React.FC<{
  value: ValueBoolean
  config: ConfigUeCheckboxBoolean
}> = ({ value, config }) => (
  <Badge>{value.selected == null ? 'Ej angivet' : value.selected ? config.selectedText : config.unselectedText}</Badge>
)
