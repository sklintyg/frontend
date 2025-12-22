import { useHOSP } from '../hooks/useHOSP'
import { StatusBox } from './StatusBox'

export function HOSPStatusBox() {
  const { isMissing, isError } = useHOSP()

  if (isError || isMissing) {
    return (
      <StatusBox type="INFO">
        Inga uppgifter har hämtats från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP), men du kan fortsätta skapa ditt
        konto.
      </StatusBox>
    )
  }

  return null
}
