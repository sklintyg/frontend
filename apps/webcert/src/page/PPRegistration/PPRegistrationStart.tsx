import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CustomButton } from '../../components/Inputs/CustomButton'
import { useLogout } from '../../hooks/useLogout'
import check from '../../images/check.svg'
import id_card from '../../images/id_card.svg'
import list from '../../images/list.svg'

const Logo = styled.img`
  height: 48px;
  width: 48px;
  display: inline;
`

export function PPRegistrationStart() {
  const navigate = useNavigate()
  const { logout, link } = useLogout()

  if (!link) {
    return null
  }

  return (
    <div className="flex flex-col">
      <div className="">
        <h1 className="mb-5">Skapa konto i Webcert</h1>
        <p className="max-w-xl mb-10">
          Du har genomfört en beställning av abonnemang för Webcert i Ineras kundportal. Du som har eller är på väg att få en
          läkarlegitimation kan nu skapa ett konto i Webcert.
          <br /> <br /> Intyg som utfärdas med BankID är enbart den enskilde läkarens intyg och kan inte kopplas samman, överlåtas eller
          delas med någon organisation.
        </p>
      </div>
      <div className="flex flex-col">
        <h2 className="mb-5">Så fungerar det</h2>
        <div className="flex flex-row gap-x-6">
          <div className="flex flex-col">
            <h3 className="mb-3">Steg 1 - lämna uppgifter</h3>
            <p className="max-w-lg mb-8">
              Du lämnar uppgifter om dig själv och din verksamhet. Uppgifterna behövs för att du ska kunna använda alla funktioner i
              Webcert.
            </p>
          </div>
          <Logo src={list} alt="List" />
        </div>
        <div className="flex flex-row gap-x-6">
          <div className="flex flex-col">
            <h3 className="mb-3">Steg 2 - uppgifter verifieras</h3>
            <p className="max-w-lg mb-8">
              Din yrkeslegitimation verifieras automatiskt mot Socialstyrelsens register över legitimerad hälso- och sjukvårdspersonal
              (HOSP).
            </p>
          </div>
          <Logo src={id_card} alt="Id Card" />
        </div>
        <div className="flex flex-row gap-x-6">
          <div className="flex flex-col">
            <h3 className="mb-3">Steg 3 - börja använda Webcert</h3>
            <p className="max-w-lg mb-10">
              Efter godkänd verifiering mot Socialstyrelsens register över legitimerad hälso- och sjukvårdspersonal (HOSP) kan du börja
              använda Webcert.
            </p>
          </div>
          <Logo src={check} alt="Check" />
        </div>
      </div>
      <div className="flex flex-row gap-x-5">
        <CustomButton type="submit" onClick={logout}>
          Avbryt och logga ut
        </CustomButton>
        <CustomButton className="" buttonStyle="primary" onClick={() => navigate('/register/steg-1')}>
          Skapa konto
        </CustomButton>
      </div>
    </div>
  )
}
