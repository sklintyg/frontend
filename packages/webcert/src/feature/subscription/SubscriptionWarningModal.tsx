import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CustomButton, ModalBase, ResourceLinkType } from '@frontend/common'
import { getUserResourceLinks } from '../../store/user/userSelectors'
import { acknowledgeSubscription } from '../../store/user/userActions'
import WCDynamicLink from '../../utils/WCDynamicLink'

const ModalContent = () => {
  return (
    <div>
      <p className="iu-mb-1rem">Du ser detta meddelande för att din verksamhet saknar abonnemang för Webcert.</p>

      <p className="iu-mb-1rem">
        För att er verksamhet fortsatt ska kunna utfärda intyg efter <span className="iu-color-error">2022-05-10</span> kräver Inera att ni
        tecknar kundavtal samt beställer abonnemang för tjänsten Webcert.
      </p>

      <p className="iu-mb-1rem">
        Om abonnemang saknas efter <span className="iu-color-error">2022-05-10</span> kommer inga nya intyg att kunna utfärdas. Er
        verksamhet får då endast tillgång till Webcert för att läsa tidigare utfärdade intyg.
      </p>

      <p className="iu-mb-1rem">
        Tidigare kommunicerat beslut att e-legitimationsinloggning endast är förbehållen enskild firma är omprövat. Ytterligare information
        finns på nedanstående länk.
      </p>

      <p>
        Läs mer om Webcert och hur du beställer tjänsten <WCDynamicLink linkKey="ineraIntygstjansterWebcert" />
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
