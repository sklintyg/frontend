import { IDSButton } from '@frontend/ids-react-ts'
import { SjfItem } from '../../../../schemas/patientSchema'

export function OpenInformation({ items, onGetInformation }: { items: SjfItem[]; onGetInformation: (id: string) => void }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.itemId} className="flex justify-between pb-3">
          <p>{item.itemName}</p>
          {item.bidrarTillAktivtSjukfall ? (
            <p>Hämtad</p>
          ) : (
            <IDSButton tertiary onClick={() => onGetInformation(item.itemId)}>
              Hämta
            </IDSButton>
          )}
        </div>
      ))}
    </>
  )
}
