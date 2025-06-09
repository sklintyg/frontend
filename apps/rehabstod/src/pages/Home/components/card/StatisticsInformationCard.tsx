import { IDSIconExternal, IDSLink } from '@inera/ids-react'
import { useGetLinksQuery } from '../../../../store/api'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <h3 className="ids-heading-4">Använd Intygsstatistik för att se mer statistik</h3>
      <div>
        <p>När du klickar på länken nedan öppnas Intygsstatistik i en ny flik.</p>
        <div className="flex pt-5">
          {links && links.statistiktjanstenTooltip && (
            <IDSLink>
              <a target="_blank" href={links.statistiktjanstenTooltip.url} rel="noreferrer">
                {links.statistiktjanstenTooltip.text}
              </a>
              <IDSIconExternal slot="append-icon" size="xs" className="my-auto" />
            </IDSLink>
          )}
        </div>
      </div>
    </>
  )
}
