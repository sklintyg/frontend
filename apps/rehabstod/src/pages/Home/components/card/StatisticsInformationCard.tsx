import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../../store/api'
import { TooltipTrigger } from '../../../../components/Tooltip/TooltipTrigger'
import { TooltipContent } from '../../../../components/Tooltip/TooltipContent'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  if (!links || !links.statistiktjanstenTooltip) {
    return null
  }

  return (
    <>
      <h3 className="ids-heading-4">Här kan du hitta mer statistik</h3>
      <div>
        <p>
          Om du vill se mer statistik för din enhet eller på nationell nivå kan du använda Intygsstatistik. När du klickar på länken nedan
          öppnas Intygsstatistik i en ny flik, och du blir automatiskt inloggad om du har giltig behörighet till Intygsstatistik.
        </p>
        <div className="flex pt-5 pb-14">
          <Tooltip>
            <TooltipTrigger>
              <IDSLink>
                <IDSIcon name="arrow" />
                <a href={links.statistiktjanstenTooltip.url}>{links.statistiktjanstenTooltip.text}</a>
                <IDSIcon slot="append-icon" name="external" size="xs" className="my-auto" />
              </IDSLink>
            </TooltipTrigger>
            <TooltipContent>{links.statistiktjanstenTooltip.tooltip}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
