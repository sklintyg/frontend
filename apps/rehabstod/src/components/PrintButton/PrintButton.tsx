import { IDSButton } from '@frontend/ids-react-ts'

export function PrintButton() {
  const label = 'Skriv ut'
  const onClickHandler = () => window.print()
  return (
    <div>
      <IDSButton size="l" onClick={onClickHandler} className="hidden whitespace-nowrap lg:inline-block">
        {label}
      </IDSButton>
      <IDSButton size="m" mblock onClick={onClickHandler} className="whitespace-nowrap lg:hidden">
        {label}
      </IDSButton>
    </div>
  )
}
