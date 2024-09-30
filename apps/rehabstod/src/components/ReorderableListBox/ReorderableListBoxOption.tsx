import { classNames } from 'components'
import { useRef } from 'react'
import { mergeProps, useDraggableItem, useFocusRing, useOption } from 'react-aria'
import type { DraggableCollectionState, DroppableCollectionState, ListState, Node } from 'react-stately'
import { DropIndicator } from './DropIndicator'

export function ReorderableListBoxOption<T extends object>({
  item,
  state,
  dragState,
  dropState,
}: {
  item: Node<T>
  state: ListState<T>
  dragState: DraggableCollectionState
  dropState: DroppableCollectionState
}) {
  const ref = useRef(null)
  const { optionProps, isSelected, isDisabled } = useOption({ key: item.key }, state, ref)
  const { isFocusVisible, focusProps } = useFocusRing()
  const { dragProps } = useDraggableItem(
    {
      key: item.key,
    },
    dragState
  )

  return (
    <>
      <DropIndicator target={{ type: 'item', key: item.key, dropPosition: 'before' }} dropState={dropState} />
      <div
        role="option"
        aria-selected={optionProps['aria-selected']}
        {...mergeProps(optionProps, dragProps, focusProps)}
        ref={ref}
        className={classNames(
          isSelected && 'bg-secondary-95',
          isDisabled && 'text-neutral-40 italic',
          isFocusVisible && 'outline-2 outline-black'
        )}
      >
        {item.rendered}
      </div>
      {state.collection.getKeyAfter(item.key) == null && (
        <DropIndicator target={{ type: 'item', key: item.key, dropPosition: 'after' }} dropState={dropState} />
      )}
    </>
  )
}
