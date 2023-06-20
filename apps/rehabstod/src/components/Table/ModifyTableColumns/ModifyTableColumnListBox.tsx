import { useRef } from 'react'
import {
  AriaListBoxProps,
  ListDropTargetDelegate,
  ListKeyboardDelegate,
  mergeProps,
  useDraggableCollection,
  useDroppableCollection,
  useListBox,
} from 'react-aria'
import { useDraggableCollectionState, useDroppableCollectionState, useListState } from 'react-stately'
import { TableColumn } from '../../../schemas/tableSchema'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { ModifyTableColumnOptions } from './ModifyTableColumnOptions'

export function ModifyTableColumnListBox(props: AriaListBoxProps<TableColumn>) {
  const state = useListState(props)
  const ref = useRef(null)

  const { listBoxProps } = useListBox(
    {
      ...props,
      shouldSelectOnPressUp: true,
    },
    state,
    ref
  )

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
    // Collection and selection manager come from list state.
    collection: state.collection,
    selectionManager: state.selectionManager,
    // Provide data for each dragged item. This function could
    // also be provided by the user of the component.
    getItems: (keys) => [...keys].map((key) => ({ 'text/plain': state.collection.getItem(key)?.name })),
  })

  useDraggableCollection(props, dragState, ref)

  return (
    <SelectMultipleList {...mergeProps(listBoxProps, collectionProps)} ref={ref}>
      {[...state.collection].map((item) => (
        <ModifyTableColumnOptions key={item.key} item={item} state={state} dragState={dragState} dropState={dropState} />
      ))}
    </SelectMultipleList>
  )
}
