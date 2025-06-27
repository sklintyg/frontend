import type { ValueUncertainDate } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvUncertainDate = ({ value }: { value: ValueUncertainDate }) => (
  <Badge>{typeof value.value === 'string' ? value.value : 'Ej angivet'}</Badge>
)
