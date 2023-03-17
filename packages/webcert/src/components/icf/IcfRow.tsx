import { Checkbox, IcfCode } from '@frontend/common'
import React, { useState } from 'react'
import { scroller } from 'react-scroll'
import styled from 'styled-components'

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ShowMoreButton = styled.button`
  text-decoration: underline;
  background: none;
  border: none;
  color: inherit;
  font-size: inherit;
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
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'icfScrollContainer-' + parentId,
      offset: -100,
    })
  }

  const handleShowMore = () => {
    setDisplayDescription(!displayDescription)
  }
  return (
    <div className={`${backgroundStyle} iu-pb-400 iu-pl-200 iu-pr-200`}>
      <TitleWrapper>
        <Checkbox
          id={icfCode.title}
          onChange={handleCheckbox}
          label={icfCode.title}
          checked={checked}
          value={icfCode.title}
          onFocus={handleCheckboxFocus}
        />
        <ShowMoreButton onClick={handleShowMore} data-testid={`${icfCode.title}-showmore`}>
          visa mer
        </ShowMoreButton>
      </TitleWrapper>
      {displayDescription && (
        <>
          <p>{icfCode.description}</p>
          {icfCode.includes && (
            <>
              <strong className="iu-mt-300">Innefattar</strong>
              <p>{icfCode.includes}</p>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default IcfRow
