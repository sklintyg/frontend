import type React from 'react'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getIntegrationParameters, getIntegrationParametersDisablers } from '../../store/welcome/welcomeSelectors'
import SpinnerBackdrop from '../utils/SpinnerBackdrop'

interface Props {
  certificateId: string
  unitId: string
}

const WelcomeDeepIntegration: React.FC<Props> = ({ certificateId, unitId }) => {
  const formRef = useRef(null)
  const integrationParameters = useSelector(getIntegrationParameters())
  const integrationParametersDisablers = useSelector(getIntegrationParametersDisablers())
  sessionStorage.removeItem('launchId')
  useEffect(() => {
    if (formRef) {
      const form = formRef.current as unknown as HTMLFormElement
      form.submit()
    }
  }, [])

  const url = window.location.origin.replace('wc2.', '') + '/visa/intyg/' + certificateId

  return (
    <>
      <SpinnerBackdrop open={true} spinnerText={'Hoppar till Webcert!'} />
      <form ref={formRef} action={url} method="POST">
        <input hidden={true} type="text" name="enhet" value={integrationParameters.unitId ? integrationParameters.unitId : unitId} />
        {!integrationParametersDisablers.firstName && (
          <input hidden={true} type="text" name="fornamn" value={integrationParameters.firstName} />
        )}
        {!integrationParametersDisablers.middleName && (
          <input hidden={true} type="text" name="efternamn" value={integrationParameters.lastName} />
        )}
        {!integrationParametersDisablers.lastName && (
          <input hidden={true} type="text" name="mellannamn" value={integrationParameters.middleName} />
        )}
        {!integrationParametersDisablers.address && (
          <input hidden={true} type="text" name="postadress" value={integrationParameters.address} />
        )}
        {!integrationParametersDisablers.city && <input hidden={true} type="text" name="postort" value={integrationParameters.city} />}
        {!integrationParametersDisablers.zipcode && (
          <input hidden={true} type="text" name="postkod" value={integrationParameters.zipcode} />
        )}
        {!integrationParametersDisablers.launchId && (
          <input hidden={true} type="text" name="launchId" value={integrationParameters.launchId} />
        )}
        <input hidden={true} type="text" name="ref" value={integrationParameters.ref} />
        <input hidden={true} type="text" name="responsibleHospName" value={integrationParameters.responsibleHospName} />
        <input hidden={true} type="text" name="alternatePatientSSn" value={integrationParameters.alternatePatientSSN} />
        <input hidden={true} type="text" name="sjf" value={String(integrationParameters.coherentJournaling)} />
        <input hidden={true} type="text" name="kopieringOK" value={String(integrationParameters.allowCopy)} />
        <input hidden={true} type="text" name="inaktivEnhet" value={String(integrationParameters.inactiveUnit)} />
        <input hidden={true} type="submit" />
      </form>
    </>
  )
}

export default WelcomeDeepIntegration
