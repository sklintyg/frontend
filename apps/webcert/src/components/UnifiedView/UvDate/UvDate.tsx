import type { ValueDate } from '../../../types/certificate'
import { Badge } from '../Badge'

export const UvDate = ({ value }: { value: ValueDate }) => (
  <Badge>{typeof value.date === 'string' && value.date.length > 0 ? value.date : 'Ej angivet'}</Badge>
)
