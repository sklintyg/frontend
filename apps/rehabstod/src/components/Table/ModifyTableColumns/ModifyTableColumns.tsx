/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IDSCheckboxGroup } from '@inera/ids-react'
import { type DropPosition, type DroppableCollectionReorderEvent } from 'react-aria'
import { Item } from 'react-stately'
import type { TableColumn } from '../../../schemas/tableSchema'
import { Button } from '../../Button/Button'
import { SelectMultiple } from '../../form/SelectMultiple/SelectMultiple'
import { SelectMultipleActions } from '../../form/SelectMultiple/SelectMultipleActions'
import { ReorderableListBox } from '../../ReorderableListBox/ReorderableListBox'
import { ModifyTableColumnsOption } from './ModifyTableColumnsOption'

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
      light
      label="Anpassa tabeller"
      description="Välj kolumner och i vilken ordning de ska visas. Dina ändringar sparas tills vidare."
      placeholder={getPlaceholder()}
    >
      <IDSCheckboxGroup
        onKeyDownCapture={(event) => {
          if (
            event.key === 'Tab' &&
            event.currentTarget.contains(document.activeElement) &&
            document.activeElement?.querySelector('input')
          ) {
            event.stopPropagation()
          }
        }}
      >
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
      </IDSCheckboxGroup>
      <SelectMultipleActions>
        <Button onClick={() => onReset()} secondary className="flex-1 text-center" size="s">
          Återställ
        </Button>
      </SelectMultipleActions>
    </SelectMultiple>
  )
}
