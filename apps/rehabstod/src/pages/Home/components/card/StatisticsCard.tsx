import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from '../graph/PieChartGraph'
import { TextList } from '../TextList'

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
      <h2 className="ids-heading-4">{title}</h2>
      <p className="mb-4">{subTitle}</p>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-2">
          <PieChartGraph data={parentData} />
        </div>
        <div className="pb-10">
          <p className="ids-heading-4">Män</p>
          <TextList parentData={parentData} data={maleData} />
        </div>
        <div className="pb-10">
          <p className="ids-heading-4">Kvinnor</p>
          <TextList parentData={parentData} data={femaleData} />
        </div>
      </div>
    </>
  )
}
