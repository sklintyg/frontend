import type { Link } from '../../schemas'
import { classNames } from '../../utils/classNames'

export type DynamicLinkType = 'regular' | 'footer' | 'sub-footer-mobile' | 'sub-footer-desktop'

export function DynamicLink({
  light,
  underlined,
  small,
  colorpreset,
  arrow,
  link,
}: {
  link?: Link
  light?: boolean
  underlined?: boolean
  small?: boolean
  arrow?: boolean
  colorpreset?: 1 | 2 | 3
}) {
  if (link == null) {
    return null
  }

  const { url, target, text } = link

  const external = target === '_blank'

  return (
    <a
      href={url}
      target={target}
      className={classNames(
        arrow && 'ids-icon-arrow-link ids-link--start-icon',
        external && !arrow && `ids-icon-external-link${small ? '-small' : ''} ids-link--end-icon`,
        'ids-link',
        light && 'ids-link--light',
        underlined && 'ids-link--underlined',
        small && 'ids-link--small',
        colorpreset && `ids-link--color-${colorpreset}`,
        'whitespace-nowrap'
      )}
      rel={target === '_blank' ? 'noreferrer' : undefined}
    >
      {text}
      {external && arrow && <span className="ids-icon-external-link-small ids-icon--text-end" />}
    </a>
  )
}
