import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CustomButton, ExternalLinkIcon, ModalBase, ResourceLinkType } from '@frontend/common'
import { getUserResourceLinks } from '../../store/user/userSelectors'
import { acknowledgeSubscription } from '../../store/user/userActions'
import WCDynamicLink from '../../utils/WCDynamicLink'

const ModalContent = () => {
  return (
    <div>
      <p className="iu-mb-1rem">Du ser detta meddelande för att du eller din verksamhet saknar abonnemang.</p>

      <p className="iu-mb-1rem">
        För att kunna skriva intyg i Webcert behöver du eller din verksamhet teckna kundavtal med Inera samt beställa abonnemang för
        tjänsten.
      </p>

      <p className="iu-mb-1rem">Utan abonnemang kan du endast läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.</p>

      <p className="iu-mb-1rem">
        Läs mer om Webcert och hur du beställer <WCDynamicLink linkKey="ineraIntygstjansterWebcert" />
      </p>

      <p>
        Om du tidigare använt Webcert och inte längre vill nyttja tjänsten måste du eller din verksamhet inkomma med avslutsbegäran. Den
        reglerar din verksamhets skyldighet att omhänderta intygsinformation{' '}
        <a
          className="ic-link ic-link--external"
          target="_blank"
          href="https://www.inera.se/kontakta-oss/fragor-om-bestallning-och-tjanster/"
          rel="noreferrer">
          Avsluta tjänsten <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
        </a>
      </p>
    </div>
  )
}

const SubscriptionWarningModal: React.FC = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const userLinks = useSelector(getUserResourceLinks)

  const subscriptionWarning = userLinks?.find((link) => link.type === ResourceLinkType.SUBSCRIPTION_WARNING)

  useEffect(() => {
    if (subscriptionWarning) {
      setOpen(true)
    }
  }, [subscriptionWarning])

  const handleClose = () => {
    setOpen(false)
    dispatch(acknowledgeSubscription())
  }

  return (
    <ModalBase
      open={open}
      handleClose={() => {
        return
      }}
      title="Automatisk avtalskontroll sker för samtliga användare"
      content={<ModalContent />}
      buttons={<CustomButton onClick={handleClose} buttonStyle="secondary" text="Stäng" />}
      enableCross={false}
    />
  )
}

export default SubscriptionWarningModal
