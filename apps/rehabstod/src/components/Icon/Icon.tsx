import { IDSIcon, IDSTooltip } from '@frontend/ids-react-ts'

export function Icon({ description, type, size }: { description: string; type: string; size: 'xs' | 's' | 'm' | undefined }) {
  return (
    <IDSTooltip>
      <IDSIcon slot="trigger" name={type} size={size} colorpreset={1} />
      <div slot="tooltip">{description}</div>
    </IDSTooltip>
  )
}
