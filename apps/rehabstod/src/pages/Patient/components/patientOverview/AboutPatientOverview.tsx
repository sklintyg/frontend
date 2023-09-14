import { Accordion } from '../../../../components/Accordion/Accordion'

export function AboutPatientOverview() {
  return (
    <Accordion title="Om samtycke och sammanhållen vårddokumentation">
      <div className="flex flex-col gap-4">
        <p>
          Med sammanhållen vårddokumentation avses möjligheten för en vårdgivare att digitalt läsa vårddokumentation från en annan
          vårdgivare.
        </p>
        <p>Observera att åtkomst och läsning av uppgifter via sammanhållen vårddokumentation loggas.</p>
        <p>För att ta del av uppgifter via sammanhållen vårddokumentation behöver du ha</p>
        <ul className="list-disc pl-10">
          <li>en pågående vårdrelation med patienten samt</li>
          <li>patientens samtycke</li>
        </ul>
        <p>Samtycket kan ha getts muntligen eller skriftligen.</p>
      </div>
    </Accordion>
  )
}
