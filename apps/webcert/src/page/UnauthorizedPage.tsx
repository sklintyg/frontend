import WebcertHeader from '../components/header/WebcertHeader'
import CommonLayout from '../components/commonLayout/CommonLayout'
import { ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'
import { UnauthorizedStatusBox } from './PPRegistration/components/UnauthorizedStatusBox'

export function UnauthorizedPage() {
  return (
    <ResourceAccess linkType={ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER}>
      <CommonLayout header={<WebcertHeader />}>
        <div className="flex flex-col mb-4">
          <h1 className="mb-4 text-2xl font-bold">Du är inte behörig att använda Webcert</h1>
          <UnauthorizedStatusBox />
        </div>
      </CommonLayout>
    </ResourceAccess>
  )
}
