import { Icon } from '@frontend/components'
import { IDSLink } from '@inera/ids-react'
import { Link } from 'react-router-dom'

export function StartPageLink() {
  return (
    <div className="text-center">
      <IDSLink>
        <Link to="/">
          <Icon icon="arrow-right-small" textStart />
          Till startsidan
        </Link>
      </IDSLink>
    </div>
  )
}
