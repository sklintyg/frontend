import { IDSAlert } from '@inera/ids-react'

export function EmptyCertificateListInfo({ total }: { total: number }) {
  if (total > 0) {
    return (
      <IDSAlert role="alert" headline={<h2>Din filtrering gav inga träffar</h2>}>
        <p>Testa att ändra de filter du valt. Du kan också klicka på rensa filter för att se alla dina intyg.</p>
      </IDSAlert>
    )
  }
  return (
    <IDSAlert role="alert" headline={<h2>Du har inga intyg</h2>}>
      <p>
        I Intyg visas endast intyg som utfärdats digitalt till dig. Intyg har ingen ombudsfunktion och du kan inte ladda upp egna intyg.
      </p>
      <p>Om du saknar ett intyg, vänd dig till din mottagning.</p>
    </IDSAlert>
  )
}
