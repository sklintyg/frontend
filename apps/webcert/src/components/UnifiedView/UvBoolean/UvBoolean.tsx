import type { ConfigUeCheckboxBoolean, ValueBoolean } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvBoolean = ({ value, config }: { value: ValueBoolean; config: ConfigUeCheckboxBoolean }) => (
  <Badge>{value.selected == null ? 'Ej angivet' : value.selected ? config.selectedText : config.unselectedText}</Badge>
)
