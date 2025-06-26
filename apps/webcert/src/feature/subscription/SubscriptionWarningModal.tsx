import type React from 'react'
import { useEffect, useState } from 'react'
import { CustomButton } from '../../components/Inputs/CustomButton'
import ModalBase from '../../components/utils/Modal/ModalBase'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { acknowledgeSubscription } from '../../store/user/userActions'
import { getUserResourceLinks } from '../../store/user/userSelectors'
import { ResourceLinkType } from '../../types'
import WCDynamicLink from '../../utils/WCDynamicLink'

const ModalContent = () => {
  return (
    <div>
      <p className="iu-mb-400">Du ser detta meddelande för att du eller din verksamhet saknar abonnemang.</p>

      <p className="iu-mb-400">
        För att kunna skriva intyg i Webcert behöver du eller din verksamhet teckna kundavtal med Inera samt beställa abonnemang för
        tjänsten.
      </p>

      <p className="iu-mb-400">Utan abonnemang kan du endast läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.</p>

      <p className="iu-mb-400">
        Läs mer om Webcert och hur du beställer <WCDynamicLink linkKey="ineraIntygstjansterWebcert" />.
      </p>

      <p>
        Om du tidigare använt Webcert och inte längre vill nyttja tjänsten måste du eller din verksamhet inkomma med avslutsbegäran. Den
        reglerar din verksamhets skyldighet att omhänderta intygsinformation <WCDynamicLink linkKey="ineraAvslutaTjansten" />.
      </p>
    </div>
  )
}

const SubscriptionWarningModal = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const userLinks = useAppSelector(getUserResourceLinks)

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
      title="Abonnemang för Webcert saknas"
      content={<ModalContent />}
      buttons={<CustomButton onClick={handleClose} buttonStyle="secondary" text="Stäng" />}
      enableCross={false}
    />
  )
}

export default SubscriptionWarningModal
