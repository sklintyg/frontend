import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import { IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../../store/api'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <h3 className="ids-heading-4">Använd Intygsstatistik för att se mer statistik</h3>
      <div>
        <p>
          När du klickar på länken nedan öppnas Intygsstatistik i en ny flik. Om du har behörighet till Intygsstatistik blir du automatiskt
          inloggad på samma enhet.
        </p>
        <div className="flex pt-5">
          {links && links.statistiktjanstenTooltip && (
            <Tooltip>
              <TooltipTrigger>
                <IDSLink>
                  <a target="_blank" href={links.statistiktjanstenTooltip.url} rel="noreferrer">
                    {links.statistiktjanstenTooltip.text}
                  </a>
                  <IDSIconExternal slot="append-icon" size="xs" className="my-auto" />
                </IDSLink>
              </TooltipTrigger>
              {links.statistiktjanstenTooltip.tooltip && <TooltipContent>{links.statistiktjanstenTooltip.tooltip}</TooltipContent>}
            </Tooltip>
          )}
        </div>
      </div>
    </>
  )
}
