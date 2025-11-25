import { ResourceAccess } from '../utils/ResourceAccess'
import { ResourceLinkType } from '../types'

export function EditPrivatePractitionerPage() {
  return <div></div>
}

export const EditPrivatePractitionerPageWithRedirect = () => (
  <ResourceAccess linkType={ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER}>
    <EditPrivatePractitionerPage />
  </ResourceAccess>
)
