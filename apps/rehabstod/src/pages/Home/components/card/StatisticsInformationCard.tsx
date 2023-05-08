import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../../store/api'
import { TooltipTrigger } from '../../../../components/Tooltip/TooltipTrigger'
import { TooltipContent } from '../../../../components/Tooltip/TooltipContent'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <h3 className="ids-heading-4">Använd Intygsstatistik för att se mer statistik</h3>
      <div>
        <p>
          När du klickar på länken nedan öppnas Intygsstatistik i en ny flik. Om du har behörighet till Intygsstatistik blir du blir
          automatiskt inloggad på samma enhet.
        </p>
        <div className="flex pb-20 pt-5">
          {links && links.statistiktjanstenTooltip && (
            <Tooltip>
              <TooltipTrigger>
                <IDSLink>
                  <IDSIcon name="arrow" />
                  <a target="_blank" href={links.statistiktjanstenTooltip.url} rel="noreferrer">
                    {links.statistiktjanstenTooltip.text}
                  </a>
                  <IDSIcon slot="append-icon" name="external" size="xs" className="my-auto" />
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
