import { useState } from 'react'
import { IDSButton, IDSButtonGroup, IDSRadioGroup } from '@frontend/ids-react-ts'
import { PatientOverviewApprovalChoices, SjfItem } from '../../../../schemas/patientSchema'
import { Checkbox } from '../../../../components/Form/Checkbox'
import { FormattedNumberInput } from '../../../../components/Form/FormattedNumberInput'
import { RadioButton } from '../../../../components/Form/RadioButton'
import { OpenInformation } from './OpenInformation'
import { BlockedInformation } from './BlockedInformation'

export function OpenInformationWithApproval({
  items,
  onGetInformation,
  onGiveApproval,
  hasApproval,
}: {
  items: SjfItem[]
  onGetInformation: (id: string) => void
  onGiveApproval: (days: string, onlyCurrentUser: boolean) => void
  hasApproval: boolean
}) {
  const [checkedApproval, setCheckedApproval] = useState(false)
  const [daysOfApproval, setDaysOfApproval] = useState('7')
  const [approvalId, setApprovalId] = useState(PatientOverviewApprovalChoices.ONLYCURRENT)

  return (
    <>
      {hasApproval ? (
        <OpenInformation items={items} onGetInformation={onGetInformation} />
      ) : (
        <BlockedInformation items={items.map((item) => item.itemName)} />
      )}
      <h4 className="ids-heading-4 pt-5">Samtycke sammanhållen journalföring</h4>
      <Checkbox
        label="Patienten samtycker till att information hämtas från andra vårdgivare i:"
        checked={checkedApproval}
        onChange={(event) => setCheckedApproval(event.currentTarget.checked)}
        className="bg-white"
      />
      <div className="flex w-44 items-center gap-3">
        <FormattedNumberInput
          label=""
          onChange={(value) => setDaysOfApproval(value)}
          value={daysOfApproval}
          max="365"
          min="1"
          defaultValue="7"
          disabled={!checkedApproval}
        />
        <p>dagar</p>
      </div>
      <h4 className="ids-heading-4">Vem har samtycke?</h4>
      <IDSRadioGroup name="patientOverviewApprovalChoices">
        <RadioButton
          disabled={!checkedApproval}
          label="Bara jag"
          onChange={(event) => setApprovalId(event.currentTarget.value as PatientOverviewApprovalChoices)}
          value="ONLYCURRENT"
          checked={approvalId === PatientOverviewApprovalChoices.ONLYCURRENT}
        />
        <RadioButton
          disabled={!checkedApproval}
          label="All behörig personal på vårdenheten"
          onChange={(event) => setApprovalId(event.currentTarget.value as PatientOverviewApprovalChoices)}
          value={PatientOverviewApprovalChoices.ALL}
          checked={approvalId === PatientOverviewApprovalChoices.ALL}
        />
      </IDSRadioGroup>
      <IDSButtonGroup>
        <IDSButton secondary>Avbryt</IDSButton>
        <IDSButton
          disabled={!checkedApproval}
          onClick={() => onGiveApproval(daysOfApproval, approvalId === PatientOverviewApprovalChoices.ONLYCURRENT)}>
          Patienten ger samtycke
        </IDSButton>
      </IDSButtonGroup>
    </>
  )
}
