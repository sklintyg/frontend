import { LinkWithDialog } from '../../../../../components/LinkWithDialog/LinkWithDialog'

export function AboutPatientOverviewDialog() {
  return (
    <LinkWithDialog title="Om sammanhållen journalföring">
      <div className="flex flex-col gap-4">
        <p>
          Med sammanhållen journalföring avses möjligheten för en vårdgivare att läsa journaluppgifter från en annan vårdgivare direkt, på
          elektronisk väg.
        </p>
        <p>Observera att åtkomst och läsning av uppgifter via sammanhållen journalföring loggas.</p>
      </div>
    </LinkWithDialog>
  )
}
