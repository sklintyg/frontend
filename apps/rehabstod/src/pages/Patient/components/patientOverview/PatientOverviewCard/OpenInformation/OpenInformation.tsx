import { IDSButton, IDSDialog, IDSDialogElement } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { SjfItem } from '../../../../../../schemas/patientSchema'

function GetOpenInformationButton({ item, onClick }: { item: SjfItem; onClick: (id: string) => void }) {
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
      <IDSButton onClick={() => ref.current?.hideDialog()} className="flex justify-center pt-10 pb-5">
        Stäng
      </IDSButton>
    </IDSDialog>
  )
}

export function OpenInformation({ items, onGetInformation }: { items: SjfItem[]; onGetInformation: (id: string) => void }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.itemId} className="flex justify-between pb-3">
          <p>{item.itemName}</p>
          {item.includedInSjukfall ? <p className="italic">Hämtat</p> : <GetOpenInformationButton onClick={onGetInformation} item={item} />}
        </div>
      ))}
    </>
  )
}
