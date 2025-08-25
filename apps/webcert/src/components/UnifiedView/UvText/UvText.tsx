import { Badge } from '../Badge'

export const UvText = ({ value }: { value: { text?: string | null } }) => (
  <Badge>{typeof value.text === 'string' && value.text.length > 0 ? value.text : 'Ej angivet'}</Badge>
)
