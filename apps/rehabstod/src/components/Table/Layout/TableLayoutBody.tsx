import { IDSSpinner } from '@frontend/ids-react-ts'
import { SickLeaveInfo } from '../../../store/types/sickLeave'
import { CurrentSickLeaveInfo } from '../CurrentSickLeaves/CurrentSickLeaveInfo'

export function TableLayoutBody({
  title,
  tableHeaders,
  content,
  id,
  isLoading,
}: {
  title: string
  tableHeaders: string[]
  content: SickLeaveInfo[] | undefined
  id: string
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={tableHeaders.length}>
          <IDSSpinner />
        </td>
      </tr>
    )
  }

  if (content && content.length > 0) {
    return (
      <>
        {content.map((item) => (
          <tr key={`${id}-tr-${item.patient.id}`}>
            {tableHeaders.map((header) => (
              <CurrentSickLeaveInfo sickLeave={item} header={header} key={`${id}-td-${header}-${item.patient.id}`} />
            ))}
          </tr>
        ))}
      </>
    )
  }

  return (
    <tr>
      <td colSpan={tableHeaders.length}>
        {!content
          ? `Tryck på Sök för att visa alla dina ${title.toLowerCase()} för enheten, eller ange filterval och tryck på Sök för att visa urval av dina ${title.toLowerCase()}.`
          : 'Inga resultat'}
      </td>
    </tr>
  )
}
