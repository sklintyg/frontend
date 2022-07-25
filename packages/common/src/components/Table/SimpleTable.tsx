import React from 'react'
import styled from 'styled-components'
import { Spinner } from '../index'

interface Props {
  caption?: string
  headings: string[]
  isLoadingContent?: boolean
  className: string
  adjustColumnsToText?: boolean
}

const Caption = styled.caption`
  border-top: 0px !important;
`

const NoWrap = styled.th`
  width: 1%;
  white-space: nowrap;
`

const SimpleTable: React.FC<Props> = ({ isLoadingContent, caption, children, headings, className, adjustColumnsToText }) => {
  const getTableHeadings = () => {
    return headings.map((heading, idx) => {
      if (adjustColumnsToText && idx !== 0) {
        return (
          <NoWrap key={heading} scope="col" data-html>
            {heading}
          </NoWrap>
        )
      }

      return (
        <th key={heading} scope="col" data-html>
          {heading}
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
