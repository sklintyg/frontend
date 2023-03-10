import { IDSHeader, IDSHeaderItem } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'

export function LayoutHeader() {
  // TODO: add "unresponsive" once fixed in ids-core - <IDSHeader unresponsive />
  return (
    <IDSHeader type="inera-admin" className="ids-hide ids-show-inera-admin" brandText="Rehabstöd">
      <IDSHeaderItem separator-left icon="user">
        <Link to="login">Logga in</Link>
      </IDSHeaderItem>
    </IDSHeader>
  )
}
