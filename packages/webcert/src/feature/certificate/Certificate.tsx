import React from 'react'
import { useSelector } from 'react-redux'
import Category from './Category/Category'
import Question from './Question/Question'
import { CertificateFooter } from './CertificateFooter/CertificateFooter'
import CertificateValidation from './CertificateValidation'
import { getCertificateDataElements, getIsShowSpinner, getSpinnerText } from '../../store/certificate/certificateSelectors'
import { Backdrop, ConfigTypes } from '@frontend/common'
import CareUnit from './CareUnit/CareUnit'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  padding-right: 16px;
  padding-left: 16px;

  .questionWrapper + .questionWrapper .questionTitle {
    font-size: 14px !important;
    fontweight: bold;
  }

  .questionWrapper + .questionWrapper .MuiPaper-root {
    paddingtop: 0;
  }

  .contentPaperWrapper {
    padding-left: 32px;
    padding-right: 32px;
  }

  .categoryWrapper + .questionWrapper .MuiPaper-root {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`

const Certificate: React.FC = () => {
  const certificateStructure = useSelector(getCertificateDataElements)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)

  return (
    <Backdrop open={showSpinner} spinnerText={spinnerText}>
      <Wrapper id="questions-container" className={`iu-bg-grey-300`}>
        {certificateStructure &&
          certificateStructure.map((data) => {
            if (data.component === ConfigTypes.CATEGORY) {
              return <Category key={data.id} id={data.id} />
            } else {
              return <Question key={data.id} id={data.id} />
            }
          })}
        <CareUnit />
        <CertificateValidation />
        <CertificateFooter />
      </Wrapper>
    </Backdrop>
  )
}

export default Certificate
