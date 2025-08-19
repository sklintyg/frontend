import { IDSIconArrow, IDSIconExternal, IDSLink } from '@inera/ids-react'
import { Heading } from '../../../../components/Heading/Heading'
import { useGetLinksQuery } from '../../../../store/api'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <Heading level={3} size="s">
        Använd Intygsstatistik för att se mer statistik
      </Heading>
      <div>
        <p>När du klickar på länken nedan öppnas Intygsstatistik i en ny flik.</p>
        <div className="flex pt-5">
          {links && links.statistiktjanstenTooltip && (
            <IDSLink>
              <a target="_blank" href={links.statistiktjanstenTooltip.url} rel="noreferrer">
                <IDSIconArrow height="0.625rem" width="0.625rem" />
                {links.statistiktjanstenTooltip.text}
                <IDSIconExternal size="xs" className="my-auto" />
              </a>
            </IDSLink>
          )}
        </div>
      </div>
    </>
  )
}
