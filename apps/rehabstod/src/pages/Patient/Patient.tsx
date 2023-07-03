import { IDSTab, IDSTabPanel, IDSTabs } from '@frontend/ids-react-ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { useGetPatientSickLeavesQuery } from '../../store/api'
import { PatientLUCertificatesTable } from './PatientLUCertificatesTable/PatientLUCertificatesTable'
import { PatientSickLeaves } from './PatientSickLeaves/PatientSickLeaves'
import { OpenTabsDialog } from './components/OpenTabsDialog'
import { PatientHeader } from './components/PatientHeader'
import { PatientContext, usePatientState } from './hooks/usePatient'

export function Patient({ activeTab: active }: { activeTab: string }) {
  const patientState = usePatientState()
  const { encryptedPatientId } = useParams()
  const [activeTab, setActiveTab] = useState(active)

  const { data: patient } = useGetPatientSickLeavesQuery(
    encryptedPatientId
      ? {
          encryptedPatientId,
        }
      : skipToken
  )

  return (
    <PatientContext.Provider value={patientState}>
      <PatientHeader patient={patient} />
      <OpenTabsDialog />
      <PageContainer>
        <IDSTabs activeTab={parseInt(activeTab, 10)} emitTabChange={setActiveTab}>
          <IDSTab label="Sjukfall" />
          <IDSTab label="Läkarutlåtanden" />
          <IDSTabPanel nofocus>{activeTab === '0' && <PatientSickLeaves />}</IDSTabPanel>
          <IDSTabPanel nofocus>{activeTab === '1' && <PatientLUCertificatesTable />}</IDSTabPanel>
        </IDSTabs>
      </PageContainer>
    </PatientContext.Provider>
  )
}
