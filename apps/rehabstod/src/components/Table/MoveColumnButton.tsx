import { IDSIcon } from '@frontend/ids-react-ts'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function MoveColumnButton({
  direction,
  column,
  disabled,
  ...props
}: React.HTMLProps<HTMLButtonElement> & { column: string; direction: 'left' | 'right' }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          {...props}
          aria-label={`Flytta ${direction === 'left' ? 'upp' : 'ner'} ${column}`}
          disabled={disabled}
          type="button"
          className="w-10">
          {!disabled && (
            <>
              {direction === 'left' && <IDSIcon name="arrow" className="m-auto inline-block" rotate="270" width="14" height="14" />}
              {direction === 'right' && <IDSIcon name="arrow" className="m-auto inline-block" rotate="90" width="14" height="14" />}
            </>
          )}
        </button>
      </TooltipTrigger>
      {!disabled && (
        <TooltipContent>
          Flytta {direction === 'left' ? 'upp' : 'ner'} <span className="font-bold">{column}</span>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
