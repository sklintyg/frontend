/* eslint-disable react/no-array-index-key */
import { Element, domToReact } from 'html-react-parser'
import { isElement } from './utils/isElement'

export function MobileTable({ header, body }: { header?: Element; body?: Element }) {
  if (!header || !body) {
    return null
  }

  const headerRow = header.children.filter(isElement).at(0)

  return (
    <>
      {body.children.filter(isElement).map(({ children }, tIndex) => {
        const bodyCells = children.filter(isElement).filter((node) => node.name !== 'th')
        const rowHeader = children.filter(isElement).find((node) => node.name === 'th')
        const headerRows = headerRow?.children.filter(isElement).slice(rowHeader != null ? 1 : 0)

        return (
          <table className="ids-table" key={tIndex}>
            {rowHeader && (
              <thead>
                <tr>
                  <th colSpan={2} className="text-center">
                    {domToReact(rowHeader.children)}
                  </th>
                </tr>
              </thead>
            )}
            <tbody>
              {headerRows?.map((node, rIndex) => {
                const cellElement = bodyCells.at(rIndex)

                if (!cellElement) {
                  return null
                }

                return (
                  <tr key={rIndex}>
                    <th>{domToReact(node.children)}</th>
                    <td>{domToReact(cellElement.children)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      })}
    </>
  )
}
