import React from 'react'
import styled from 'styled-components'
import { Spinner } from '../index'

interface Headings {
  title: string
  adjustCellToText: boolean
}

interface Props {
  caption?: string
  headings: Headings[]
  isLoadingContent?: boolean
  className: string
}

const Caption = styled.caption`
  border-top: 0px !important;
`

const NoWrap = styled.th`
  width: 1%;
  white-space: nowrap;
`

const SimpleTable: React.FC<Props> = ({ isLoadingContent, caption, children, headings, className }) => {
  const getTableHeadings = () => {
    return headings.map((heading) => {
      if (heading.adjustCellToText) {
        return (
          <NoWrap key={heading.title} scope="col" data-html>
            {heading.title}
          </NoWrap>
        )
      }

      return (
        <th key={heading.title} scope="col" data-html>
          {heading.title}
        </th>
      )
    })
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
