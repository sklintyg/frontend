import { Button } from '../Button/Button'

export function PrintButton() {
  const label = 'Skriv ut'
  const onClickHandler = () => window.print()
  return (
    <div>
      <Button size="l" onClick={onClickHandler} className="hidden whitespace-nowrap lg:inline-block">
        {label}
      </Button>
      <Button size="m" mblock onClick={onClickHandler} className="whitespace-nowrap lg:hidden">
        {label}
      </Button>
    </div>
  )
}
