import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal, InfoBox } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCertificate } from '../../../store/certificate/certificateActions'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const ReplaceCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const isDodsbevis = certificateMetadata?.type === 'db'

  const handleConfirm = () => {
    dispatch(replaceCertificate(history))
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon size="lg" icon={faExchangeAlt} />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm}
      confirmButtonText={'Ersätt'}
      buttonTestId="replace-certificate-button"
      confirmButtonDisabled={functionDisabled}>
      <>
        <InfoBox type="observe" activateIconWrap>
          <p>
            {!isDodsbevis
              ? 'Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.'
              : 'Om dödsbeviset är utfärdat på fel patient ska du istället makulera dödsbeviset.'}
          </p>
        </InfoBox>
        <p>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </p>
        {isDodsbevis && (
          <>
            <p>
              Senast skapade dödsbevis är det som gäller. Om du ersätter det tidigare dödsbeviset och lämnar in det nya så blir det därför
              detta dödsbevis som gäller.
            </p>
            <p>Det nya utkastet skapas på den enhet du är inloggad på.</p>
          </>
        )}
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateButton
