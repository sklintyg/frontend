import type { Link } from '../../schemas'
import { classNames } from '../../utils/classNames'

export type DynamicLinkType = 'regular' | 'footer' | 'sub-footer'

export function DynamicLink({ type = 'regular', link }: { link?: Link; type?: DynamicLinkType }) {
  // const size = type === 'sub-footer' ? '15px' : '0.875em'
  const styles: Record<DynamicLinkType, string> = {
    regular: 'text-accent-40 decoration-accent-40',
    footer: 'text-neutral-20 decoration-neutral-20',
    'sub-footer': '',
  }

  if (link == null) {
    return null
  }

  const { url, target, text } = link

  return (
    <a href={url} target={target} className={classNames(styles[type], 'underline')} rel={target === '_blank' ? 'noreferrer' : undefined}>
      {text}
      {target === '_blank' && <span className="ids-icon-external-link-small ids-icon--text-end" />}
    </a>
  )
}
