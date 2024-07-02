import { useRef } from 'react'
import type { DropIndicatorProps} from 'react-aria';
import { useDropIndicator } from 'react-aria'
import type { DroppableCollectionState } from 'react-stately'

export function DropIndicator({ dropState, ...props }: DropIndicatorProps & { dropState: DroppableCollectionState }) {
  const ref = useRef(null)
  const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(props, dropState, ref)
  if (isHidden) {
    return null
  }

  return (
    <div
      role="option"
      aria-selected={false}
      {...dropIndicatorProps}
      ref={ref}
      className={`border-b border-accent-90 ${isDropTarget && 'border-accent-40'}`}
    />
  )
}
