import { isEqual } from 'lodash-es'
import { Link, useNavigate } from 'react-router-dom'
import { useGetHOSPInformationQuery, useGetPPConfigQuery, useRegisterPrivatePractitionerMutation } from '../../store/pp/ppApi'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getUser as getUserAction } from '../../store/user/userActions'
import { getUser } from '../../store/user/userSelectors'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPResultPart } from './components/PPResultPart'
import { StatusBox } from './components/StatusBox'

export function PPRegistrationPreview() {
  const dispatch = useAppDispatch()
  const [trigger, { isLoading: isLoadingRegistration, isError: isRegistrationError }] = useRegisterPrivatePractitionerMutation()
  const { data: HOSPInfo } = useGetHOSPInformationQuery()
  const { data: ppConfig } = useGetPPConfigQuery()
  const navigate = useNavigate()

  const user = useAppSelector(getUser)
  const { position, careUnitName, typeOfCare, healthcareServiceType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )
  const { phoneNumber, email, address, zipCode, city, county, municipality } = useAppSelector((state) => state.ui.pp.step02.data, isEqual)

  const positionDescription = ppConfig?.positions.find((p) => p.code === position)?.description || position
  const typeOfCareDescription = ppConfig?.typeOfCare.find((t) => t.code === typeOfCare)?.description || typeOfCare
  const healthcareServiceTypeDescription =
    ppConfig?.healthcareServiceTypes.find((h) => h.code === healthcareServiceType)?.description || healthcareServiceType

  return (
    <PPPage>
      <h2 className="mb-5 text-[#5f5f5f] text-[22px]">Granska uppgifter</h2>
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
            .then(() => {
              dispatch(getUserAction())
              return navigate('/register/done')
            })
            .catch(() => {
              // Error is handled by isRegistrationError state
            })
        }}
      >
        <div>
          <h3>Dina och verksamhetens uppgifter</h3>
          <div className="mb-3 mt-3 text-sm">
            <Link to="/register/step-1">Ändra</Link>
          </div>
          <PPResultPart title="Personnummer" value={user?.personId} />
          <PPResultPart title="Namn" value={user?.name} />
          <PPResultPart title="Befattning" value={positionDescription} />
          <PPResultPart title="Verksamhetens namn" value={careUnitName} />
          <PPResultPart title="Vårdform" value={typeOfCareDescription} />
          <PPResultPart title="Verksamhetstyp" value={healthcareServiceTypeDescription} />
          <PPResultPart title="Arbetsplatskod" value={workplaceCode} />
        </div>
        <hr />

        <div>
          <h3>Kontaktuppgifter till verksamheten</h3>
          <div className="mb-3 mt-3 text-sm">
            <Link to="/register/step-2">Ändra</Link>
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
          <h3>Socialstyrelsens uppgifter</h3>
          <p className="mb-3">Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
          <HOSPStatusBox variant />
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
