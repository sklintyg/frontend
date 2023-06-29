/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactEventHandler } from 'react'
import { DropPosition } from 'react-aria'
import { TableColumn } from '../../../schemas/tableSchema'
import { Checkbox } from '../../Form/Checkbox'
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
      <div className="h-12 w-full">
        <Checkbox
          checked={visible}
          disabled={disabled || disableCheckbox}
          label={name}
          compact
          onChange={(event) => {
            onVisibilityChange(name, event.currentTarget.checked)
          }}
        />
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
