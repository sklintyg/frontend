import { Checkbox } from '../../Form/Checkbox'

export function ShowPersonalInformationCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="h-7">
      <Checkbox
        checked={checked}
        compact
        description="Visar eller döljer patienternas namn och personnummer i tabellen."
        label="Visa personuppgifter"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
    </div>
  )
}
