import { Input, Select } from '@frontend/components'
import { IDSAlert, IDSButton, IDSSpinner } from '@frontend/ids-react-ts'
import { ErrorAlert } from '../../../components/error/ErrorAlert/ErrorAlert'
import { Checkbox } from '../../../components/Form/Checkbox'
import { useCreateSickLeaveMutation, useGetTestDataOptionsQuery } from '../../../store/testabilityApi'
import { usePatientData } from '../hooks/usePatientData'

export function PatientData() {
  const { data: testDataOptions, error: testDataOptionsError, isLoading: getTestDataOptionsLoading } = useGetTestDataOptionsQuery()
  const [triggerCreateSickLeave, { isLoading: createSickLeaveLoading, data: certificateId }] = useCreateSickLeaveMutation()

  const [
    {
      careProviderId,
      careUnitId,
      patientId,
      doctorId,
      fromDays,
      toDays,
      primaryDiagnosisCode,
      secondDiagnosisCode,
      thirdDiagnosisCode,
      workCapacities,
      occupation,
      relationKod,
      relationsId,
      isSend,
      isRevoked,
    },
    updatePatientData,
  ] = usePatientData()

  if (getTestDataOptionsLoading) {
    return <IDSSpinner data-testid="spinner" />
  }

  if (testDataOptionsError) {
    return (
      <ErrorAlert
        heading="Tekniskt fel"
        errorType="error"
        text="Alternativ för testdata kunde inte laddas"
        error={testDataOptionsError}
        dynamicLink={false}
      />
    )
  }

  if (!testDataOptions) {
    return null
  }

  return (
    <>
      <div className="mb-7">
        <IDSAlert ribbon>Fyll i uppgifter nedan och tryck på knappen *Skapa* för att skapa ett sjukfall på vald patient.</IDSAlert>
      </div>

      <div className="mb-7 grid gap-7 md:grid-cols-2">
        <Select
          label="Vårdgivare"
          value={careProviderId}
          options={testDataOptions.careProviderIds.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={(e) => updatePatientData({ careProviderId: e.target.value })}
        />

        <Select
          label="Vårdenhet"
          value={careUnitId}
          options={testDataOptions.careUnitIds.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={(e) => updatePatientData({ careUnitId: e.target.value })}
        />

        <Select
          label="Läkare"
          value={doctorId}
          options={testDataOptions.doctorIds.map(({ hsaId, name }) => ({ value: hsaId, label: name }))}
          onChange={(e) => updatePatientData({ doctorId: e.target.value })}
        />

        <Select
          label="Patient"
          value={patientId}
          options={testDataOptions.patientIds.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={(e) => updatePatientData({ patientId: e.target.value })}
        />

        <Select
          label="Diagnoskod (PRIMÄR)"
          value={primaryDiagnosisCode}
          options={testDataOptions.diagnosisCodes.map((diagnosis) => ({ value: diagnosis, label: diagnosis }))}
          onChange={(e) => updatePatientData({ primaryDiagnosisCode: e.target.value })}
        />

        <Select
          label="Diagnoskod (Bi-diagnos 1)"
          value={secondDiagnosisCode ?? ''}
          defaultOption={{ value: '', label: '-' }}
          options={testDataOptions.diagnosisCodes.map((diagnosis) => ({ value: diagnosis, label: diagnosis }))}
          onChange={(e) => updatePatientData({ secondDiagnosisCode: e.target.value })}
        />

        <Select
          label="Diagnoskod (Bi-diagnos 2)"
          value={thirdDiagnosisCode ?? ''}
          defaultOption={{ value: '', label: '-' }}
          options={testDataOptions.diagnosisCodes.map((diagnosis) => ({ value: diagnosis, label: diagnosis }))}
          onChange={(e) => updatePatientData({ thirdDiagnosisCode: e.target.value })}
        />

        <Select
          label="Relationskod"
          value={relationKod ?? ''}
          defaultOption={{ value: undefined, label: '' }}
          options={testDataOptions.relationCodes.map(({ value, description }) => ({ value, label: description }))}
          onChange={(e) => updatePatientData({ relationKod: e.target.value })}
        />

        <Select
          label="Sysselsättningsgrad 1"
          value={workCapacities}
          options={testDataOptions.workCapacity.map(({ code, description }) => ({ value: code, label: description }))}
          onChange={(e) => updatePatientData({ workCapacities: e.target.value })}
        />

        <Select
          label="Sysselsättning"
          value={occupation}
          options={testDataOptions.occupations.map(({ code, description }) => ({ value: code, label: description }))}
          onChange={(e) => updatePatientData({ occupation: e.target.value })}
        />

        <Input
          label="Intygs-Id"
          description="Relaterat till vilket intyg som du vill lägga till vald relationskod"
          value={relationsId ?? ''}
          onChange={(e) => updatePatientData({ relationsId: e.currentTarget.value })}
        />

        <Input
          label="Startdatum"
          description="Ange antalet dagar bakåt i tiden från idag"
          value={fromDays}
          type="number"
          onChange={(e) => updatePatientData({ fromDays: e.currentTarget.value })}
        />

        <Input
          label="Slutdatum"
          description="Ange antalet dagar framåt i tiden från idag"
          value={toDays}
          type="number"
          onChange={(e) => updatePatientData({ toDays: e.currentTarget.value })}
        />
      </div>
      <div className="mb-7 flex flex-col gap-2">
        <Checkbox label="Skicka" checked={isSend} onChange={(e) => updatePatientData({ isSend: e.target.checked })} />

        <Checkbox label="Makulera" checked={isRevoked} onChange={(e) => updatePatientData({ isRevoked: e.target.checked })} />
      </div>

      <IDSButton
        sblock
        disabled={createSickLeaveLoading}
        onclick={() =>
          triggerCreateSickLeave({
            careProviderId,
            careUnitId,
            patientId,
            fromDays,
            toDays,
            doctorId,
            relationsId,
            relationKod,
            diagnosisCode: [primaryDiagnosisCode, secondDiagnosisCode, thirdDiagnosisCode].filter(Boolean),
            occupation,
            workCapacity: [workCapacities],
            isSend,
            isRevoked,
          })
        }
      >
        Skapa
      </IDSButton>

      <div className="mt-4">{certificateId !== undefined ? <p>{`intygs-Id: ${certificateId}`}</p> : ''}</div>
    </>
  )
}
