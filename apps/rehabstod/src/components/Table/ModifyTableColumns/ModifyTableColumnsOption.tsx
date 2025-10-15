/* eslint-disable jsx-a11y/no-static-element-interactions */
import { type ReactEventHandler } from 'react'
import { type DropPosition } from 'react-aria'
import { Checkbox } from '../../../../../../packages/components/src/form/Checkbox/Checkbox'
import type { TableColumn } from '../../../schemas/tableSchema'
import { MoveColumnButton } from './MoveColumnButton'

const preventEventPropagation: ReactEventHandler = (event) => event.stopPropagation()

export function ModifyTableColumnsOption({
  name,
  visible,
  disabled,
  onVisibilityChange,
  onReorder,
  disableCheckbox,
  before,
  after,
}: TableColumn & {
  disableCheckbox: boolean
  before?: TableColumn
  after?: TableColumn
  onReorder: (target: string, keys: string[], position: DropPosition) => void
  onVisibilityChange: (key: string, visible: boolean) => void
}) {
  return (
    <div className="flex cursor-move" onKeyDown={preventEventPropagation} onClick={preventEventPropagation}>
      <div className="w-full py-0.5">
        <div className="pt-1">
          <Checkbox
            checked={visible}
            disabled={disabled || disableCheckbox}
            label={name}
            onChange={(event) => {
              onVisibilityChange(name, event.currentTarget.checked)
            }}
          />
        </div>
      </div>
      <MoveColumnButton
        disabled={!before}
        direction="left"
        onClick={() => before && onReorder(before.name, [name], 'before')}
        column={name}
      />
      <MoveColumnButton disabled={!after} direction="right" column={name} onClick={() => after && onReorder(after.name, [name], 'after')} />
    </div>
  )
}
