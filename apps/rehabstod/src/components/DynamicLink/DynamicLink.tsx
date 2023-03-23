import { IDSIcon } from '@frontend/ids-react-ts'
import { Link } from '@frontend/types'

export type DynamicLinkType = 'regular' | 'footer' | 'sub-footer'

export function DynamicLink({ type = 'regular', link: { url, target, text } }: { link: Link; type?: DynamicLinkType }) {
  const size = type === 'sub-footer' ? '15px' : '0.875em'
  const styles: Record<DynamicLinkType, string> = {
    regular: 'text-accent-40 decoration-accent-40',
    footer: 'text-neutral-20 decoration-neutral-20',
    'sub-footer': 'text-white decoration-white',
  }

  return (
    <a href={url} target={target} className={`${styles[type]} underline`} rel={target === '_blank' ? 'noreferrer' : undefined}>
      {text}
      {target === '_blank' && (
        <IDSIcon
          className="inline pl-2 align-middle"
          width={size}
          height={size}
          slot="append-icon"
          name="external"
          color="currentColor"
          color2="currentColor"
        />
      )}
    </a>
  )
}
