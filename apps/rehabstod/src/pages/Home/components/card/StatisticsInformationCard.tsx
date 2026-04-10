import { Heading } from '@frontend/components-ids9'
import { DynamicLink } from '../../../../components/DynamicLink/DynamicLink'
import { useGetLinksQuery } from '../../../../store/api'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <Heading level={3} size="s">
        Använd Intygsstatistik för att se mer statistik
      </Heading>
      <div>
        <p className="mb-5 text-on-background">När du klickar på länken nedan öppnas Intygsstatistik i en ny flik.</p>
        <DynamicLink link={links?.statistiktjanstenTooltip} arrow />
      </div>
    </>
  )
}
