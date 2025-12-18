import { isEqual } from 'lodash-es'
import { useState } from 'react'
import TextInput from '../../../../components/Inputs/TextInput'
import { updateField } from '../../../../store/pp/ppStep02ReducerSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import PPDropdown from '../PPDropdown'
import { ValidationError } from '../ValidationError'

const municipalityTooltip = 'Om systemet får fler träffar för kommun vid hämtning av uppgiften ska du ange vilken kommun som är rätt.'

export function PPStep02Fields() {
  const dispatch = useAppDispatch()

  const [showPasteError, setShowPasteError] = useState(false)
  const { phoneNumber, email, emailRepeat, address, zipCode, city, county, municipality } = useAppSelector(
    (state) => state.ui.pp.step02.data,
    isEqual
  )
  const errors = useAppSelector((state) => state.ui.pp.step02.errors)
  const showValidation = useAppSelector((state) => state.ui.pp.step02.showValidation)
  const zipCodeInfo = useAppSelector((state) => state.ui.pp.step02.zipCodeInfo)

  const sanitizeInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')
  }

  return (
    <>
      <div>
        <TextInput
          id="phoneNumber"
          label="Telefonnummer"
          required
          showAsterix
          tooltip="Telefonnummer fylls i med siffror 0-9."
          type="text"
          inputMode="numeric"
          onInput={sanitizeInput}
          hasValidationError={showValidation && Boolean(errors?.phoneNumber)}
          value={phoneNumber}
          onChange={(event) => dispatch(updateField({ field: 'phoneNumber', value: event.currentTarget.value }))}
        />
        {showValidation && <ValidationError>{errors?.phoneNumber}</ValidationError>}
      </div>

      <div>
        <TextInput
          id="email"
          label="E-postadress"
          required
          showAsterix
          hasValidationError={showValidation && Boolean(errors?.email)}
          value={email}
          onChange={(event) => dispatch(updateField({ field: 'email', value: event.currentTarget.value }))}
        />
        {showValidation && <ValidationError>{errors?.email}</ValidationError>}
      </div>

      <div>
        <TextInput
          id="emailRepeat"
          label="Upprepa e-postadress"
          required
          showAsterix
          hasValidationError={(showValidation && Boolean(errors?.emailRepeat)) || showPasteError}
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
          <>{showValidation && <ValidationError>{errors?.emailRepeat}</ValidationError>}</>
        )}
      </div>

      <div>
        <TextInput
          id="address"
          label="Postadress"
          required
          showAsterix
          hasValidationError={showValidation && Boolean(errors?.address)}
          value={address}
          onChange={(event) => dispatch(updateField({ field: 'address', value: event.currentTarget.value }))}
        />
        {showValidation && <ValidationError>{errors?.address}</ValidationError>}
      </div>

      <div>
        <TextInput
          id="zipCode"
          label="Postnummer"
          required
          showAsterix
          type="text"
          inputMode="numeric"
          pattern="\d*"
          onInput={sanitizeInput}
          value={zipCode}
          hasValidationError={showValidation && errors?.zipCode != null}
          onChange={(event) => dispatch(updateField({ field: 'zipCode', value: event.currentTarget.value }))}
        />
        {showValidation && <ValidationError>{errors?.zipCode}</ValidationError>}
      </div>

      <div>
        <TextInput id="city" label="Postort" disabled value={city} />
      </div>

      <div>
        {zipCodeInfo && zipCodeInfo.length > 1 && (zipCode !== '' || errors?.municipality) ? (
          <PPDropdown
            id="municipality"
            label="Kommun (obligatoriskt)"
            value={municipality}
            hasValidationError={showValidation && Boolean(errors?.municipality)}
            onChange={(event) => {
              dispatch(updateField({ field: 'municipality', value: event.currentTarget.value }))

              const data = zipCodeInfo.find(({ municipality }) => municipality === event.currentTarget.value)
              if (data) {
                dispatch(updateField({ field: 'city', value: data.city }))
                dispatch(updateField({ field: 'county', value: data.county }))
              }
            }}
            tooltip={municipalityTooltip}
          >
            <option value="">Välj kommun</option>
            {zipCodeInfo.map(({ municipality }) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </PPDropdown>
        ) : (
          <TextInput
            id="municipality"
            label="Kommun"
            required
            showAsterix
            disabled
            value={municipality}
            hasValidationError={showValidation && Boolean(errors?.municipality)}
            tooltip={municipalityTooltip}
          />
        )}
        {showValidation && zipCodeInfo.length > 1 && <ValidationError>{errors?.municipality}</ValidationError>}
      </div>

      <div>
        <TextInput label="Län" disabled value={county} />
      </div>
    </>
  )
}
