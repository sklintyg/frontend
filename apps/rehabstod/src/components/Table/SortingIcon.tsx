import { IDSIcon } from '@frontend/ids-react-ts'

export function SortingIcon({ ascending, sorting }: { ascending: boolean; sorting: boolean }) {
  return (
    <div className="relative ml-1 inline-block h-3 w-6">
      <IDSIcon
        className={`absolute right-0 ${sorting && !ascending && 'hidden'}`}
        name="arrow"
        rotate="270"
        width="14"
        height="14"
        color="currentColor"
        color2="currentColor"
      />
      <IDSIcon
        className={`absolute left-0 ${sorting && ascending && 'hidden'}`}
        name="arrow"
        rotate="90"
        width="14"
        height="14"
        color="currentColor"
        color2="currentColor"
      />
    </div>
  )
}
