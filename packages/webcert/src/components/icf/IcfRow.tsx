import React, { useState } from 'react'
import { IcfCode } from '../../store/icf/icfReducer'
import { Checkbox } from '@frontend/common'
import styled from 'styled-components/macro'

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  icfCode: IcfCode
  checked: boolean
  backgroundStyle: string
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
}

const IcfRow: React.FC<Props> = ({ icfCode, backgroundStyle, checked, onCodeAdd, onCodeRemove }) => {
  const [displayDescription, setDisplayDescription] = useState(false)

  const handleCheckbox: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      onCodeAdd(event.target.value)
    } else {
      onCodeRemove(event.target.value)
    }
  }

  const handleShowMore = () => {
    setDisplayDescription(!displayDescription)
  }
  return (
    <div className={`${backgroundStyle} iu-pt-200 iu-pb-200 iu-pl-200 iu-pr-200`}>
      <TitleWrapper>
        <Checkbox id={icfCode.title} onChange={handleCheckbox} label={icfCode.title} checked={checked} value={icfCode.title} />
        <p onClick={handleShowMore} data-testid={`${icfCode.title}-showmore`}>
          visa mer{' '}
        </p>
      </TitleWrapper>
      {displayDescription && (
        <>
          <p>{icfCode.description}</p>
          {icfCode.includes && (
            <>
              <strong className={'iu-mt-300'}>Innefattar</strong>
              <p>{icfCode.includes}</p>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default IcfRow
