import { useRef } from 'react'
import { AriaListBoxProps, mergeProps, useFocusRing, useListBox, useListBoxSection, useOption, useSeparator } from 'react-aria'
import { ListState, Node, useListState } from 'react-stately'
import { classNames } from '../../utils/classNames'

function Option<T extends object>({ item, state }: { item: Node<T>; state: ListState<T> }) {
  const ref = useRef(null)
  const { optionProps, isSelected, isDisabled } = useOption({ key: item.key }, state, ref)
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <div
      role="option"
      aria-selected={optionProps['aria-selected']}
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      className={classNames(
        isSelected && 'bg-secondary-95',
        isDisabled && 'text-neutral-40 italic',
        isFocusVisible && 'outline-2 outline-black'
      )}
    >
      {item.rendered}
    </div>
  )
}

export function ListBoxSection<T extends object>({ section, state }: { section: Node<T>; state: ListState<T> }) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  })

  const { separatorProps } = useSeparator({
    elementType: 'div',
  })

  return (
    <>
      {section.key !== state.collection.getFirstKey() && <div {...separatorProps} className="border-neutral-40 mb-1 border-t" />}
      <div {...itemProps}>
        {section.rendered && (
          <span {...headingProps} className="font-bold">
            {section.rendered}
          </span>
        )}
        <div role="listbox" {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </div>
      </div>
    </>
  )
}

export function ListBox<T extends object>({ label, ...props }: AriaListBoxProps<T>) {
  const state = useListState(props)
  const ref = useRef(null)
  const { listBoxProps, labelProps } = useListBox(props, state, ref)

  return (
    <>
      <div {...labelProps}>{label}</div>
      <div role="listbox" {...listBoxProps} ref={ref}>
        {[...state.collection].map((item) =>
          item.type === 'section' ? (
            <ListBoxSection key={item.key} section={item} state={state} />
          ) : (
            <Option key={item.key} item={item} state={state} />
          )
        )}
      </div>
    </>
  )
}
