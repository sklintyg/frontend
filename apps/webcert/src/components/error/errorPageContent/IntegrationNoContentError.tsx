import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const NO_CONTENT_ERROR_TITLE = 'Intyget gick inte att läsa in'
export const NO_CONTENT_ERROR_MESSAGE = 'Intygsutkastet är raderat och kan därför inte längre visas.'
export const CONTACT_SUPPORT_MESSAGE = (
  <span>
    Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
    <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
  </span>
)

const IntegrationNoContentError: React.FC = () => {
  return (
    <>
      <p>
        <strong>{NO_CONTENT_ERROR_TITLE}</strong>
      </p>
      <p>
        {NO_CONTENT_ERROR_MESSAGE} {CONTACT_SUPPORT_MESSAGE}
      </p>
    </>
  )
}

export default IntegrationNoContentError
