import { IDSButton } from '@frontend/ids-react-ts/dist'

export function PrintButton() {
  return (
    <IDSButton onClick={() => window.print()} className="mb-3 whitespace-nowrap">
      Skriv ut
    </IDSButton>
  )
}
