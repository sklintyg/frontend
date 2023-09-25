import { IDSAlert } from '@frontend/ids-react-ts'

export function EmptyCertificateListInfo() {
  return (
    <IDSAlert headline="Du har inga intyg">
      <p>
        I Intyg visas endast intyg som utfärdats digitalt till dig. Intyg har ingen ombudsfunktion och du kan inte ladda upp egna intyg.
      </p>
      <p>Om du saknar ett intyg, vänd dig till din mottagning.</p>
    </IDSAlert>
  )
}
