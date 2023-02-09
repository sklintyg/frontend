import React from 'react'
import styled from 'styled-components'
import { Spinner } from '../utils'
import { Table } from './Table'
import { TableBody } from './TableBody'
import { TableCell } from './TableCell'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'

interface Headings {
  title: string
  adjustCellToText: boolean
}

interface Props {
  caption?: string
  headings: Headings[]
  isLoadingContent?: boolean
}

const Caption = styled.caption`
  border-top: 0px !important;
`

const NoWrap = styled(TableCell)`
  width: 1%;
  white-space: nowrap;
`

const SimpleTable: React.FC<Props> = ({ isLoadingContent, caption, children, headings }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headings.map((heading, index) => {
            if (heading.adjustCellToText) {
              return <NoWrap key={index}>{heading.title}</NoWrap>
            }

            return <TableCell key={index}>{heading.title}</TableCell>
          })}
        </TableRow>
      </TableHeader>
      {caption && <Caption>{caption}</Caption>}
      <TableBody>
        {!isLoadingContent && <>{children}</>}
        {isLoadingContent && (
          <TableRow>
            <TableCell className="iu-border-white">
              <Spinner className={'iu-mt-300'} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default SimpleTable
