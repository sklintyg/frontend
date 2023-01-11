import React, { useMemo } from 'react'
import { ConfigUeCauseOfDeathList, ValueCauseOfDeathList } from '../../..'
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../Table'

export const UvCauseOfDeathList: React.FC<{
  value: ValueCauseOfDeathList
  config: ConfigUeCauseOfDeathList
}> = ({ value, config }) => {
  const rows = useMemo(() => {
    return config.list.reduce<string[][]>((result, configItem) => {
      const valueItem = value.list.find((item) => item.id === configItem.id)
      if (valueItem?.description?.text || valueItem?.debut?.date || valueItem?.specification?.code) {
        const chosenSpec = configItem.specifications.find((item) => item.code === valueItem.specification.code)
        return [
          ...result,
          [valueItem.description?.text ?? 'Ej angivet', valueItem.debut?.date ?? 'Ej angivet', chosenSpec?.label ?? 'Ej angivet'],
        ]
      }
      return result
    }, [])
  }, [config.list, value.list])

  if (rows.length === 0) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Beskrivning</TableCell>
          <TableCell>Ungefärlig debut</TableCell>
          <TableCell>Specificera tillståndet</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((cells, rowIndex) => {
          return (
            <TableRow key={rowIndex}>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
