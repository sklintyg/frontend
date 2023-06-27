import { Checkbox } from '../../Form/Checkbox'

export function ShowPersonalInformationFilter({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Checkbox
      label="Visa personuppgifter"
      checked={checked}
      description="Visar eller döljer patienternas namn och personnummer i tabellen."
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
  )
}
