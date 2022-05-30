import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Spinner } from '../index'
import ReactTooltip from 'react-tooltip'

interface Props {
  caption?: string
  headings: string[]
  isLoadingContent?: boolean
  className: string
}

const Caption = styled.caption`
  border-top: 0px !important;
`

const SimpleTable: React.FC<Props> = ({ isLoadingContent, caption, children, headings, className }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const getTableHeadings = () => {
    return headings.map((heading) => (
      <th key={heading} scope="col" data-html data-tip={heading}>
        {heading}
      </th>
    ))
  }

  return (
    <table className={`${className} ic-table ic-table--full`}>
      <thead>
        <tr>{getTableHeadings()}</tr>
      </thead>
      {caption && <Caption>{caption}</Caption>}
      <tbody>
        {!isLoadingContent && <>{children}</>}
        {isLoadingContent && (
          <tr>
            <td className="iu-border-white">
              <Spinner className={'iu-mt-300'} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default SimpleTable
