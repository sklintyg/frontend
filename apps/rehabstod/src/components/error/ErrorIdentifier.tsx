import { classNames, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import { useState } from 'react'

export function ErrorIdentifier({ id, centerText = false }: { id: string; centerText?: boolean }) {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)
  return (
    <div className={classNames(centerText ? 'text-center' : '')}>
      <button
        type="button"
        aria-label="Kopiera fel-id"
        value={id}
        tabIndex={0}
        onClick={() => {
          setDisplayCopyMessage(true)
          navigator.clipboard.writeText(id)
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="flex items-center justify-center gap-1 font-bold">
              <span>Fel-id: </span> <span className="font-normal">{id}</span>
              <Icon icon="copy-file" size="s" />
            </p>
          </TooltipTrigger>
          <TooltipContent>Kopiera fel-id</TooltipContent>
        </Tooltip>
        <p className={classNames(centerText ? '' : 'flex justify-items-start')}>
          {displayCopyMessage && <strong className="text-xs">Fel-id kopierat till urklipp.</strong>}
        </p>
      </button>
    </div>
  )
}
