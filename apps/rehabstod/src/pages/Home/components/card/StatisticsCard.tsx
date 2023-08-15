import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from '../graph/PieChartGraph'

export function StatisticsCard({
  parentData,
  maleData,
  femaleData,
  title,
  subTitle,
}: {
  parentData: SummaryDataPoint[]
  maleData: SummaryDataPoint[]
  femaleData: SummaryDataPoint[]
  title: string
  subTitle?: string
}) {
  return (
    <>
      <h3 className="ids-heading-4">{title}</h3>
      <p className="mb-4 max-w-xl">{subTitle}</p>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-2">
          <PieChartGraph data={parentData} height={parentData.length * 50 + 100} />
        </div>
        <div className="pb-10">
          <h4 className="ml-9 font-bold">Män</h4>
          <PieChartGraph data={maleData} parentData={parentData} isSmall />
        </div>
        <div className="pb-10">
          <h4 className="ml-6 font-bold">Kvinnor</h4>
          <PieChartGraph data={femaleData} parentData={parentData} isSmall />
        </div>
      </div>
    </>
  )
}
