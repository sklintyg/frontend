import { IDSIconCog } from '@inera/ids-react'
import type { MouseEventHandler } from 'react'

export function SettingsButton({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button trigger="" onClick={onClick} className="ids-my-5 flex w-full items-center text-primary-40" type="button">
      <div className="mr-2.5">
        <IDSIconCog color="currentColor" color2="currentColor" height="20" width="20" />
      </div>
      <div className="flex-auto text-left">Inställningar</div>
    </button>
  )
}
