import { isEqual } from 'lodash-es'
import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import Spinner from '../../components/utils/Spinner'
import { useGetPPConfigQuery } from '../../store/pp/ppApi'
import { updateField, validateData } from '../../store/pp/ppStep01ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import { getUser } from '../../store/user/userSelectors'
import PPDropdown from './components/PPDropdown'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { ValidationError } from './components/ValidationError'

export function PPRegistrationStep01() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(getUser)
  const { data: ppConfig, isLoading } = useGetPPConfigQuery()
  const { position, careUnitName, typeOfCare, healthcareServiceType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )

  const errors = useAppSelector((state) => state.ui.pp.step01.errors)
  const showValidation = useAppSelector((state) => state.ui.pp.step02.showValidation)

  if (isLoading) {
    return <Spinner />
  }

  return (
    <PPPage>
      <div className="flex flex-col">
        <h2 className="mb-5 text-[#5f5f5f] text-[22px]">Dina och verksamhetens uppgifter</h2>
        <p className="max-w-xl mb-4">Vissa uppgifter kan inte ändras eftersom de hämtas från folkbokföringsregistret eller är förvalda.</p>
        <p className="max-w-xl mb-4">Fält markerade med asterisk (*) är obligatoriska.</p>
      </div>
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step01.errors) {
            navigate('/register/steg-2')
          }
        }}
        actions={<PPRegistrationAction />}
      >
        <div>
          <TextInput label="Personnummer" value={user?.personId} disabled />
        </div>

        <div>
          <TextInput label="Namn" value={user?.name} disabled />
        </div>

        <div>
          <PPDropdown
            label="Befattning"
            required
            value={position}
            hasValidationError={showValidation && Boolean(errors?.position)}
            onChange={(event) => dispatch(updateField({ field: 'position', value: event.currentTarget.value }))}
            tooltip="Välj din huvudsakliga befattning enligt AID-etikett (Arbetsidentifikation kommuner och regioner)."
          >
            <option value="">Välj befattning</option>
            {ppConfig?.positions.map(({ code, description }) => (
              <option key={code} value={code}>
                {description}
              </option>
            ))}
          </PPDropdown>
          {showValidation && <ValidationError>{errors?.position}</ValidationError>}
        </div>

        <div>
          <TextInput
            label="Namn på din verksamhet"
            required
            showAsterix
            value={careUnitName}
            hasValidationError={showValidation && Boolean(errors?.careUnitName)}
            onChange={(event) => dispatch(updateField({ field: 'careUnitName', value: event.currentTarget.value }))}
            tooltip="Namnet på din verksamhet visas i Webcert och i signerade intyg."
          />
          {showValidation && <ValidationError>{errors?.careUnitName}</ValidationError>}
        </div>

        <div>
          <PPDropdown
            label="Vårdform"
            required
            value={typeOfCare}
            hasValidationError={showValidation && Boolean(errors?.typeOfCare)}
            onChange={(event) => dispatch(updateField({ field: 'typeOfCare', value: event.currentTarget.value }))}
            tooltip="Ange verksamhetens huvudsakliga vårdform enligt definition i Socialstyrelsens termbank."
          >
            <option value="">Välj vårdform</option>
            {ppConfig?.typeOfCare.map(({ code, description }) => (
              <option key={code} value={code}>
                {description}
              </option>
            ))}
          </PPDropdown>
          {showValidation && <ValidationError>{errors?.typeOfCare}</ValidationError>}
        </div>

        <div>
          <PPDropdown
            label="Verksamhetstyp"
            required
            value={healthcareServiceType}
            hasValidationError={showValidation && Boolean(errors?.healthcareServiceType)}
            onChange={(event) => dispatch(updateField({ field: 'healthcareServiceType', value: event.currentTarget.value }))}
            tooltip={
              <>
                <p>Välj den typ av verksamhet som huvudsakligen bedrivs. </p>
                <p>
                  ’Övrig medicinsk verksamhet’ avser paramedicinsk verksamhet som bedrivs av exempelvis sjukgymnaster, arbetsterapeuter,
                  kiropraktorer och logopeder.
                </p>
                <p>
                  'Övrig medicinsk serviceverksamhet' avser all medicinsk serviceverksamhet undantaget laboratorieverksamhet och radiologisk
                  verksamhet. Välj 'medicinsk verksamhet' om den verksamhet du bedriver inte stämmer med några andra verksamhetstyper i
                  denna lista
                </p>
              </>
            }
          >
            <option value="">Välj verksamhetstyp</option>
            {ppConfig?.healthcareServiceTypes.map(({ code, description }) => (
              <option key={code} value={code}>
                {description}
              </option>
            ))}
          </PPDropdown>
          {showValidation && <ValidationError>{errors?.healthcareServiceType}</ValidationError>}
        </div>

        <div>
          <TextInput
            label="Arbetsplatskod"
            value={workplaceCode}
            onChange={(event) => dispatch(updateField({ field: 'workplaceCode', value: event.currentTarget.value }))}
            tooltip="Ange verksamhetens arbetsplatskod. Arbetsplatskod används för att identifiera vid vilken arbetsplats receptutfärdaren tjänstgör i samband med läkemedelsförskrivning."
          />
          {showValidation && <ValidationError>{errors?.workplaceCode}</ValidationError>}
        </div>
      </PPForm>
    </PPPage>
  )
}
