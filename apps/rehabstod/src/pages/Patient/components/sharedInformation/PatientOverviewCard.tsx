import { IDSButton, IDSCard } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SjfItem } from '../../../../schemas/patientSchema'

export function PatientOverviewCard({
  title,
  subTitle,
  description,
  items,
}: {
  title: string
  subTitle: string
  description: string
  items: SjfItem[]
}) {
  const [expanded, setExpanded] = useState(false)

  const getContent = () => {
    if (items.length === 0) {
      return <p>Det finns för tillfället ingen information i denna kategori att inhämta.</p>
    }

    if (!expanded) {
      return (
        <>
          <p>{description}</p>
          <IDSButton onClick={() => setExpanded(true)}>Visa mig</IDSButton>
        </>
      )
    }

    return (
      <>
        <h4>{subTitle}</h4>
        {items.map((item) => (
          <div key={item.itemId}>
            <p>{item.itemName}</p>
            <IDSButton tertiary>Hämta</IDSButton>
          </div>
        ))}
      </>
    )
  }

  return (
    <IDSCard fill>
      <h4>{title}</h4>
      <hr />
      {getContent()}
    </IDSCard>
  )
}
