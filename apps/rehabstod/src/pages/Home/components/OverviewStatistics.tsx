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

  if (!isLoading && (!user || !user.valdVardenhet)) {
    navigate('/')
  }

  if (summary && summary.total === 0) {
    return user.roles.LAKARE ? (
      <IDSAlert>Du har inga pågående sjukfall på {user.valdVardenhet.id}</IDSAlert>
    ) : (
      <IDSAlert>Det finns inga pågående sjukfall på {user.valdVardenhet.id}</IDSAlert>
    )
  }

  return (
    <div className="ids-content grid auto-rows-fr grid-cols-3 gap-4 py-10">
      <IDSCard fill>
        <TotalSickLeavesGraph />
      </IDSCard>
      <IDSCard fill>
        <GenderDivisionGraph />
      </IDSCard>
      <IDSCard>
        <StatisticsInformationCard />
      </IDSCard>
    </div>
  )
}
