import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from '../graph/PieChartGraph'
import { getGraphHeight } from '../../statisticsUtils'

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
      <p className="mb-4">{subTitle}</p>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-2">
          <PieChartGraph data={parentData} height={parentData.length * 50 + 100} />
        </div>
        <div className="pb-10">
          <h4 className="font-bold">Män</h4>
          <PieChartGraph
            data={maleData}
            parentData={parentData}
            height={getGraphHeight(maleData.length > femaleData.length ? maleData : femaleData)}
            isSmall
          />
        </div>
        <div className="pb-10">
          <h4 className="font-bold">Kvinnor</h4>
          <PieChartGraph
            data={femaleData}
            parentData={parentData}
            height={getGraphHeight(maleData.length > femaleData.length ? maleData : femaleData)}
            isSmall
          />
        </div>
      </div>
    </>
  )
}
