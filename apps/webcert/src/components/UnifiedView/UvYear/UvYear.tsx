import type { ValueYear } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvYear = ({ value }: { value: ValueYear }) => (
  <Badge>{typeof value.year === 'number' && value.year ? value.year.toString() : 'Ej angivet'}</Badge>
)
