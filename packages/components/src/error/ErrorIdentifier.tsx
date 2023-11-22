import { IDSIconCopyFile } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip'
import { classNames } from '../utils'

export function ErrorIdentifier({ id, showTitle = true }: { id: string; showTitle?: boolean }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  return (
    <div className="text-center">
      <p className="flex justify-center gap-1 align-bottom font-bold">
        {showTitle && <span>FEL-ID: </span>} <span className={classNames(showTitle ? 'font-normal' : 'font-bold')}>{id}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              value={id}
              tabIndex={0}
              onClick={() => {
                setDisplayCopyMessage(true)
                navigator.clipboard.writeText(id)
              }}
            >
              <IDSIconCopyFile size="s" colorpreset={1} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Kopiera fel-id</TooltipContent>
        </Tooltip>
      </p>
      {displayCopyMessage && <strong className="text-xs">Fel-id kopierat till urklipp.</strong>}
    </div>
  )
}
