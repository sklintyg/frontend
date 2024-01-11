/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IDSButton } from '@frontend/ids-react-ts'
import { DropPosition, DroppableCollectionReorderEvent } from 'react-aria'
import { Item } from 'react-stately'
import { ModifyTableColumnsOption } from './ModifyTableColumnsOption'
import { TableColumn } from '../../../schemas/tableSchema'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleActions } from '../../Form/SelectMultiple/SelectMultipleActions'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { ReorderableListBox } from '../../ReorderableListBox/ReorderableListBox'

export function ModifyTableColumns({
  columns,
  onVisibilityChange,
  onReorder,
  onReset,
}: {
  columns: TableColumn[]
  onVisibilityChange: (target: string, visible: boolean) => void
  onReorder: (target: string, keys: string[], position: DropPosition) => void
  onReset: () => void
}) {
  const selectedColumns = columns.filter(({ visible }) => visible)
  const isAllSelected = selectedColumns.length === columns.length
  const numVisible = columns.reduce((result, { visible }) => result + (visible ? 1 : 0), 0)
  const getPlaceholder = () => {
    if (isAllSelected) {
      return 'Alla valda'
    }

    if (selectedColumns.length === 1) {
      const { name } = selectedColumns[0]
      return name
    }

    return `Visar ${selectedColumns.length} kolumner`
  }

  const onListReorder = (event: DroppableCollectionReorderEvent) => {
    onReorder(
      event.target.key.toString(),
      Array.from(event.keys).map((key) => key.toString()),
      event.target.dropPosition
    )
  }

  return (
    <SelectMultiple
      label="Anpassa tabeller"
      description="Välj kolumner och i vilken ordning de ska visas. Dina ändringar sparas tills vidare."
      placeholder={getPlaceholder()}
    >
      <SelectMultipleList>
        <ReorderableListBox
          label="Anpassa tabeller"
          getItems={(keys) => [...keys].map((key) => ({ 'text/plain': key.toString() }))}
          items={columns}
          selectionMode="none"
          onReorder={onListReorder}
        >
          {columns.map((column, index) => (
            <Item key={column.name} textValue={column.name}>
              <ModifyTableColumnsOption
                {...column}
                disableCheckbox={numVisible === 1 && column.visible}
                onVisibilityChange={onVisibilityChange}
                onReorder={onReorder}
                before={index > 0 ? columns[index - 1] : undefined}
                after={columns[index + 1]}
              />
            </Item>
          ))}
        </ReorderableListBox>
      </SelectMultipleList>
      <SelectMultipleActions>
        <IDSButton onClick={() => onReset()} secondary className="flex-1 text-center" size="s">
          Återställ
        </IDSButton>
      </SelectMultipleActions>
    </SelectMultiple>
  )
}
