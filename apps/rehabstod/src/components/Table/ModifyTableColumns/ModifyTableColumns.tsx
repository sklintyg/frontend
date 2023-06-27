/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IDSButton } from '@frontend/ids-react-ts'
import { DropPosition, DroppableCollectionReorderEvent } from 'react-aria'
import { Item } from 'react-stately'
import { TableColumn } from '../../../schemas/tableSchema'
import { useGetPopulatedFiltersQuery, useGetUserQuery } from '../../../store/api'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleActions } from '../../Form/SelectMultiple/SelectMultipleActions'
import { SelectMultipleList } from '../../Form/SelectMultiple/SelectMultipleList'
import { ReorderableListBox } from '../../ReorderableListBox/ReorderableListBox'
import { ModifyTableColumnsOption } from './ModifyTableColumnsOption'

export function ModifyTableColumns({
  columns,
  onVisibleChange,
  onReorder,
  onReset,
}: {
  columns: TableColumn[]
  onVisibleChange: (target: string, visible: boolean) => void
  onReorder: (target: string, keys: string[], position: DropPosition) => void
  onReset: () => void
}) {
  const { data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()

  function filterColumn(name: string) {
    return user !== undefined && (!user.roles.LAKARE || user.roles.LAKARE.desc !== name)
  }

  const filteredColumns = columns
    .filter(({ name }) => filterColumn(name))
    .filter(({ name }) => !(!populatedFilters?.srsActivated && name === SickLeaveColumn.Risk))

  const selectedColumns = filteredColumns.filter(({ visible }) => visible)
  const isAllSelected = selectedColumns.length === columns.length
  const numVisible = filteredColumns.reduce((result, { visible }) => result + (visible ? 1 : 0), 0)
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
      description="Välj kolumner och i vilken ordning de ska visas. Dina ändringar sparas tills vidare. Borttagna kolumner går inte att filtrera."
      placeholder={getPlaceholder()}
    >
      <SelectMultipleList>
        <ReorderableListBox
          label="Anpassa tabeller"
          getItems={(keys) => [...keys].map((key) => ({ 'text/plain': key.toString() }))}
          items={filteredColumns}
          selectionMode="none"
          onReorder={onListReorder}
        >
          {filteredColumns.map((column, index) => (
            <Item key={column.name} textValue={column.name}>
              <ModifyTableColumnsOption
                {...column}
                disableCheckbox={numVisible === 1 && column.visible}
                onVisibleChange={onVisibleChange}
                onReorder={onReorder}
                before={index > 0 ? filteredColumns.at(index - 1) : undefined}
                after={filteredColumns.at(index + 1)}
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
