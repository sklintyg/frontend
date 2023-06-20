import { IDSButton } from '@frontend/ids-react-ts'
import { Item, useListData } from 'react-stately'
import { TableColumn } from '../../../schemas/tableSchema'
import { useGetPopulatedFiltersQuery, useGetUserQuery } from '../../../store/api'
import { SickLeaveColumn } from '../../../store/slices/sickLeaveTableColumns.slice'
import { SelectMultiple } from '../../Form/SelectMultiple/SelectMultiple'
import { SelectMultipleActions } from '../../Form/SelectMultiple/SelectMultipleActions'
import { ReorderableListBox } from '../../ReorderableListBox/ReorderableListBox'

export function ModifyTableColumns({
  columns,
  onChecked,
  onMove,
  onReset,
  onShowAll,
}: {
  columns: TableColumn[]
  onChecked: (column: string, checked: boolean) => void
  onMove: (column: string, direction: 'left' | 'right') => void
  onReset: () => void
  onShowAll: () => void
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

  const list = useListData({
    initialItems: filteredColumns,
    getKey: (item) => item.name,
  })

  // const { dragAndDropHooks } = useDragAndDrop({
  //   getItems: (keys) => [...keys].map((key) => ({ 'text/plain': list.getItem(key).name })),
  //   onReorder(e) {
  //     if (e.target.dropPosition === 'before') {
  //       list.moveBefore(e.target.key, e.keys)
  //     } else if (e.target.dropPosition === 'after') {
  //       list.moveAfter(e.target.key, e.keys)
  //     }
  //   },
  // })

  return (
    <SelectMultiple
      label="Anpassa tabeller"
      description="Välj kolumner och i vilken ordning de ska visas. Dina ändringar sparas tills vidare. Borttagna kolumner går inte att filtrera."
      placeholder={getPlaceholder()}
    >
      <ReorderableListBox
        label="Anpassa tabeller"
        getItems={(keys) => [...keys].map((key) => ({ 'text/plain': list.getItem(key).name }))}
        items={list.items}
        selectionMode="none"
      >
        {/* {filteredColumns.map((item) => (
          <Item key={item.name}>{item.name}</Item>
        ))} */}
        {(item) => <Item key={item.name}>{item.name}</Item>}
      </ReorderableListBox>
      {/* <ModifyTableColumnListBox>
        {filteredColumns.map(({ name, visible, disabled }, index) => (
          <ModifyTableColumnOptions key={key} data-testid={`${name.toLowerCase()}-column`}>
            <div className="-mt-3 w-full">
              <Checkbox
                checked={visible}
                disabled={disabled || (numVisible === 1 && visible)}
                label={name}
                onChange={(event) => {
                  onChecked(name, event.currentTarget.checked)
                }}
              />
              <MoveColumnButton disabled={index === 0} direction="left" onClick={() => onMove(name, 'left')} column={name} />
              <MoveColumnButton
                disabled={index === filteredColumns.length - 1}
                direction="right"
                column={name}
                onClick={() => onMove(name, 'right')}
              />
            </div>
          </ModifyTableColumnOptions>
        ))}
      </ModifyTableColumnListBox> */}
      <SelectMultipleActions>
        <IDSButton onClick={() => onReset()} tertiary className="flex-1 text-center" size="s" block>
          Återställ
        </IDSButton>
        <IDSButton onClick={() => onShowAll()} className="flex-1 whitespace-nowrap" size="s" block>
          Välj alla
        </IDSButton>
      </SelectMultipleActions>
    </SelectMultiple>
  )
}
