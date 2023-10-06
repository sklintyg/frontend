import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components'
import { IDSIconArrow } from '@frontend/ids-react-ts'

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
          className="w-10"
        >
          {!disabled && (
            <>
              {direction === 'left' && <IDSIconArrow className="m-auto inline-block" rotate="270" width="14" height="14" />}
              {direction === 'right' && <IDSIconArrow className="m-auto inline-block" rotate="90" width="14" height="14" />}
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
