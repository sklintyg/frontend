import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Category from './Category/Category'
import Question from './Question/Question'
import { CertificateFooter } from './CertificateFooter/CertificateFooter'
import CertificateValidation from './CertificateValidation'
import {
  CertificateStructure,
  getCertificateDataElements,
  getGotoId,
  getIsComplementingCertificate,
  getIsShowSpinner,
  getIsSigned,
  getSpinnerText,
} from '../../store/certificate/certificateSelectors'
import { Backdrop, CertificateDataElementStyleEnum, ConfigTypes, InfoBox } from '@frontend/common'
import CareUnit from './CareUnit/CareUnit'
import styled from 'styled-components/macro'
import { scroller } from 'react-scroll'
import { clearGotoCertificateDataElement } from '../../store/certificate/certificateActions'
import SigningForm from './Signing/SigningForm'
import _ from 'lodash'
import { CustomTooltip } from '@frontend/common/src'
import ResponsibleHospName from './ResponsibleHospName'
import { QuestionWithSubQuestions } from './Question/QuestionWithSubQuestions'

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  padding-right: 16px;
  padding-left: 16px;

  -webkit-transform: translateZ(0); // Fix for disappearing sign button INTYGFV-14332

  .contentPaperWrapper {
    padding-left: 32px;
    padding-right: 32px;
  }
`

const Certificate: React.FC = () => {
  const dispatch = useDispatch()
  const certificateStructure = useSelector(getCertificateDataElements, _.isEqual)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)
  const gotoId = useSelector(getGotoId)
  const isComplementingCertificate = useSelector(getIsComplementingCertificate)
  const isSigned = useSelector(getIsSigned())

  const certificateContainerId = 'questions-container'

  useEffect(() => {
    if (gotoId) {
      scroller.scrollTo(gotoId, {
        duration: 250,
        smooth: true,
        containerId: certificateContainerId,
        offset: -80,
      })
      dispatch(clearGotoCertificateDataElement())
    }
  }, [gotoId])

  const filterHidden = (data: CertificateStructure): boolean => {
    if (!data.style || isSigned) return true
    return data.style !== CertificateDataElementStyleEnum.HIDDEN
  }

  return (
    <Backdrop open={showSpinner} spinnerText={spinnerText}>
      <CustomTooltip />
      <Wrapper id={certificateContainerId} className={`iu-bg-grey-300`}>
        {isComplementingCertificate && (
          <InfoBox type={'info'} additionalStyles={'iu-mt-400'}>
            <p> Försäkringskassan har begärt kompletteringar på intyget. </p>
          </InfoBox>
        )}
        <ResponsibleHospName />
        {certificateStructure &&
          certificateStructure
            .filter((data) => filterHidden(data))
            .map((data, index) => {
              if (data.component === ConfigTypes.CATEGORY) {
                return <Category key={index} id={data.ids[0]} />
              } else {
                return <QuestionWithSubQuestions key={index} questionIds={data.ids} />
              }
            })}
        <CareUnit />
        <CertificateValidation />
        <CertificateFooter />
        <SigningForm />
      </Wrapper>
    </Backdrop>
  )
}

export default Certificate
