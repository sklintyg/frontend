import { useHOSP } from '../hooks/useHOSP'
import { StatusBox } from './StatusBox'

interface HOSPStatusBoxProps {
  variant?: boolean
}

export function HOSPStatusBox({ variant = false }: HOSPStatusBoxProps) {
  const { isMissing, isError } = useHOSP()
  const shouldShowStatus = isError || isMissing

  if (!shouldShowStatus) {
    return null
  }

  if (variant) {
    return (
      <StatusBox type="INFO">
        Inga uppgifter har hämtats från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP), men du kan fortsätta skapa ditt
        konto.
      </StatusBox>
    )
  }

  return (
    <StatusBox type="INFO">Inga uppgifter har hämtats från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP).</StatusBox>
  )
}
