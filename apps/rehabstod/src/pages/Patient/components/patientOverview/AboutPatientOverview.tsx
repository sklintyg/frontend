import { ExpandableLink } from '../../../../components/ExpandableLink/ExpandableLink'

export function AboutPatientOverview() {
  return (
    <ExpandableLink title="Om samtycke och sammanhållen vårddokumentation">
      <div className="flex flex-col gap-4">
        <p>
          Med sammanhållen vårddokumentation avses möjligheten för en vårdgivare att läsa journaluppgifter från en annan vårdgivare direkt,
          på elektronisk väg.
        </p>
        <p>Observera att åtkomst och läsning av uppgifter via sammanhållen vårddokumentation loggas.</p>
        <p>För att ta del av uppgifter via sammanhållen vårddokumentation behöver du ha</p>
        <ul className="list-disc pl-10">
          <li>En pågående vårdrelation med patienten samt</li>
          <li>Patientens samtycke.</li>
        </ul>
        <p> Samtycket kan ha lämnats muntligen eller skriftligen.</p>
      </div>
    </ExpandableLink>
  )
}
