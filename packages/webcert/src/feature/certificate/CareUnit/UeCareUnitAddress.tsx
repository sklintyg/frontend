import React, { useRef, useState } from 'react'
import { Unit } from '@frontend/common'
import { updateCertificateUnit } from '../../../store/certificate/certificateActions'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { getIsEditable, getIsLocked, getUnit } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  align-items: center;
`

const AddressInput = styled.input.attrs((props) => ({
  type: 'text',
  maxLength: 209,
}))``

const ZipCodeInput = styled.input.attrs((props) => ({
  type: 'text',
  size: 6,
  maxLength: 6,
}))`
  max-width: 6em;
`

const CityInput = styled.input.attrs((props) => ({
  type: 'text',
  size: 30,
  maxLength: 30,
}))`
  max-width: 20em;
`

const PhoneNumberInput = styled.input.attrs((props) => ({
  type: 'text',
  size: 20,
  maxLength: 20,
}))`
  max-width: 15em;
`

const UeCareUnitAddress: React.FC = () => {
  const dispatch = useDispatch()
  const unit = useSelector(getUnit())
  const disabled = useSelector(getIsLocked)
  const editable = useSelector(getIsEditable)
  const [careUnitInfo, setCareUnitInfo] = useState<Unit>(unit)

  const dispatchEditDraft = useRef(
    _.debounce((state: Unit) => {
      dispatch(updateCertificateUnit(state))
    }, 1000)
  ).current

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target
    const updatedUnit = { ...careUnitInfo, [name]: value } as Unit

    setCareUnitInfo(updatedUnit)
    dispatchEditDraft(updatedUnit)
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle>Vårdenhetens adress</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper>
        <Wrapper className={`iu-grid-cols iu-grid-cols-12`}>
          <div className="iu-grid-span-3">
            <label htmlFor={'address'}>Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <AddressInput
              className="ic-textfield"
              type="text"
              disabled={disabled || !editable}
              onChange={handleChange}
              name={'address'}
              id={'address'}
              value={careUnitInfo.address}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'zipCode'}>Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <ZipCodeInput
              disabled={disabled || !editable}
              className={`ic-textfield`}
              onChange={handleChange}
              name={'zipCode'}
              id={'zipCode'}
              value={careUnitInfo.zipCode}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'city'}>Postort</label>
          </div>
          <div className="iu-grid-span-9">
            <CityInput
              disabled={disabled || !editable}
              className={`ic-textfield`}
              onChange={handleChange}
              name={'city'}
              id={'city'}
              value={careUnitInfo.city}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor={'phoneNumber'}>Telefonnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <PhoneNumberInput
              disabled={disabled || !editable}
              className={`ic-textfield`}
              onChange={handleChange}
              name={'phoneNumber'}
              id={'phoneNumber'}
              value={careUnitInfo.phoneNumber}
            />
          </div>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default UeCareUnitAddress
