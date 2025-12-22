import { isEqual } from 'lodash-es'
import TextInput from '../../../../components/Inputs/TextInput'
import { useGetPPConfigQuery } from '../../../../store/pp/ppApi'
import { updateField } from '../../../../store/pp/ppStep01ReducerSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { getUser } from '../../../../store/user/userSelectors'
import PPDropdown from '../PPDropdown'
import { ValidationError } from '../ValidationError'

export function PPStep01Fields() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(getUser)
  const { data: ppConfig } = useGetPPConfigQuery()
  const { position, careUnitName, typeOfCare, healthcareServiceType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )

  const errors = useAppSelector((state) => state.ui.pp.step01.errors)
  const showValidation = useAppSelector((state) => state.ui.pp.step01.showValidation)

  return (
    <>
      <div>
        <TextInput id="personId" label="Personnummer" value={user?.personId} disabled />
      </div>

      <div>
        <TextInput id="name" label="Namn" value={user?.name} disabled />
      </div>

      <div>
        <PPDropdown
          id="position"
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
          id="careUnitName"
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
          id="typeOfCare"
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
          id="healthcareServiceType"
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
                verksamhet. Välj 'medicinsk verksamhet' om den verksamhet du bedriver inte stämmer med några andra verksamhetstyper i denna
                lista
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
          id="workplaceCode"
          label="Arbetsplatskod"
          value={workplaceCode}
          onChange={(event) => dispatch(updateField({ field: 'workplaceCode', value: event.currentTarget.value }))}
          tooltip="Ange verksamhetens arbetsplatskod. Arbetsplatskod används för att identifiera vid vilken arbetsplats receptutfärdaren tjänstgör i samband med läkemedelsförskrivning."
        />
        {showValidation && <ValidationError>{errors?.workplaceCode}</ValidationError>}
      </div>
    </>
  )
}
