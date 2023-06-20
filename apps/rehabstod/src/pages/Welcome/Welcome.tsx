import { IDSAlert, IDSButton, IDSCard, IDSContainer } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { ErrorAlert } from '../../components/error/ErrorAlert/ErrorAlert'
import { useCreateDefaultTestDataMutation, useCreateSickLeaveMutation, useGetTestDataOptionsQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectFilter,
  selectLogin,
  selectUnit,
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
  updateFreetext,
} from '../../store/slices/welcome.slice'
import { useWelcome } from './useWelcome'

export function Welcome() {
  const {
    selectedLogin,
    selectedUnit,
    freeText,
    selectedFilter,
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
  const { isLoading, fakeLogins } = useWelcome()

  useEffect(() => {
    if (fakeLogins.length > 0) {
      if (!fakeLogins.find(({ hsaId }) => hsaId === selectedLogin)) {
        dispatch(selectLogin(fakeLogins[0].hsaId))
      }

      if (!fakeLogins.find(({ forvaldEnhet }) => forvaldEnhet === selectedUnit)) {
        dispatch(selectUnit(fakeLogins[0].forvaldEnhet))
      }
    }
  }, [dispatch, fakeLogins, selectedLogin, selectedUnit])

  if (isLoading || testDataLoading || testDataOptionsLoading || createSickLeaveLoading) {
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
    <IDSContainer>
      <div className="ids-content py-4">
        <h1 className="ids-heading-2">Testinloggningar Rehabstöd</h1>
        <div className="mb-7">
          <IDSCard fill>
            Templatelista till vänster - Manuella ändringar kan göras i jsonstrukturen - detta omvandlas till inloggad userContext
          </IDSCard>
        </div>
        <div className="flex space-x-7 pb-4">
          <div className="w-6/12 flex-auto">
            Visa Mallar för
            <div className="pb-2">
              {[
                ['all', 'All'],
                ['dev', 'Dev'],
                ['demo', 'Demo'],
              ].map(([id, label]) => (
                <label key={id} htmlFor={id} className="pr-2">
                  <input
                    type="radio"
                    value={id}
                    id={id}
                    onChange={(event) => {
                      dispatch(selectFilter(event.target.value))
                    }}
                    name="filter"
                    checked={selectedFilter === id}
                  />{' '}
                  {label}
                </label>
              ))}
            </div>
            <label htmlFor="fakelogin">
              Login
              <select
                id="fakelogin"
                onChange={({ target }) => {
                  const selected = target.children[target.selectedIndex]
                  const [hsaId, unitId] = selected.id.split('_')
                  dispatch(selectLogin(hsaId))
                  dispatch(selectUnit(unitId))
                  dispatch(updateFreetext(null))
                }}
                className="border-accent-40 w-full rounded border p-2"
              >
                {fakeLogins.map(({ hsaId, forvaldEnhet, beskrivning }) => (
                  <option key={`${hsaId}_${forvaldEnhet}`} id={`${hsaId}_${forvaldEnhet}`}>
                    {beskrivning}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="w-6/12 flex-auto">
            <form id="loginForm" action="/fake" method="POST" acceptCharset="UTF-8">
              <label htmlFor="userJsonDisplay">
                Result
                <textarea
                  id="userJsonDisplay"
                  name="userJsonDisplay"
                  value={freeText != null ? freeText : JSON.stringify({ hsaId: selectedLogin, enhetId: selectedUnit }, null, 2)}
                  onChange={(event) => dispatch(updateFreetext(event.target.value))}
                  className="border-accent-40 w-full whitespace-nowrap rounded border p-2"
                  rows={4}
                />
              </label>

              <IDSButton type="submit">Logga in</IDSButton>
            </form>
          </div>
        </div>
        <div className="mt-12">
          <h1 className="ids-heading-2">Testability Rehabstöd</h1>
          <div className="mb-7">
            <IDSCard fill>Tryck på knappen *Skapa testdata* för att skjuta in test-data. Beskrivning om datat hittas här: </IDSCard>
            <a href="https://inera.atlassian.net/wiki/spaces/IT/pages/3174432876/Rehabst+d+-+Testdata">
              https://inera.atlassian.net/wiki/spaces/IT/pages/3174432876/RehabstodTestdata
            </a>
          </div>
          <div className="mb-10">
            <IDSButton onClick={() => triggerDefaultTestDataQuery()}>Skapa testdata</IDSButton>
            <div className="mt-4">{response ?? <p>{response}</p>}</div>
          </div>
          <div className="mb-7">
            <IDSCard fill>Fyll i uppgifter nedan och tryck på knappen *Skapa* för att skapa ett sjukfall på vald patient.</IDSCard>
          </div>
          {testDataOptions && (
            <form id="createSickLeaveForm" onSubmit={createSickleave}>
              <label className="mt-12" htmlFor="careProviderId">
                Vårdgivare
              </label>
              <select
                id="careProviderId"
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={secondDiagnosisCode !== null ? secondDiagnosisCode : ''}
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={thirdDiagnosisCode !== null ? thirdDiagnosisCode : ''}
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={relationKod !== null ? relationKod : ''}
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
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={relationsId !== null ? relationsId : ''}
                onChange={(e) => dispatch(setRelationsId(e.target.value))}
              />
              <label htmlFor="fromDays">Startdatum - Ange antalet dagar bakåt i tiden från idag.</label>
              <input
                id="fromDays"
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={fromDays}
                type="number"
                onChange={(e) => dispatch(setFromDays(e.target.value))}
              />
              <label htmlFor="toDays">Slutdatum - Ange antalet dagar framåt i tiden från idag.</label>
              <input
                id="toDays"
                className="text-neutral-20 mt-2 box-border w-full appearance-none truncate rounded border py-3 pl-5 pr-12 text-left"
                value={toDays}
                type="number"
                onChange={(e) => dispatch(setToDays(e.target.value))}
              />
              <div className="mt-2">
                <label htmlFor="send">Skicka?</label>
                <input
                  id="send"
                  type="checkbox"
                  className="mt-2 ml-2 box-border scale-125 truncate rounded border py-3 pl-5 pr-12 text-left"
                  checked={isSend}
                  onChange={(e) => dispatch(setIsSend(e.target.checked))}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="revoked">Makulera?</label>
                <input
                  id="revoked"
                  type="checkbox"
                  className="mt-2 ml-2 box-border scale-125 truncate rounded border py-3 pl-5 pr-12 text-left"
                  checked={isRevoked}
                  onChange={(e) => dispatch(setIsRevoked(e.target.checked))}
                />
              </div>
              <IDSButton className="mt-12" disabled={isLoading} onclick={createSickleave}>
                {isLoading ? 'Sending...' : 'Skapa'}
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
        </div>
      </div>
    </IDSContainer>
  )
}
