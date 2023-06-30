import { skipToken } from '@reduxjs/toolkit/query'
import { useLocation, useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { useGetPatientSickLeavesQuery } from '../../store/api'
import { OpenTabsDialog } from './components/OpenTabsDialog'
import { PatientErrorHeader } from './components/PatientErrorHeader'
import { PatientHeader } from './components/PatientHeader'
import { PatientTabs } from './components/PatientTabs'
import { PatientContext, usePatientState } from './hooks/usePatient'

export function Patient() {
  const patientState = usePatientState()
  const { encryptedPatientId } = useParams()
  const { state } = useLocation()

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
        <PatientTabs active={state ? state.activeTab : -1} />
      </PageContainer>
    </PatientContext.Provider>
  )
}
