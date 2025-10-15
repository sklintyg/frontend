import { Checkbox } from '../../../../../../packages/components/src/form/Checkbox/Checkbox'

export function ShowPersonalInformationCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="h-7">
      <Checkbox
        light
        checked={checked}
        description="Visar eller döljer patienternas namn och personnummer i tabellen."
        label="Visa personuppgifter"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
    </div>
  )
}
