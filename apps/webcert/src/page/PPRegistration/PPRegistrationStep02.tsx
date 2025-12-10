import { isEqual } from 'lodash-es'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import { useLazyGetZipCodeInfoQuery } from '../../store/api'
import { updateField, validateData } from '../../store/pp/ppStep02ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import PPDropdown from './components/PPDropdown'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { ValidationError } from './components/ValidationError'

const municipalityTooltip = 'Om systemet får fler träffar för kommun vid hämtning av uppgiften ska du ange vilken kommun som är rätt.'

export function PPRegistrationStep02() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPasteError, setShowPasteError] = useState(false)
  const [previousZipCode, setPreviousZipCode] = useState<string>('')
  const [clearZipCodeInfo, setClearZipCodeInfo] = useState(false)
  const { phoneNumber, email, emailRepeat, address, zipCode, city, county, municipality } = useAppSelector(
    (state) => state.ui.pp.step02.data,
    isEqual
  )
  const errors = useAppSelector((state) => state.ui.pp.step02.errors)
  const [getZipCodeInfo, { data: zipCodeInfo, isError: isZipCodeError }] = useLazyGetZipCodeInfoQuery()

  const activeZipCodeInfo = clearZipCodeInfo ? undefined : zipCodeInfo

  useEffect(() => {
    if (`${zipCode}`.length === 5 && activeZipCodeInfo?.at(0)?.zipCode !== zipCode) {
      const zipCodeChanged = previousZipCode !== zipCode && previousZipCode !== ''
      if (zipCodeChanged) {
        dispatch(updateField({ field: 'city', value: '' }))
        dispatch(updateField({ field: 'municipality', value: '' }))
        dispatch(updateField({ field: 'county', value: '' }))
      }
      setPreviousZipCode(zipCode)
      setClearZipCodeInfo(false)
      getZipCodeInfo(zipCode)
    }
  }, [getZipCodeInfo, zipCode, activeZipCodeInfo, dispatch, previousZipCode])

  useEffect(() => {
    if (activeZipCodeInfo && activeZipCodeInfo.length === 1) {
      const data = activeZipCodeInfo[0]
      dispatch(updateField({ field: 'municipality', value: data.municipality }))
      dispatch(updateField({ field: 'city', value: data.city }))
      dispatch(updateField({ field: 'county', value: data.county }))
    }
  }, [activeZipCodeInfo, dispatch])

  const sanatizeInput = () => {
    return (event: { currentTarget: { value: string } }) => {
      event.currentTarget.value = event.currentTarget.value.replace(/\D+/g, '')
    }
  }

  const checkEmptyField = (newZipCode: string) => {
    if (!newZipCode || newZipCode.length === 0) {
      dispatch(updateField({ field: 'city', value: '' }))
      dispatch(updateField({ field: 'municipality', value: '' }))
      dispatch(updateField({ field: 'county', value: '' }))
      setPreviousZipCode('')
      setClearZipCodeInfo(true)
    }
  }

  return (
    <PPPage>
      <div className="flex flex-col">
        <h2 className="mb-5 text-secondary-95">Kontaktuppgifter till verksamheten</h2>
        <p className="max-w-xl mb-4">
          Ange de kontaktuppgifter du vill ska användas när Inera eller intygsmottagare behöver kontakta dig. Uppgifter om postort, kommun
          och län fylls i automatiskt.
        </p>
        <p className="max-w-xl mb-4">Fält markerade med asterisk (*) är obligatoriska.</p>
      </div>
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step02.errors) {
            navigate('/register/steg-3')
          }
        }}
        actions={<PPRegistrationAction prevStep={1} />}
        isZipCodeError={isZipCodeError}
      >
        <div>
          <TextInput
            label="Telefonnummer"
            required
            showAsterix
            tooltip="Telefonnummer fylls i med siffror 0-9."
            type="number"
            inputMode="numeric"
            onInput={sanatizeInput()}
            hasValidationError={!!errors?.phoneNumber}
            value={phoneNumber}
            onChange={(event) => dispatch(updateField({ field: 'phoneNumber', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.phoneNumber}</ValidationError>
        </div>

        <div>
          <TextInput
            label="E-postadress"
            required
            showAsterix
            hasValidationError={!!errors?.email}
            value={email}
            onChange={(event) => dispatch(updateField({ field: 'email', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.email}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Upprepa e-postadress"
            required
            showAsterix
            hasValidationError={!!errors?.emailRepeat || showPasteError}
            value={emailRepeat}
            onChange={(event) => {
              setShowPasteError(false)
              dispatch(updateField({ field: 'emailRepeat', value: event.currentTarget.value }))
            }}
            onPaste={(event) => {
              event.preventDefault()
              setShowPasteError(true)
            }}
          />
          {showPasteError ? (
            <ValidationError>Ange e-postadressen genom att skriva in den. </ValidationError>
          ) : (
            <ValidationError>{errors?.emailRepeat}</ValidationError>
          )}
        </div>

        <div>
          <TextInput
            label="Postadress"
            required
            showAsterix
            hasValidationError={!!errors?.address}
            value={address}
            onChange={(event) => dispatch(updateField({ field: 'address', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.address}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Postnummer"
            required
            showAsterix
            type="number"
            min={1}
            max={99999}
            maxLength={5}
            value={zipCode}
            hasValidationError={errors?.zipCode != null}
            onChange={(event) => {
              const newZipCode = event.currentTarget.value
              dispatch(updateField({ field: 'zipCode', value: newZipCode }))
              checkEmptyField(newZipCode)
            }}
          />
          <ValidationError>{errors?.zipCode}</ValidationError>
        </div>

        <div>
          <TextInput label="Postort" italicLabel disabled value={city} />
        </div>

        <div>
          {!activeZipCodeInfo || activeZipCodeInfo.length === 0 ? (
            <TextInput label="Kommun" disabled value="" tooltip={municipalityTooltip} />
          ) : activeZipCodeInfo.length === 1 ? (
            <TextInput label="Kommun" disabled value={municipality} tooltip={municipalityTooltip} />
          ) : (
            <>
              <PPDropdown
                label="Kommun (obligatoriskt)"
                value={municipality}
                hasValidationError={!!errors?.municipality}
                onChange={(event) => {
                  dispatch(updateField({ field: 'municipality', value: event.currentTarget.value }))

                  const data = activeZipCodeInfo.find(({ municipality }) => municipality === event.currentTarget.value)
                  if (data) {
                    dispatch(updateField({ field: 'city', value: data.city }))
                    dispatch(updateField({ field: 'county', value: data.county }))
                  }
                }}
                tooltip={municipalityTooltip}
              >
                <option value="">Välj kommun</option>
                {activeZipCodeInfo?.map(({ municipality }) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </PPDropdown>
              <ValidationError>{errors?.municipality}</ValidationError>
            </>
          )}
        </div>

        <div>
          <TextInput label="Län" italicLabel disabled value={county} />
        </div>
      </PPForm>
    </PPPage>
  )
}
