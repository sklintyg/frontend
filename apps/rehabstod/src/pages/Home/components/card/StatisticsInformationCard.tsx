import { IDSIcon } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../../store/api'
import { DynamicLink } from '../../../../components/DynamicLink/DynamicLink'

export function StatisticsInformationCard() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <h2 className="ids-heading-4">Här kan du hitta mer statistik</h2>
      <div className="py-7">
        <p>
          Om du vill se mer statistik för din enhet eller på nationell nivå kan du använda Intygsstatistik. När du klickar på länken nedan
          öppnas Intygsstatistik i en ny flik, och du blir automatiskt inloggad om du har giltig behörighet till Intygsstatistik.
        </p>
        <div className="flex pt-5 pb-1">
          <IDSIcon name="arrow" size="xs" className="my-auto mr-2" />
          <DynamicLink link={links?.statistiktjanstenTooltip} />
        </div>
      </div>
    </>
  )
}
