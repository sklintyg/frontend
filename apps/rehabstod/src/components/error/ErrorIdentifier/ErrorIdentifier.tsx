import { IDSIcon } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Tooltip } from '../../Tooltip/Tooltip'
import { TooltipContent } from '../../Tooltip/TooltipContent'
import { TooltipTrigger } from '../../Tooltip/TooltipTrigger'

export function ErrorIdentifier({ id }: { id: string }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  return (
    <div>
      <div className="flex justify-center">
        <p className="mr-2 font-bold">FEL-ID:</p>
        {id}
        <Tooltip>
          <TooltipTrigger>
            <button
              type="button"
              value={id}
              tabIndex={0}
              className="ml-2 inline"
              onClick={() => {
                setDisplayCopyMessage(true)
                navigator.clipboard.writeText(id)
              }}
            >
              <IDSIcon name="copy-file" size="s" colorpreset={1} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Kopiera fel-id</TooltipContent>
        </Tooltip>
      </div>
      {displayCopyMessage && <strong className="text-xs">Fel-id kopierat till urklipp.</strong>}
    </div>
  )
}
