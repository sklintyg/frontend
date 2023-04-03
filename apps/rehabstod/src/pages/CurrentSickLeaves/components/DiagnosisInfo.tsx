import { IDSTooltip } from '@frontend/ids-react-ts'

export function DiagnosisInfo({ code, description, isSubDiagnosis }: { code: string; description: string; isSubDiagnosis: boolean }) {
  return (
    <IDSTooltip>
      <div slot="trigger">
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
