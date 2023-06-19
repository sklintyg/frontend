import { IDSIconCog } from '@frontend/ids-react-ts'
import { MouseEventHandler } from 'react'

export function SettingsButton({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button trigger="" onClick={onClick} className="ids-my-5 text-primary-40 flex w-full items-center" type="button">
      <div className="mr-2.5">
        <IDSIconCog color="currentColor" color2="currentColor" height="20" width="20" />
      </div>
      <div className="flex-auto text-left">Inställningar</div>
    </button>
  )
}
