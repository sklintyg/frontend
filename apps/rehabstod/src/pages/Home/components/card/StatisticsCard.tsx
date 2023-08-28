import { classNames } from '@frontend/components'
import { IDSCard, IDSIconMinus, IDSIconPlus } from '@frontend/ids-react-ts'
import { MouseEventHandler, useState } from 'react'
import { SummaryDataPoint } from '../../../../schemas/sickLeaveSchema'
import { PieChartGraph } from '../graph/PieChartGraph'

function ExpandStatisticsButton({ onClick, open }: { onClick: MouseEventHandler; open: boolean }) {
  return (
    <button type="button" className="xl:hidden" onClick={onClick}>
      <div className="flex items-center gap-2 leading-6 text-accent-40 underline">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-40 text-white">
          {!open && <IDSIconPlus width="10" height="10" color="#FFF" color2="#FFF" />}
          {open && <IDSIconMinus width="10" height="10" color="#FFF" color2="#FFF" />}
        </div>
        Visa statistik per kön
      </div>
    </button>
  )
}

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
    <IDSCard fill>
      <h3 className="ids-heading-4">{title}</h3>
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
