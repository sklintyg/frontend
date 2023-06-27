/* eslint-disable jsx-a11y/no-static-element-interactions */
import { DropPosition } from 'react-aria'
import { TableColumn } from '../../../schemas/tableSchema'
import { Checkbox } from '../../Form/Checkbox'
import { MoveColumnButton } from './MoveColumnButton'

export function ModifyTableColumnsOption({
  name,
  visible,
  disabled,
  onVisibleChange,
  onReorder,
  disableCheckbox,
  before,
  after,
}: TableColumn & {
  disableCheckbox: boolean
  before?: TableColumn
  after?: TableColumn
  onReorder: (target: string, keys: string[], position: DropPosition) => void
  onVisibleChange: (key: string, visible: boolean) => void
}) {
  return (
    <div className="flex">
      <div
        className="h-12 w-full"
        onKeyDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <Checkbox
          checked={visible}
          disabled={disabled || disableCheckbox}
          label={name}
          compact
          onChange={(event) => {
            onVisibleChange(name, event.currentTarget.checked)
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
