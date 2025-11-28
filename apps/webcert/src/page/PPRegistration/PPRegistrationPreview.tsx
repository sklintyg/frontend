import { isEqual } from 'lodash-es'
import { Link, useNavigate } from 'react-router-dom'
import { useGetHOSPInformationQuery, useRegisterPrivatePractitionerMutation } from '../../store/pp/ppApi'
import { useAppSelector } from '../../store/store'
import { getUser } from '../../store/user/userSelectors'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPResultPart } from './components/PPResultPart'
import { StatusBox } from './components/StatusBox'

export function PPRegistrationPreview() {
  const [trigger, { isLoading: isLoadingRegistration, isError: isRegistrationError }] = useRegisterPrivatePractitionerMutation()
  const { data: HOSPInfo } = useGetHOSPInformationQuery()
  const navigate = useNavigate()

  const user = useAppSelector(getUser)
  const { position, careUnitName, typeOfCare, healthcareServiceType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )
  const { phoneNumber, email, address, zipCode, city, county, municipality } = useAppSelector((state) => state.ui.pp.step02.data, isEqual)

  return (
    <PPPage>
      <h3 className="mb-5">Granska uppgifter</h3>
      <StatusBox type="INFO">
        Kontrollera att sammanfattningen av din information stämmer innan du går vidare. Du kan justera de uppgifter som du själv har
        angett. Information hämtad från folkbokföringen och från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP) går inte
        att redigera.
      </StatusBox>
      <PPForm
        actions={
          <>
            {isRegistrationError && (
              <StatusBox type="ERROR">
                Ett tekniskt fel har uppstått. Kontot kan inte skapas. Försök igen senare. Om problemet kvarstår, kontakta{' '}
                <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
              </StatusBox>
            )}
            <PPRegistrationAction prevStep={3} continueText="Skapa konto" />
          </>
        }
        onSubmit={(event) => {
          event.preventDefault()
          if (isLoadingRegistration) {
            return null
          }
          trigger({
            address,
            careUnitName,
            city,
            county,
            email,
            healthcareServiceType,
            municipality,
            phoneNumber,
            position,
            typeOfCare,
            workplaceCode,
            zipCode,
          })
            .unwrap()
            .then(() => navigate('/register/done'))
            .catch(() => {
              // Error is handled by isRegistrationError state
            })
        }}
      >
        <div>
          <h4>Dina och verksamhetens uppgifter</h4>
          <div className="mb-3 text-sm">
            <Link to="/register/steg-1">Ändra</Link>
          </div>
          <PPResultPart title="Personnummer" value={user?.personId} />
          <PPResultPart title="Namn" value={user?.name} />
          <PPResultPart title="Befattning" value={position} />
          <PPResultPart title="Verksamhetens namn" value={careUnitName} />
          <PPResultPart title="Vårdform" value={typeOfCare} />
          <PPResultPart title="Verksamhetstyp" value={healthcareServiceType} />
          <PPResultPart title="Arbetsplatskod" value={workplaceCode} />
        </div>
        <hr />

        <div>
          <h4>Kontaktuppgifter till verksamheten</h4>
          <div className="mb-3 text-sm">
            <Link to="/register/steg-2">Ändra</Link>
          </div>
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
    </PPPage>
  )
}
