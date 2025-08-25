import { useState } from 'react'

export function usePatientData() {
  const initialState = {
    careProviderId: 'TSTNMT2321000156-ALFA',
    careUnitId: 'TSTNMT2321000156-ALMC',
    patientId: '194011306125',
    doctorId: 'TSTNMT2321000156-DRAA',
    fromDays: '-10',
    toDays: '10',
    primaryDiagnosisCode: 'A010',
    secondDiagnosisCode: '',
    thirdDiagnosisCode: '',
    workCapacities: 'EN_FJARDEDEL',
    occupation: 'NUVARANDE_ARBETE',
    relationsId: null as string | null,
    relationKod: null as string | null,
    isSend: false,
    isRevoked: false,
  }

  const [state, updateState] = useState(initialState)

  return [state, (data: Partial<typeof initialState>) => updateState((current) => ({ ...current, ...data }))] as const
}
