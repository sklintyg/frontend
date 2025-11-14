import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import { updateField, validateData } from '../../store/pp/ppStep02ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { ValidationError } from './components/ValidationError'

export function PPRegistrationStep02() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPasteError, setShowPasteError] = useState(false)
  const { phoneNumber, email, emailRepeat, address, zipCode, city, municipality, county } = useAppSelector(
    (state) => state.ui.pp.step02.data
  )
  const errors = useAppSelector((state) => state.ui.pp.step02.errors)

  return (
    <PPLayout subHeader="Skapa konto: Steg 2 av 4">
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step02.errors) {
            navigate('/register/step-3')
          }
        }}
        actions={<PPRegistrationAction prevStep={1} />}
      >
        <div>
          <TextInput
            label="Telefonnummer"
            tooltip="Telefonnummer fylls i med siffror 0-9. "
            value={phoneNumber}
            onChange={(event) => dispatch(updateField({ field: 'phoneNumber', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.phoneNumber}</ValidationError>
        </div>

        <div>
          <TextInput
            label="E-postadress"
            value={email}
            onChange={(event) => dispatch(updateField({ field: 'email', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.email}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Upprepa e-postadress"
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
            value={address}
            onChange={(event) => dispatch(updateField({ field: 'address', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.address}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Postnummer"
            type="number"
            min={1}
            max={99999}
            value={zipCode}
            onChange={(event) => dispatch(updateField({ field: 'zipCode', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.zipCode}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Postort"
            disabled
            value={city}
            onChange={(event) => dispatch(updateField({ field: 'city', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.city}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Kommun"
            disabled
            tooltip="Om systemet får fler träffar för kommun vid hämtning av uppgiften ska du ange vilken kommun som är rätt."
            value={municipality}
            onChange={(event) => dispatch(updateField({ field: 'municipality', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.municipality}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Län"
            disabled
            value={county}
            onChange={(event) => dispatch(updateField({ field: 'county', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.county}</ValidationError>
        </div>
      </PPForm>
    </PPLayout>
  )
}
