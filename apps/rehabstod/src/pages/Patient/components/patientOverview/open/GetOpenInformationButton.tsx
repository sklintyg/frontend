import { IDSButton, IDSDialog } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { IDSDialogElement } from '@frontend/ids-react-ts/src'
import { SjfItem } from '../../../../../schemas/patientSchema'

export function GetOpenInformationButton({ item, onClick }: { item: SjfItem; onClick: (id: string) => void }) {
  const ref = useRef<IDSDialogElement>(null)

  if (item.bidrarTillAktivtSjukfall) {
    return (
      <IDSButton tertiary onClick={() => onClick(item.itemId)}>
        Hämta
      </IDSButton>
    )
  }

  return (
    <IDSDialog headline="Ingen information hämtad" ref={ref}>
      <IDSButton trigger="" tertiary>
        Hämta
      </IDSButton>
      <p>Vårdenhetens intyg tillhör inte pågående sjukfall och inhämtas därför inte.</p>
      <IDSButton onClick={() => ref.current?.hideDialog()} className="flex justify-center pb-5 pt-10">
        Stäng
      </IDSButton>
    </IDSDialog>
  )
}
