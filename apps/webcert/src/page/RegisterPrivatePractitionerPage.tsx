import { CustomButton } from '../components/Inputs/CustomButton'
import styled from 'styled-components'
import list from '../images/list.svg'
import id_card from '../images/id_card.svg'
import check from '../images/check.svg'
import Logout from '../utils/Logout'
import { ResourceLinkType } from '../types'
import { WithResourceLink } from '../components/utils/WithResourceLink'
import { useAppSelector } from '../store/store'
import { getUser, getUserResourceLinks } from '../store/user/userSelectors'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'

const Logo = styled.img`
  height: 48px;
  width: 48px;
  display: inline;
`

export function RegisterPrivatePractitionerPage() {
  const userLinks = useAppSelector(getUserResourceLinks)
  const user = useAppSelector(getUser)

  return (
    <CommonLayout header={<WebcertHeader />}>
      <div className="ic-container">
        <div className="iu-grid-rows iu-mt-500">
          <div className="iu-grid-cols iu-grid-cols-12">
            <div className="iu-grid-span-7">
              <h1 className="iu-mb-200">Skapa konto i Webcert</h1>
              <p className="iu-mb-600">
                Du har genomfört en beställning av abonnemang för Webcert i Ineras kundportal. Du som har eller är på väg att få en
                läkarlegitimation kan nu skapa ett konto i Webcert.
                <br /> <br /> Intyg som utfärdas med BankID är enbart den enskilde läkarens intyg och kan inte kopplas samman, överlåtas
                eller delas med någon organisation.
              </p>
            </div>
            <div className="iu-grid-span-7">
              <h2 className="iu-mb-400">Så fungerar det</h2>
              <div className="iu-grid-span-5 iu-flex">
                <div className="iu-mb-100">
                  <h3 className="iu-mb-400">Steg 1 - lämna uppgifter</h3>
                  <p className="iu-mb-600">
                    Du lämnar uppgifter om dig själv och din verksamhet. Uppgifterna behövs för att du ska kunna använda alla funktioner i
                    Webcert.
                  </p>
                </div>
                <div className="iu-ml-300 iu-mt-100">
                  <Logo className="iu-mt-400" src={list} tabIndex={0} alt="List" />
                </div>
              </div>
              <div className="iu-grid-span-5 iu-flex">
                <div className="iu-mb-100">
                  <h3 className="iu-mb-400">Steg 2 - uppgifter verifieras</h3>
                  <p className="iu-mb-600">
                    Din yrkeslegitimation verifieras automatiskt mot Socialstyrelsens register över legitimerad hälso- och sjukvårdspersonal
                    (HOSP).
                  </p>
                </div>
                <div className="iu-ml-300 iu-mt-100">
                  <Logo className="iu-mt-400" src={id_card} tabIndex={0} alt="Id Card" />
                </div>
              </div>
              <div className="iu-grid-span-5 iu-flex">
                <div className="iu-mb-100">
                  <h3 className="iu-mb-400">Steg 3 - börja använda Webcert</h3>
                  <p className="iu-mb-600">
                    Efter godkänd verifiering mot Socialstyrelsens register över legitimerad hälso- och sjukvårdspersonal (HOSP) kan du
                    börja använda Webcert.
                  </p>
                </div>
                <div className="iu-ml-300 iu-mt-100">
                  <Logo className="iu-mt-400" src={check} tabIndex={0} alt="Check" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="iu-flex">
          <WithResourceLink type={ResourceLinkType.LOG_OUT} links={userLinks}>
            {(link) => (
              <CustomButton>
                <Logout user={user} link={{ ...link, name: `Avbryt och ${link.name.toLowerCase()}` }} />
              </CustomButton>
            )}
          </WithResourceLink>
          <CustomButton className="iu-ml-600" buttonStyle="primary" type="submit">
            Skapa konto
          </CustomButton>
        </div>
      </div>
    </CommonLayout>
  )
}
