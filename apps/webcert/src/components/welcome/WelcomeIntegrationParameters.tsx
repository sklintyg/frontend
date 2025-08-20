import type { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateIntegrationParameters, updateIntegrationParametersDisablers } from '../../store/welcome/welcomeActions'
import { getIntegrationParameters, getIntegrationParametersDisablers } from '../../store/welcome/welcomeSelectors'
import Checkbox from '../Inputs/Checkbox'
import TextInput from '../Inputs/TextInput'

const WelcomeIntegrationParameters = () => {
  const integrationParameters = useSelector(getIntegrationParameters())
  const integrationParametersDisablers = useSelector(getIntegrationParametersDisablers())
  const dispatch = useDispatch()

  return (
    <div>
      <TextInput
        ref={null}
        value={integrationParameters.alternatePatientSSN}
        label={'Nytt personnummer'}
        placeholder={'alternatePatientSSN'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.alternatePatientSSN = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <TextInput
        ref={null}
        label={'Förnamn'}
        placeholder={'fornamn'}
        value={integrationParameters.firstName}
        disabled={integrationParametersDisablers.firstName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.firstName = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Include'}
        id={'includeFirstName'}
        checked={!integrationParametersDisablers.firstName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.firstName = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Mellannamn'}
        ref={null}
        placeholder={'mellannamn'}
        value={integrationParameters.middleName}
        disabled={integrationParametersDisablers.middleName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.middleName = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        checked={!integrationParametersDisablers.middleName}
        label={'Include'}
        id={'includeMiddleName'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.middleName = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Efternamn'}
        ref={null}
        placeholder={'efternamn'}
        value={integrationParameters.lastName}
        disabled={integrationParametersDisablers.lastName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.lastName = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        checked={!integrationParametersDisablers.lastName}
        id={'includeLastname'}
        label={'Include'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.lastName = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Postadress'}
        ref={null}
        placeholder={'postadress'}
        value={integrationParameters.address}
        disabled={integrationParametersDisablers.address}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.address = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Include'}
        id={'includeAddress'}
        checked={!integrationParametersDisablers.address}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.address = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Postnummer'}
        ref={null}
        placeholder={'postnummer'}
        value={integrationParameters.zipcode}
        disabled={integrationParametersDisablers.zipcode}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.zipcode = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Include'}
        id={'includeZipcode'}
        checked={!integrationParametersDisablers.zipcode}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.zipcode = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Postort'}
        ref={null}
        placeholder={'postort'}
        value={integrationParameters.city}
        disabled={integrationParametersDisablers.city}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.city = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Include'}
        id={'includeCity'}
        checked={!integrationParametersDisablers.city}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.city = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <TextInput
        label={'Ref'}
        value={integrationParameters.ref}
        ref={null}
        placeholder={'ref'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.ref = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <TextInput
        label={'Enhetsid'}
        value={integrationParameters.unitId}
        ref={null}
        placeholder={'enhetsid'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.unitId = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <TextInput
        label={'Ansvarig läkare'}
        ref={null}
        value={integrationParameters.responsibleHospName}
        placeholder={'responsibleHospName'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.responsibleHospName = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <TextInput
        ref={null}
        value={integrationParameters.launchId}
        label={'LaunchId'}
        placeholder={'launchId'}
        disabled={integrationParametersDisablers.launchId}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.launchId = event.currentTarget.value
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Include'}
        id={'includeLaunchId'}
        checked={!integrationParametersDisablers.launchId}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newDisablers = { ...integrationParametersDisablers }
          newDisablers.launchId = !event.currentTarget.checked
          dispatch(updateIntegrationParametersDisablers(newDisablers))
        }}
      />
      <Checkbox
        label={'Sammanhållen journalföring'}
        id={'sjf'}
        checked={integrationParameters.coherentJournaling}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.coherentJournaling = event.currentTarget.checked
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Kopiering OK'}
        id={'kopieringOK'}
        checked={integrationParameters.allowCopy}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.allowCopy = event.currentTarget.checked
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
      <Checkbox
        label={'Inaktiv enhet'}
        id={'inaktivEnhet'}
        checked={integrationParameters.inactiveUnit}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newParameters = { ...integrationParameters }
          newParameters.inactiveUnit = event.currentTarget.checked
          dispatch(updateIntegrationParameters(newParameters))
        }}
      />
    </div>
  )
}

export default WelcomeIntegrationParameters
