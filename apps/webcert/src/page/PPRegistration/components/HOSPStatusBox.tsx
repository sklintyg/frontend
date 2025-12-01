import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'
import { StatusBox } from './StatusBox'

export function HOSPStatusBox() {
  const { isError } = useGetHOSPInformationQuery()

  if (!isError) {
    return null
  }

  return (
    <StatusBox type="INFO">
      Inga uppgifter har hämtats från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP), men du kan fortsätta skapa ditt
      konto.
    </StatusBox>
  )
}
