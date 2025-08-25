import type { SjfItem } from '../../../../../schemas/patientSchema'
import { GetOpenInformationButton } from './GetOpenInformationButton'

export function OpenInformation({ items, onGetInformation }: { items: SjfItem[]; onGetInformation: (id: string) => void }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.itemId} className="mb-4 flex items-center">
          <div className="w-full">{item.itemName}</div>
          <div>
            {item.includedInSjukfall ? (
              <p className="italic">Hämtat</p>
            ) : (
              <GetOpenInformationButton onClick={onGetInformation} item={item} />
            )}
          </div>
        </div>
      ))}
    </>
  )
}
