import { useState } from 'react'
import { Icon } from '../Icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip'
import { classNames } from '../utils'

export function ErrorIdentifier({ id, showTitle = true, centerText = true }: { id: string; showTitle?: boolean; centerText?: boolean }) {
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
            <p>
              {showTitle && <span>Fel-id: </span>} <span className={classNames(showTitle ? 'font-normal' : 'font-bold')}>{id}</span>
              <Icon icon="copy-file" colorPreset={1} textEnd />
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
