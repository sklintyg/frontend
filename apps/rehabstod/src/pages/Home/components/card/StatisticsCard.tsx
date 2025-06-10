import { IDSCard } from '@inera/ids-react'
import { useState } from 'react'
import { Heading } from '../../../../components/Heading/Heading'
import type { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { classNames } from '../../../../utils/classNames'
import { PieChartGraph } from '../graph/PieChartGraph'
import { ExpandStatisticsButton } from './ExpandStatisticsButton'

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
  const [open, setOpen] = useState(false)

  return (
    <IDSCard fill={1}>
      <Heading level={3} size="xs">
        {title}
      </Heading>
      <p className="mb-4 max-w-xl">{subTitle}</p>
      <div className="flex flex-col gap-5 xl:flex-row">
        <PieChartGraph data={parentData} />
        <div className="flex w-full flex-col gap-5 ">
          <ExpandStatisticsButton open={open} onClick={() => setOpen(!open)} />
          <div className={classNames('flex-col gap-5 md:flex-row xl:flex', open ? 'flex' : 'hidden')}>
            <PieChartGraph title="Män" data={maleData} parentData={parentData} isSmall />
            <PieChartGraph title="Kvinnor" data={femaleData} parentData={parentData} isSmall />
          </div>
        </div>
      </div>
    </IDSCard>
  )
}
