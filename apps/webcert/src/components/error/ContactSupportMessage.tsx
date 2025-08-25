import WCDynamicLink from '../../utils/WCDynamicLink'

export function ContactSupportMessage() {
  return (
    <span>
      Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
      <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
    </span>
  )
}
