import { useLocation, useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { PatientTabs } from './components/PatientTabs'
import { PatientHeader } from './components/PatientHeader'
import { PatientErrorHeader } from './components/PatientErrorHeader'
import { OpenTabsDialog } from './components/OpenTabsDialog'
import { PatientContext, usePatientState } from './hooks/usePatient'
import { useGetSickLeavePatientQuery } from '../../store/api'
import { PageContainer } from '../../components/PageContainer/PageContainer'

export function Patient() {
  const patientState = usePatientState()
  const { encryptedPatientId } = useParams()
  const { state } = useLocation()

  const { data: patient } = useGetSickLeavePatientQuery(
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
        <PatientTabs active={state.activeTab} />
      </PageContainer>
    </PatientContext.Provider>
  )
}
