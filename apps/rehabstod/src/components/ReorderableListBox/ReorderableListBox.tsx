import type { Key} from 'react';
import { useRef } from 'react'
import type {
  AriaListBoxProps,
  DragItem,
  DroppableCollectionOptions} from 'react-aria';
import {
  ListDropTargetDelegate,
  ListKeyboardDelegate,
  mergeProps,
  useDraggableCollection,
  useDroppableCollection,
  useListBox,
} from 'react-aria'
import { useDraggableCollectionState, useDroppableCollectionState, useListState } from 'react-stately'
import { ReorderableListBoxOption } from './ReorderableListBoxOption'

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
          <ReorderableListBoxOption key={item.key} item={item} state={state} dragState={dragState} dropState={dropState} />
        ))}
      </div>
    </>
  )
}
