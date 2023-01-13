import React from 'react'
import { ConfigUeCheckboxBoolean, ValueBoolean } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvBoolean: React.FC<{
  value: ValueBoolean
  config: ConfigUeCheckboxBoolean
}> = ({ value, config }) => (
  <Badge label={value.selected == null ? 'Ej angivet' : value.selected ? config.selectedText : config.unselectedText} />
)
