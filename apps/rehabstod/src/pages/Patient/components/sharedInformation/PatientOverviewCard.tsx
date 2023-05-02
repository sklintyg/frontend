import { IDSButton, IDSCard } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SjfItem } from '../../../../schemas/patientSchema'

export function PatientOverviewCard({
  title,
  subTitle,
  description,
  items,
  includedItems,
  onGetInformation,
}: {
  title: string
  subTitle: string
  description: string
  items: SjfItem[]
  includedItems: string[]
  onGetInformation: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const getContent = () => {
    if (items.length === 0) {
      return <p className="py-5">Det finns för tillfället ingen information i denna kategori att inhämta.</p>
    }

    if (!expanded) {
      return (
        <>
          <p className="py-5">{description}</p>
          <IDSButton onClick={() => setExpanded(true)} className="flex justify-center">
            Visa
          </IDSButton>
        </>
      )
    }

    return (
      <>
        <h4 className="ids-heading-4 pt-5">{subTitle}</h4>
        {items.map((item) => (
          <div key={item.itemId} className="flex justify-between pb-3">
            <p>{item.itemName}</p>
            {includedItems.find((id) => id === item.itemId) ? (
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

  return (
    <IDSCard fill>
      <h4 className="ids-heading-4">{title}</h4>
      <hr />
      {getContent()}
    </IDSCard>
  )
}
