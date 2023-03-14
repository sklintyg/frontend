import React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'
import { css } from 'styled-components'
import { Badge } from '@frontend/common'
import _ from 'lodash'

const additionalContentStyles = css`
  p + p {
    margin-top: 0;
  }
`

const UvPatientAddress: React.FC = () => {
  const metadata = useSelector(getCertificateMetaData, _.isEqual)

  return !metadata ? null : (
    <>
      <CategoryHeader>
        <CategoryTitle>Patientens adressuppgifter</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper additionalStyles={additionalContentStyles}>
        <Badge>
          <div className="iu-grid-cols iu-grid-cols-12">
            <p className="iu-grid-span-12">{metadata.patient.street}</p>
            <p className="iu-grid-span-12">
              {metadata.patient.zipCode} {metadata.patient.city}
            </p>
          </div>
        </Badge>
      </QuestionWrapper>
    </>
  )
}

export default UvPatientAddress
