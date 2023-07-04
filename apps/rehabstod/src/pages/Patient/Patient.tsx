import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { useGetPatientSickLeavesQuery } from '../../store/api'
import { OpenTabsDialog } from './components/OpenTabsDialog'
import { PatientErrorHeader } from './components/PatientErrorHeader'
import { PatientHeader } from './components/PatientHeader'
import { PatientTabs } from './components/PatientTabs'
import { PatientContext, usePatientState } from './hooks/usePatient'

export function Patient({ activeTab }: { activeTab: string }) {
  const patientState = usePatientState()
  const { encryptedPatientId } = useParams()

  const { data: patient } = useGetPatientSickLeavesQuery(
    encryptedPatientId
      ? {
          encryptedPatientId,
        }
      : skipToken
  )

  return (
    <PatientContext.Provider value={patientState}>
      {patient ? <PatientHeader patient={patient} /> : <PatientErrorHeader />}
      <OpenTabsDialog />
      <PageContainer>
        <PatientTabs active={activeTab} />
      </PageContainer>
    </PatientContext.Provider>
  )
}
