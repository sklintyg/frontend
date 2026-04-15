import type { Link } from '../../../schemas'
import { DynamicLink } from '../../DynamicLink/DynamicLink'

export function LinkColumn({ links }: { links: (Link | undefined)[] }) {
  return (
    <div className="ids-footer-1177-admin__link-col ids-footer-1177-admin__link-col--2 ids-footer-1177-admin__col-size-3">
      <ul>
        {links.map((link) =>
          link ? (
            <li key={link.key}>
              <DynamicLink link={link} arrow colorPreset={1} />
            </li>
          ) : null
        )}
      </ul>
    </div>
  )
}
