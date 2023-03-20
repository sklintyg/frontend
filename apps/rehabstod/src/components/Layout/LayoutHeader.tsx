import { IDSHeader, IDSHeaderItem } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useGetLinksQuery, useGetUserQuery } from '../../store/api'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { data: links } = useGetLinksQuery()

  return (
    <IDSHeader type="inera-admin" unresponsive>
      <Link slot="brand-text" to="/">
        Rehabstöd
      </Link>
      {!isLoading && user ? (
        <IDSHeaderItem icon="question">
          <Link to="/">Om rehabstöd</Link>
        </IDSHeaderItem>
      ) : (
        <IDSHeaderItem separator-left icon="user">
          <Link to="login">Logga in</Link>
        </IDSHeaderItem>
      )}
    </IDSHeader>
  )
}
