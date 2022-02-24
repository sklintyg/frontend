import React, { useState } from 'react'
import { IcfCode } from '../../store/icf/icfReducer'
import { Checkbox } from '@frontend/common'
import styled from 'styled-components/macro'
import { scroller } from 'react-scroll'

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ShowMoreText = styled.p`
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`

interface Props {
  icfCode: IcfCode
  checked: boolean
  backgroundStyle: string
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
  parentId: string
}

const IcfRow: React.FC<Props> = ({ icfCode, backgroundStyle, checked, onCodeAdd, onCodeRemove, parentId }) => {
  const [displayDescription, setDisplayDescription] = useState(false)

  const handleCheckbox: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      onCodeAdd(event.target.value)
    } else {
      onCodeRemove(event.target.value)
    }
  }

  const handleCheckboxFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
    scroller.scrollTo(event.currentTarget.id, {
      duration: 0,
      delay: 0,
      smooth: false,
      containerId: 'icfScrollContainer-' + parentId,
      offset: -5,
    })
  }

  const handleShowMore = () => {
    setDisplayDescription(!displayDescription)
  }
  return (
    <div className={`${backgroundStyle} iu-pt-200 iu-pb-200 iu-pl-200 iu-pr-200`}>
      <TitleWrapper>
        <Checkbox
          id={icfCode.title}
          onChange={handleCheckbox}
          label={icfCode.title}
          checked={checked}
          value={icfCode.title}
          onFocus={handleCheckboxFocus}
        />
        <ShowMoreText onClick={handleShowMore} data-testid={`${icfCode.title}-showmore`}>
          visa mer
        </ShowMoreText>
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
