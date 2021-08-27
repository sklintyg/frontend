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
  backgroundStyle: string
}

const IcfRow: React.FC<Props> = ({ icfCode, backgroundStyle }) => {
  const [displayDescription, setDisplayDescription] = useState(false)

  const handleCheckbox = () => {}

  const handleShowMore = () => {
    setDisplayDescription(!displayDescription)
  }
  return (
    <div className={`${backgroundStyle} iu-pt-200 iu-pb-200 iu-pl-200 iu-pr-200`}>
      <TitleWrapper>
        <Checkbox onChange={handleCheckbox} label={icfCode.title} checked={false} value={icfCode.code} />
        <p onClick={handleShowMore} data-testid={icfCode.title}>
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
