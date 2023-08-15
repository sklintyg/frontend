import { IDSButton } from '@frontend/ids-react-ts'

export function PrintButton() {
  return (
    <IDSButton size="l" mblock onClick={() => window.print()} className="mb-3 whitespace-nowrap">
      Skriv ut
    </IDSButton>
  )
}
