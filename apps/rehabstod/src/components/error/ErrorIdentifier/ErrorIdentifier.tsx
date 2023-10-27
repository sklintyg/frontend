import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import { IDSIconCopyFile } from '@frontend/ids-react-ts'
import { useState } from 'react'

export function ErrorIdentifier({ id }: { id: string }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  return (
    <div className="text-center">
      <p className="flex justify-center gap-1 align-bottom font-bold">
        FEL-ID: <span className="font-normal">{id}</span>
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
