import { IDSTooltip } from '@frontend/ids-react-ts'

export function DiagnosisInfo({ code, description, isSubDiagnosis }: { code: string; description: string; isSubDiagnosis: boolean }) {
  return (
    <IDSTooltip>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div slot="trigger" tabIndex={0}>
        {code} {!isSubDiagnosis && description}
      </div>
      <div slot="tooltip">
        {code}
        <br />
        {description || `Diagnoskod ${code} är okänd och har ingen beskrivning`}
      </div>
    </IDSTooltip>
  )
}
