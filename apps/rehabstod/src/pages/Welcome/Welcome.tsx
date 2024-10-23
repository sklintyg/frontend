import { IDSAlert, IDSButton, IDSCard, IDSHeader, IDSIconExternal, IDSLink, IDSTab, IDSTabPanel, IDSTabs } from '@frontend/ids-react-ts'
import { ErrorAlert } from '../../components/error/ErrorAlert/ErrorAlert'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setCareProviderId,
  setCareUnitId,
  setDoctorId,
  setFromDays,
  setIsRevoked,
  setIsSend,
  setOccupation,
  setPatientId,
  setPrimaryDiagnosisCode,
  setRelationKod,
  setRelationsId,
  setSecondDiagnosisCode,
  setThirdDiagnosisCode,
  setToDays,
  setWorkCapacities,
} from '../../store/slices/welcome.slice'
import { useCreateDefaultTestDataMutation, useCreateSickLeaveMutation, useGetTestDataOptionsQuery } from '../../store/testabilityApi'
import { FakeLogin } from './components/FakeLogin'

export function Welcome() {
  const {
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
  } = useAppSelector((state) => state.welcome)
  const dispatch = useAppDispatch()
  const [triggerDefaultTestDataQuery, { isLoading: testDataLoading, data: response, error: createDefaultTestDataError }] =
    useCreateDefaultTestDataMutation()
  const [triggerCreateSickLeave, { isLoading: createSickLeaveLoading, data: certificateId }] = useCreateSickLeaveMutation()
  const { data: testDataOptions, isLoading: testDataOptionsLoading, error: testDataOptionsError } = useGetTestDataOptionsQuery()

  if (testDataLoading || testDataOptionsLoading || createSickLeaveLoading) {
    return <>Loading</>
  }

  const createSickleave = () => {
    const diagnosisCode = [primaryDiagnosisCode]
    if (secondDiagnosisCode) {
      diagnosisCode.push(secondDiagnosisCode)
    }
    if (thirdDiagnosisCode) {
      diagnosisCode.push(thirdDiagnosisCode)
    }
    const workCapacity = [workCapacities]
    triggerCreateSickLeave({
      careProviderId,
      careUnitId,
      patientId,
      fromDays,
      toDays,
      doctorId,
      relationsId,
      relationKod,
      diagnosisCode,
      occupation,
      workCapacity,
      isSend,
      isRevoked,
    })
  }

  if (createDefaultTestDataError) {
    return (
      <div>
        <IDSAlert />
      </div>
    )
  }

  return (
    <>
      <IDSHeader type="inera-admin" brandtext="Rehabstöd" />
      <div className="m-auto max-w-4xl px-3 py-2">
        <IDSTabs>
          <IDSTab label="Login" />
          <IDSTab label="Testdata" />
          <IDSTab label="Patientdata" />

          <IDSTabPanel>
            <FakeLogin />
          </IDSTabPanel>

          <IDSTabPanel>
            <div className="mb-2">
              <IDSCard className="mb-5" fill={1}>
                Tryck på knappen *Skapa testdata* för att skjuta in test-data. Beskrivning om datat hittas här:{' '}
              </IDSCard>
            </div>
            <div className="mb-2">
              <IDSLink>
                <a target="_blank" href="https://inera.atlassian.net/wiki/spaces/IT/pages/3174432876/Rehabst+d+-+Testdata" rel="noreferrer">
                  Rehabstod - Testdata Documentation
                </a>
                <IDSIconExternal />
              </IDSLink>
            </div>
            <IDSButton sblock onClick={() => triggerDefaultTestDataQuery()}>
              Skapa testdata
            </IDSButton>
            {response && <div className="mt-4">{response}</div>}
          </IDSTabPanel>

          <IDSTabPanel>
            <div className="mb-7">
              <IDSCard fill={1}>Fyll i uppgifter nedan och tryck på knappen *Skapa* för att skapa ett sjukfall på vald patient.</IDSCard>
            </div>
            {testDataOptions && (
              <form id="createSickLeaveForm" onSubmit={createSickleave}>
                <label className="mt-12" htmlFor="careProviderId">
                  Vårdgivare
                </label>
                <select
                  id="careProviderId"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={careProviderId}
                  onChange={(e) => dispatch(setCareProviderId(e.target.value))}
                >
                  {testDataOptions.careProviderIds.map(({ id, name }) => (
                    <option key={`${id}_${name}`} id={`${id}_${name}`} value={id}>
                      {`${name}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="careUnitId">Vårdenhet</label>
                <select
                  id="careUnitId"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={careUnitId}
                  onChange={(e) => dispatch(setCareUnitId(e.target.value))}
                >
                  {testDataOptions.careUnitIds.map(({ id, name }) => (
                    <option key={`${id}_${name}`} id={`${id}_${name}`} value={id}>
                      {`${name}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="doctorId">Läkare</label>
                <select
                  id="doctorId"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={doctorId}
                  onChange={(e) => dispatch(setDoctorId(e.target.value))}
                >
                  {testDataOptions.doctorIds.map(({ hsaId, name }) => (
                    <option key={`${hsaId}_${name}`} id={`${hsaId}_${name}`} value={hsaId}>
                      {`${name}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="patientId">Patient</label>
                <select
                  id="patientId"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={patientId}
                  onChange={(e) => dispatch(setPatientId(e.target.value))}
                >
                  {testDataOptions.patientIds.map(({ id, name }) => (
                    <option key={`${id}_${name}`} id={`${id}_${name}`} value={id}>
                      {`${name}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="diagnosisCodes">Diagnoskod (PRIMÄR)</label>
                <select
                  id="diagnosisCodes"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={primaryDiagnosisCode}
                  onChange={(e) => dispatch(setPrimaryDiagnosisCode(e.target.value))}
                >
                  {testDataOptions.diagnosisCodes.map((diagnosis) => (
                    <option key={`${diagnosis}_${diagnosis}`} id={`${diagnosis}_${diagnosis}`} value={diagnosis}>
                      {`${diagnosis}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="diagnosisCodesSecondary">Diagnoskod (Bi-diagnos 1)</label>
                <select
                  id="diagnosisCodesSecondary"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={secondDiagnosisCode ?? ''}
                  onChange={(e) => dispatch(setSecondDiagnosisCode(e.target.value))}
                >
                  <option key="secondDiagnosis" id="secondDiagnosis" value="">
                    Ingen
                  </option>
                  {testDataOptions.diagnosisCodes.map((diagnosis) => (
                    <option key={`${diagnosis}_${diagnosis}`} id={`${diagnosis}_${diagnosis}`} value={diagnosis}>
                      {`${diagnosis}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="diagnosisCodesThird">Diagnoskod (Bi-diagnos 2)</label>
                <select
                  id="diagnosisCodesThird"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={thirdDiagnosisCode ?? ''}
                  onChange={(e) => dispatch(setThirdDiagnosisCode(e.target.value))}
                >
                  <option key="thirdDiagnosis" id="thirdDiagnosis" value="">
                    Ingen
                  </option>
                  {testDataOptions.diagnosisCodes.map((diagnosis) => (
                    <option key={`${diagnosis}_${diagnosis}`} id={`${diagnosis}_${diagnosis}`} value={diagnosis}>
                      {`${diagnosis}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="workcapacity">Sysselsättningsgrad 1</label>
                <select
                  id="workcapacity"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={workCapacities}
                  onChange={(e) => dispatch(setWorkCapacities(e.target.value))}
                >
                  {testDataOptions.workCapacity.map(({ code, description }) => (
                    <option key={`${code}_${description}`} id={`${code}_${description}`} value={code}>
                      {`${description}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="occupations">Sysselsättning</label>
                <select
                  id="occupations"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={occupation}
                  onChange={(e) => dispatch(setOccupation(e.target.value))}
                >
                  {testDataOptions.occupations.map(({ code, description }) => (
                    <option key={`${code}_${description}`} id={`${code}_${description}`} value={code}>
                      {`${description}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="relationCode">Relationskod</label>
                <select
                  id="relationCode"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={relationKod ?? ''}
                  onChange={(e) => dispatch(setRelationKod(e.target.value))}
                >
                  <option key="noRelationCode" id="noRelationCodeId" value={undefined}>
                    {`${''}`}
                  </option>
                  {testDataOptions.relationCodes.map(({ value, description }) => (
                    <option key={`${value}_${description}`} id={`${value}_${description}`} value={value}>
                      {`${description}`}
                    </option>
                  ))}
                </select>
                <label htmlFor="relationId">Intygs-Id (Relaterat till vilket intyg som du vill lägga till vald relationskod)</label>
                <input
                  id="relationId"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={relationsId ?? ''}
                  onChange={(e) => dispatch(setRelationsId(e.target.value))}
                />
                <label htmlFor="fromDays">Startdatum - Ange antalet dagar bakåt i tiden från idag.</label>
                <input
                  id="fromDays"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={fromDays}
                  type="number"
                  onChange={(e) => dispatch(setFromDays(e.target.value))}
                />
                <label htmlFor="toDays">Slutdatum - Ange antalet dagar framåt i tiden från idag.</label>
                <input
                  id="toDays"
                  className="mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left text-neutral-20"
                  value={toDays}
                  type="number"
                  onChange={(e) => dispatch(setToDays(e.target.value))}
                />
                <div className="mt-2">
                  <label htmlFor="send">Skicka?</label>
                  <input
                    id="send"
                    type="checkbox"
                    className="ml-2 mt-2 box-border scale-125 truncate rounded border py-3 pl-5 pr-12 text-left"
                    checked={isSend}
                    onChange={(e) => dispatch(setIsSend(e.target.checked))}
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="revoked">Makulera?</label>
                  <input
                    id="revoked"
                    type="checkbox"
                    className="ml-2 mt-2 box-border scale-125 truncate rounded border py-3 pl-5 pr-12 text-left"
                    checked={isRevoked}
                    onChange={(e) => dispatch(setIsRevoked(e.target.checked))}
                  />
                </div>
                <IDSButton sblock className="mt-12" disabled={createSickLeaveLoading} onclick={createSickleave}>
                  {createSickLeaveLoading ? 'Sending...' : 'Skapa'}
                </IDSButton>
              </form>
            )}
            {testDataOptionsError && (
              <ErrorAlert
                heading="Tekniskt fel"
                errorType="error"
                text="Alternativ för testdata kunde inte laddas"
                error={testDataOptionsError}
                dynamicLink={false}
              />
            )}
            <div className="mt-4">{certificateId !== undefined ? <p>{`intygs-Id: ${certificateId}`}</p> : ''}</div>
          </IDSTabPanel>
        </IDSTabs>
      </div>
    </>
  )
}
