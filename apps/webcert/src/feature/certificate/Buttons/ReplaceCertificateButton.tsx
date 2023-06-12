import { ButtonWithConfirmModal, DoubleArrowIcon, InfoBox } from '@frontend/common'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
}

const ReplaceCertificateButton: React.FC<Props> = ({ name, description, enabled, functionDisabled }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const isDodsbevis = certificateMetadata?.type === 'db'
  const isDodsorsaksIntyg = certificateMetadata?.type === 'doi'
  const certificate = isDodsbevis ? 'dödsbevis' : 'dödsorsaksintyg'

  const handleConfirm = () => {
    dispatch(replaceCertificate())
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<DoubleArrowIcon size="lg" />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm}
      confirmButtonText={'Ersätt'}
      buttonTestId="replace-certificate-button"
      confirmButtonDisabled={functionDisabled}
    >
      <>
        <InfoBox type="observe" activateIconWrap>
          <p>
            {isDodsbevis || isDodsorsaksIntyg
              ? `Om ${certificate}et är utfärdat på fel patient ska du istället makulera ${certificate}et.`
              : 'Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.'}
          </p>
        </InfoBox>
        <p>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </p>
        {isDodsbevis ||
          (isDodsorsaksIntyg && (
            <>
              <p>
                {`Senast skapade ${certificate} är det som gäller. Om du ersätter det tidigare ${certificate}et och lämnar in det nya så blir det därför
                detta ${certificate} som gäller.`}
              </p>
              <p>Det nya utkastet skapas på den enhet du är inloggad på.</p>
            </>
          ))}
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateButton
