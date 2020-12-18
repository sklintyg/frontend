import React from 'react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'
import { css } from 'styled-components'

const additionalHeaderStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white !important;
  background-color: rgb(1, 165, 163);
  border-bottom: 1px solid rgb(0, 112, 110);

  h3 {
    color: white;
  }
`

const additionalContentStyles = css`
  background-color: rgb(1, 165, 163);
  color: white;

  p + p {
    margin-top: 0;
  }
`

const UvCareUnitAddress: React.FC = (props) => {
  const metadata = useSelector(getCertificateMetaData)

  if (!metadata) return null

  function formatDate(date: string) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${[year, month, day].join('-')}`
  }

  return (
    <>
      <CategoryHeader additionalStyles={additionalHeaderStyles}>
        <CategoryTitle>Ovanstående uppgifter och bedömningar bekräftas</CategoryTitle>
        <div className={'iu-flex'}>
          <DateRangeIcon></DateRangeIcon>
          <p className={'iu-ml-200'}>{formatDate(metadata.created)}</p>
        </div>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={additionalContentStyles}>
        <h4 className="iu-mb-200 iu-color-white iu-fs-300">Namn och kontaktuppgifter till vårdenheten</h4>
        <p>{metadata.issuedBy.fullName}</p>
        <p>{metadata.unit.address}</p>
        <p>{metadata.unit.zipCode}</p>
        <p>{metadata.unit.city}</p>
        <p>{metadata.unit.phoneNumber}</p>
      </QuestionWrapper>
    </>
  )
}

export default UvCareUnitAddress
