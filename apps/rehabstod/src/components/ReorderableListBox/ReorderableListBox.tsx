import { classNames } from '@frontend/components'
import { Key, useRef } from 'react'
import {
  AriaListBoxProps,
  DragItem,
  DroppableCollectionOptions,
  ListDropTargetDelegate,
  ListKeyboardDelegate,
  mergeProps,
  useDraggableCollection,
  useDraggableItem,
  useDroppableCollection,
  useFocusRing,
  useListBox,
  useOption,
} from 'react-aria'
import {
  DraggableCollectionState,
  DroppableCollectionState,
  ListState,
  Node,
  useDraggableCollectionState,
  useDroppableCollectionState,
  useListState,
} from 'react-stately'
import { DropIndicator } from './DropIndicator'

function ReorderableOption<T extends object>({
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

export function ReorderableListBox<T extends object>({
  label,
  getItems,
  ...props
}: AriaListBoxProps<T> & { getItems: (keys: Set<Key>) => DragItem[] } & Omit<
    DroppableCollectionOptions,
    'keyboardDelegate' | 'dropTargetDelegate'
  >) {
  const state = useListState(props)
  const ref = useRef(null)
  const { listBoxProps, labelProps } = useListBox({ label, ...props, shouldSelectOnPressUp: true }, state, ref)

  const dropState = useDroppableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
  })

  const { collectionProps } = useDroppableCollection(
    {
      ...props,
      keyboardDelegate: new ListKeyboardDelegate(state.collection, state.disabledKeys, ref),
      dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref),
    },
    dropState,
    ref
  )

  const dragState = useDraggableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
    getItems,
  })

  useDraggableCollection(props, dragState, ref)

  return (
    <>
      <div style={{ visibility: 'hidden', height: '0' }} {...labelProps}>
        {label}
      </div>
      <div role="listbox" {...mergeProps(listBoxProps, collectionProps)} ref={ref}>
        {[...state.collection].map((item) => (
          <ReorderableOption key={item.key} item={item} state={state} dragState={dragState} dropState={dropState} />
        ))}
      </div>
    </>
  )
}
