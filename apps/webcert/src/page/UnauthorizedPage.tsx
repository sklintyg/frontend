import WebcertHeader from '../components/header/WebcertHeader'
import CommonLayout from '../components/commonLayout/CommonLayout'
import InfoBox from '../components/utils/InfoBox'
import { LinkButton } from '../styles'

export function UnauthorizedPage() {
  return (
    <CommonLayout header={<WebcertHeader />}>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Du är inte behörig att använda Webcert</h1>
        <div className="mt-6 max-w-2xl">
          <InfoBox type="info">
            <div>Du är inte behörig att använda Webcert. Det kan bero på att:</div>
            <div className="mt-2">
              <ul className="list-disc ml-6">
                <li className="mt-2">Ditt konto är skapat och vi bearbetar din registrering.</li>
                <li className="mt-2">
                  Du enligt Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP) inte är legitimerad läkare.
                </li>
                <li className="mt-2">
                  Inera AB av någon anledning har beslutat att stänga av dig från tjänsten. För mer information kontakta{' '}
                  <LinkButton>Inera Support</LinkButton>
                </li>
              </ul>
            </div>
          </InfoBox>
        </div>
      </div>
    </CommonLayout>
  )
}
