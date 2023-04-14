import { IDSAlert, IDSCard } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { TotalSickLeavesGraph } from './TotalSickLeavesGraph'
import { GenderDivisionGraph } from './GenderDivisionGraph'
import { StatisticsInformationCard } from './StatisticsInformationCard'
import { useGetSickLeavesSummaryQuery, useGetUserQuery } from '../../../store/api'

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
      <IDSAlert>Du har inga pågående sjukfall på {unitId}</IDSAlert>
    ) : (
      <IDSAlert>Det finns inga pågående sjukfall på {unitId}</IDSAlert>
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
    </div>
  )
}
