import { IDSAlert, IDSIconExternal, IDSLink, IDSSpinner } from '@inera/ids-react'
import { Button } from '../../../components/Button/Button'
import { ErrorAlert } from '../../../components/error/ErrorAlert/ErrorAlert'
import { useCreateDefaultTestDataMutation } from '../../../store/testabilityApi'

export function TestData() {
  const [triggerDefaultTestDataQuery, { isLoading, data, error }] = useCreateDefaultTestDataMutation()

  if (isLoading) {
    return <IDSSpinner data-testid="spinner" />
  }

  if (error) {
    return (
      <ErrorAlert heading="Tekniskt fel" errorType="error" text="Fel uppstod vid skapande av testdata" error={error} dynamicLink={false} />
    )
  }

  return (
    <>
      <div className="mb-7">
        <IDSAlert ribbon>
          Tryck på knappen *Skapa testdata* för att skjuta in test-data.
          <br />
          Beskrivning om datat hittas här:{' '}
          <IDSLink>
            <a target="_blank" href="https://inera.atlassian.net/wiki/spaces/IT/pages/3174432876/Rehabst+d+-+Testdata" rel="noreferrer">
              Rehabstod - Testdata Documentation
              <IDSIconExternal />
            </a>
          </IDSLink>
        </IDSAlert>
      </div>
      <Button sblock role="button" onClick={() => triggerDefaultTestDataQuery()}>
        Skapa testdata
      </Button>
      {data && <div className="mt-4">{data}</div>}
    </>
  )
}
