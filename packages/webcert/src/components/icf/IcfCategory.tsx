import React from 'react'
import { IcdCode, IcfCode } from '../../store/icf/icfReducer'
import styled from 'styled-components/macro'
import IcfRow from './IcfRow'

const IcdWrapper = styled.div`
  display: flex;
  strong {
    margin-top: 0;
    margin-right: 0.25rem;
  }
`

interface Props {
  icdCodes: IcdCode[]
  icfCodes: IcfCode[]
  icfCodeValues?: string[]
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
}

const IcfCategory: React.FC<Props> = ({ icdCodes, icfCodes, icfCodeValues, onCodeAdd, onCodeRemove }) => {
  const getChecked = (icfCode: string, icfCodeValues?: string[]): boolean => {
    if (!icfCodeValues) return false

    return icfCodeValues.some((code) => code === icfCode)
  }

  return (
    <>
      <IcdWrapper>
        {icdCodes.map((code, i) => {
          return (
            <React.Fragment key={i}>
              <strong>{code.title}</strong>
              {icdCodes.length > 1 && i === 0 && <strong> |</strong>}
            </React.Fragment>
          )
        })}
      </IcdWrapper>
      <hr />
      <div>
        {icfCodes.map((icfCode, i) => (
          <IcfRow
            checked={getChecked(icfCode.title, icfCodeValues)}
            key={i}
            icfCode={icfCode}
            backgroundStyle={i % 2 === 0 ? '' : 'iu-bg-secondary-light'}
            onCodeAdd={onCodeAdd}
            onCodeRemove={onCodeRemove}
          />
        ))}
      </div>
    </>
  )
}

export default IcfCategory
