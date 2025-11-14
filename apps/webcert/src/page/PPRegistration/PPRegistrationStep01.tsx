import { isEqual } from 'lodash-es'
import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import { updateField, validateData } from '../../store/pp/ppStep01ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import PPDropdown from './components/PPDropdown'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { ValidationError } from './components/ValidationError'

export function PPRegistrationStep01() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { personId, name, occupation, position, businessName, careForm, businessType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )

  const errors = useAppSelector((state) => state.ui.pp.step01.errors)

  return (
    <PPLayout subHeader="Skapa konto: Steg 1 av 4">
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step01.errors) {
            navigate('/register/step-2')
          }
        }}
        actions={<PPRegistrationAction />}
      >
        <div>
          <TextInput
            label="Personnummer"
            value={personId}
            onChange={(event) => dispatch(updateField({ field: 'personId', value: event.currentTarget.value }))}
            required
            disabled
          />
          <ValidationError>{errors?.personId}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Namn"
            value={name}
            onChange={(event) => dispatch(updateField({ field: 'name', value: event.currentTarget.value }))}
            disabled
          />
          <ValidationError>{errors?.name}</ValidationError>
        </div>

        <div>
          <PPDropdown
            label="Befattning"
            required
            value={occupation}
            onChange={(event) => dispatch(updateField({ field: 'occupation', value: event.currentTarget.value }))}
            tooltip="Välj din huvudsakliga befattning enligt AID-etikett (Arbetsidentifikation kommuner och regioner)."
          >
            <option value="">Välj befattning</option>
            <option value="overlakare">Överläkare</option>
            <option value="distrikts_specialist_allmenmedicin">Distriktsläkare/Specialist allmänmedicin</option>
            <option value="skollakare">Skolläkare</option>
            <option value="foretagslakare">Företagsläkare</option>
            <option value="specialistlakare">Specialistläkare</option>
            <option value="lakare_legitimerad_specialiseringstjanstgoring">Läkare legitimerad, specialiseringstjänstgöring</option>
            <option value="lakare_legitimerad_bastjanstgoring">Läkare legitimerad, bastjänstgöring</option>
            <option value="lakare_legitimerad_annan">Läkare legitimerad, annan</option>
          </PPDropdown>
          <ValidationError>{errors?.occupation}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Namn på din verksamhet"
            required
            value={businessName}
            onChange={(event) => dispatch(updateField({ field: 'businessName', value: event.currentTarget.value }))}
            tooltip="Namnet på din verksamhet visas i Webcert och i signerade intyg."
          />
          <ValidationError>{errors?.businessName}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Ägarform"
            value={position}
            onChange={(event) => dispatch(updateField({ field: 'position', value: event.currentTarget.value }))}
          />
          <ValidationError>{errors?.position}</ValidationError>
        </div>

        <div>
          <PPDropdown
            label="Vårdform"
            required
            value={careForm}
            onChange={(event) => dispatch(updateField({ field: 'careForm', value: event.currentTarget.value }))}
            tooltip="Ange verksamhetens huvudsakliga vårdform enligt definition i Socialstyrelsens termbank."
          >
            <option value="">Välj vårdform</option>
            <option value="hemsjukvard">Hemsjukvård</option>
            <option value="oppenvard">Öppenvård</option>
            <option value="slutenvard">Slutenvård</option>
          </PPDropdown>
          <ValidationError>{errors?.careForm}</ValidationError>
        </div>

        <div>
          <PPDropdown
            label="Verksamhetstyp"
            required
            value={businessType}
            onChange={(event) => dispatch(updateField({ field: 'businessType', value: event.currentTarget.value }))}
            tooltip={
              <>
                <p>Välj den typ av verksamhet som huvudsakligen bedrivs. </p>
                <p>
                  'Övrig medicinsk verksamh et' avser paramedicinsk verksamhet som bedrivs av exempelvis sjukgymnaster, arbetsterapeuter,
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
            <option value="barn_ungdomsverksamhet">Barn- och ungdomsverksamhet</option>
            <option value="medicinsk_verksamhet">Medicinsk verksamhet</option>
            <option value="laboratorieverksamhet">Laboratorieverksamhet</option>
            <option value="kirurgisk_verksamhet">Kirurgisk verksamhet</option>
            <option value="ovrig_medicinsk_verksamhet">Övrig medicinsk verksamhet</option>
            <option value="primarvards_verksamhet">Primärvårdsverksamhet</option>
            <option value="psykiatrisk_verksamhet">Psykiatrisk verksamhet</option>
            <option value="radiologisk_verksamhet">Radiologisk verksamhet</option>
            <option value="tandvards_verksamhet">Tandvårdsverksamhet</option>
            <option value="ovrig_medicinsk_serviceverksamhet">Övrig medicinsk serviceverksamhet</option>
            <option value="vard_omsorg_omvardnads_verksamhet">Vård-, Omsorg- och Omvårdnadsverksamhet</option>
          </PPDropdown>
          <ValidationError>{errors?.businessType}</ValidationError>
        </div>

        <div>
          <TextInput
            label="Arbetsplatskod"
            value={workplaceCode}
            onChange={(event) => dispatch(updateField({ field: 'workplaceCode', value: event.currentTarget.value }))}
            tooltip="Ange verksamhetens arbetsplatskod. Arbetsplatskod används för att identifiera vid vilken arbetsplats receptutfärdaren tjänstgör i samband med läkemedelsförskrivning."
          />
          <ValidationError>{errors?.workplaceCode}</ValidationError>
        </div>
      </PPForm>
    </PPLayout>
  )
}
