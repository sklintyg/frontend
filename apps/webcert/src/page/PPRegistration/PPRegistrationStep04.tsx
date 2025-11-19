import { isEqual } from 'lodash-es'
import { Link } from 'react-router-dom'
import { useGetHOSPInformationQuery } from '../../store/pp/ppApi'
import { useAppSelector } from '../../store/store'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPResultPart } from './components/PPResultPart'
import { StatusBox } from './components/StatusBox'

export function PPRegistrationStep04() {
  const { data: HOSPInfo } = useGetHOSPInformationQuery()

  const { personId, name, occupation, position, businessName, careForm, businessType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )
  const { phoneNumber, email, address, zipCode, city, county, municipality } = useAppSelector((state) => state.ui.pp.step02.data, isEqual)
  return (
    <PPLayout subHeader="Skapa konto: Steg 4 av 4">
      <h3 className="mb-5">Granska uppgifter</h3>
      <StatusBox type="INFO">
        Kontrollera att sammanfattningen av din information stämmer innan du går vidare. Du kan justera de uppgifter som du själv har
        angett. Information hämtad från folkbokföringen och från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP) går inte
        att redigera.
      </StatusBox>
      <PPForm
        actions={<PPRegistrationAction prevStep={3} continueText="Skapa konto" />}
        onSubmit={() => {
          console.log('do it!!')
        }}
      >
        <div>
          <h4>Dina och verksamhetens uppgifter</h4>
          <Link to="/register/step-1" className="mb-5 text-sm">
            Ändra
          </Link>
          <PPResultPart title="Personnummer" value={personId} />
          <PPResultPart title="Namn" value={name} />
          <PPResultPart title="Befattning" value={occupation} />
          <PPResultPart title="Verksamhetens namn" value={businessName} />
          <PPResultPart title="Ägarform" value={position} />
          <PPResultPart title="Vårdform" value={careForm} />
          <PPResultPart title="Verksamhetstyp" value={businessType} />
          <PPResultPart title="Arbetsplatskod" value={workplaceCode} />
        </div>
        <hr />

        <div>
          <h4>Kontaktuppgifter till verksamheten</h4>
          <Link to="/register/step-2" className="mb-5 text-sm">
            Ändra
          </Link>
          <PPResultPart title="Telefonnummer" value={phoneNumber} />
          <PPResultPart title="E-postadress" value={email} />
          <PPResultPart title="Postadress" value={address} />
          <PPResultPart title="Postnummer" value={zipCode} />
          <PPResultPart title="Postort" value={city} />
          <PPResultPart title="Kommun" value={municipality} />
          <PPResultPart title="Län" value={county} />
        </div>
        <hr />

        <div>
          <h4>Socialstyrelsens uppgifter</h4>
          <p className="mb-3">Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
          <HOSPStatusBox />
          <PPResultPart
            title="Legitimerad yrkesgrupp"
            value={HOSPInfo?.licensedHealthcareProfessions.map(({ description }) => description).join(', ')}
            fallback="Inga uppgifter hämtade"
          />
          <PPResultPart
            title="Specialitet"
            value={HOSPInfo?.specialities.map(({ description }) => description).join(', ')}
            fallback="Inga uppgifter hämtade"
          />
          <PPResultPart title="Förskrivarkod" value={HOSPInfo?.personalPrescriptionCode} fallback="Inga uppgifter hämtade" />
        </div>
      </PPForm>
    </PPLayout>
  )
}
