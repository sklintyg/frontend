import { IDSAlert, IDSCard } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { TotalSickLeavesGraph } from './graph/TotalSickLeavesGraph'
import { GenderDivisionGraph } from './graph/GenderDivisionGraph'
import { StatisticsInformationCard } from './card/StatisticsInformationCard'
import { useGetSickLeavesSummaryQuery, useGetUserQuery } from '../../../store/api'
import { SickLeaveDegreesCard } from './card/SickLeaveDegreesCard'
import { CountSickLeaveDegreesCard } from './card/CountSickLeaveDegreesCard'
import { SickLeaveLengthsCard } from './card/SickLeaveLengthsCard'

export function OverviewStatistics() {
  const { isLoading, data: user } = useGetUserQuery()
  const { data: summary } = useGetSickLeavesSummaryQuery()
  const navigate = useNavigate()
  const unitId = user && user.valdVardenhet ? user.valdVardenhet.id : ''
  const isDoctor = user && user.roles.LAKARE

  if (!isLoading && (!user || !user.valdVardenhet)) {
    navigate('/')
  }

  if (summary && summary.total === 0) {
    return isDoctor ? (
      <IDSAlert className="py-10">Du har inga pågående sjukfall på {unitId}.</IDSAlert>
    ) : (
      <IDSAlert className="py-10">Det finns inga pågående sjukfall på {unitId}.</IDSAlert>
    )
  }

  return (
    <div className="ids-content grid auto-rows-fr grid-cols-3 gap-4 py-10">
      <IDSCard fill>
        <TotalSickLeavesGraph total={summary ? summary.total : 0} />
      </IDSCard>
      <IDSCard fill>
        <GenderDivisionGraph genders={summary ? summary.genders : []} />
      </IDSCard>
      <IDSCard>
        <StatisticsInformationCard />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <SickLeaveDegreesCard summary={summary} />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <CountSickLeaveDegreesCard summary={summary} />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <SickLeaveLengthsCard summary={summary} />
      </IDSCard>
    </div>
  )
}
