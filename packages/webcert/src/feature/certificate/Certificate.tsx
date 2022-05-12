import React, { ReactNode, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Category from './Category/Category'
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
import { CertificateContext } from './CertificateContext'

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

interface Props {
  onSaveModal: (modal: ReactNode) => void
}

const Certificate: React.FC<Props> = ({ onSaveModal }) => {
  const dispatch = useDispatch()
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
      <CustomTooltip />
      <Wrapper id={certificateContainerId} ref={certificateContainerRef} className="iu-bg-grey-300">
        {isComplementingCertificate && (
          <InfoBox type="info" additionalStyles="iu-mt-400">
            <p> Försäkringskassan har begärt kompletteringar på intyget. </p>
          </InfoBox>
        )}
        <ResponsibleHospName />
        <CertificateContext.Provider value={{ certificateContainerId, certificateContainerRef }}>
          {certificateStructure &&
            certificateStructure
              .filter((data) => filterHidden(data))
              .map((data) => {
                if (data.component === ConfigTypes.CATEGORY) {
                  return <Category key={data.id} id={data.id} />
                } else {
                  return <QuestionWithSubQuestions key={data.id} questionIds={[data.id, ...data.subQuestionIds]} />
                }
              })}
        </CertificateContext.Provider>
        <CareUnit />
        <CertificateValidation />
        <CertificateFooter onSaveModal={onSaveModal} />
        <SigningForm />
      </Wrapper>
    </Backdrop>
  )
}

export default Certificate
