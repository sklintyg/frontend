import CommonLayout from '../../components/commonLayout/CommonLayout'
import WebcertHeader from '../../components/header/WebcertHeader'
import { CustomButton } from '../../components/Inputs/CustomButton'
import { useLogout } from '../../hooks/useLogout'
import { PPPage } from './components/PPPage'
import { PPSubHeader } from './components/PPSubHeader'
import { StatusBox } from './components/StatusBox'

export function PPRegistrationDone() {
  const { logout } = useLogout()

  return (
    <CommonLayout header={<WebcertHeader />} subHeader={<PPSubHeader>Skapa konto</PPSubHeader>}>
      <PPPage>
        <StatusBox type="INFO">
          <p>Om uppgifter avseende din läkarlegitimation har hämtats från Socialstyrelsen kan du logga in och börja använda Webcert.</p>
          <p>
            Om uppgifter avseende din läkarlegitimation behöver hämtas från Socialstyrelsen får du ett mejl till din registrerade mejladress
            när du kan börja använda Webcert.
          </p>
          <p>
            De uppgifter du har lämnat om dig själv och din verksamhet i Webcert är sparade. Du kan ändra dessa när du vill genom att klicka
            på “Ändra uppgifter” i menyn.
          </p>
        </StatusBox>
        <CustomButton buttonStyle="primary" onClick={() => logout()}>
          Till Webcert
        </CustomButton>
      </PPPage>
    </CommonLayout>
  )
}
