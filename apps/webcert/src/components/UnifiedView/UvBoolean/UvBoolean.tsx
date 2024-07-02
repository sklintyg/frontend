import React from 'react'
import { ConfigUeCheckboxBoolean } from '../../../types/certificateDataConfig'
import { ValueBoolean } from '../../../types/certificateDataValue'
import { Badge } from '../Badge'

export const UvBoolean: React.FC<{
  value: ValueBoolean
  config: ConfigUeCheckboxBoolean
}> = ({ value, config }) => (
  <Badge>{value.selected == null ? 'Ej angivet' : value.selected ? config.selectedText : config.unselectedText}</Badge>
)
