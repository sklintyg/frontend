import { Backdrop, CertificateDataElementStyleEnum, ConfigTypes, InfoBox } from '@frontend/common'
import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { scroller } from 'react-scroll'
import styled from 'styled-components/macro'
import { clearGotoCertificateDataElement } from '../../store/certificate/certificateActions'
import {
  CertificateStructure,
  getCertificateDataElements,
  getCertificateMetaData,
  getGotoId,
  getIsComplementingCertificate,
  getIsShowSpinner,
  getIsSigned,
  getSpinnerText,
} from '../../store/certificate/certificateSelectors'
import CareUnit from './CareUnit/CareUnit'
import Category from './Category/Category'
import { CertificateContext } from './CertificateContext'
import { CertificateFooter } from './CertificateFooter/CertificateFooter'
import CertificateValidation from './CertificateValidation'
import { QuestionWithSubQuestions } from './Question/QuestionWithSubQuestions'
import ResponsibleHospName from './ResponsibleHospName'
import SigningForm from './Signing/SigningForm'

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
  const certificateMetadata = useSelector(getCertificateMetaData)
  const certificateStructure = useSelector(getCertificateDataElements, _.isEqual)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)
  const gotoId = useSelector(getGotoId)
  const isComplementingCertificate = useSelector(getIsComplementingCertificate)
  const isSigned = useSelector(getIsSigned())
  const certificateContainerRef = useRef<HTMLDivElement>(null)
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
  }, [gotoId, dispatch])

  const filterHidden = (data: CertificateStructure): boolean => {
    if (!data.style || isSigned) return true
    return data.style !== CertificateDataElementStyleEnum.HIDDEN
  }

  return (
    <Backdrop open={showSpinner} spinnerText={spinnerText}>
      <Wrapper id={certificateContainerId} ref={certificateContainerRef} className="iu-bg-grey-300">
        {isComplementingCertificate && (
          <InfoBox type="info" additionalStyles="iu-mt-400">
            <p> Försäkringskassan har begärt kompletteringar på intyget. </p>
          </InfoBox>
        )}
        <ResponsibleHospName />
        <CertificateContext.Provider value={{ certificateContainerId, certificateContainerRef }}>
          {certificateStructure &&
            certificateMetadata &&
            certificateStructure
              .filter((data) => filterHidden(data))
              .map((data) => {
                if (data.component === ConfigTypes.CATEGORY) {
                  return <Category key={data.id} id={data.id} />
                } else {
                  return (
                    <QuestionWithSubQuestions
                      key={data.id}
                      certificateId={certificateMetadata.id}
                      questionIds={[data.id, ...data.subQuestionIds]}
                    />
                  )
                }
              })}
        </CertificateContext.Provider>
        <CareUnit />
        <CertificateValidation />
        <CertificateFooter />
        <SigningForm />
      </Wrapper>
    </Backdrop>
  )
}

export default Certificate
