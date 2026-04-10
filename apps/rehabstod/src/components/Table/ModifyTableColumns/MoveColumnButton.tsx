import { Tooltip, TooltipContent, TooltipTrigger } from '@frontend/components-ids9'
import { Icon } from '@frontend/components-ids9'

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
              {direction === 'left' && <Icon icon="arrow-left" className="m-auto inline-block" />}
              {direction === 'right' && <Icon icon="arrow-right" className="m-auto inline-block" />}
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
