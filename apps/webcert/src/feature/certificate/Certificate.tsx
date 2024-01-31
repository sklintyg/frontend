import { isEqual } from 'lodash-es'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { scroller } from 'react-scroll'
import styled from 'styled-components'
import InfoBox from '../../components/utils/InfoBox'
import SpinnerBackdrop from '../../components/utils/SpinnerBackdrop'
import { clearGotoCertificateDataElement } from '../../store/certificate/certificateActions'
import {
  CertificateStructure,
  getCertificateDataElements,
  getGotoId,
  getIsComplementingCertificate,
  getIsShowSpinner,
  getIsSigned,
  getResourceLinks,
  getSpinnerText,
} from '../../store/certificate/certificateSelectors'
import { CertificateDataElementStyleEnum, ConfigTypes, ResourceLinkType } from '../../types'
import CareUnit from './CareUnit/CareUnit'
import Category from './Category/Category'
import { CertificateContext } from './CertificateContext'
import { CertificateFooter } from './CertificateFooter/CertificateFooter'
import CertificateValidation from './CertificateValidation'
import PatientAddressInfo from './PatientAddress/PatientAddressInfo'
import { QuestionValidationError } from './Question/QuestionValidationError'
import { QuestionWithSubQuestions } from './Question/QuestionWithSubQuestions'
import ResponsibleHospName from './ResponsibleHospName'
import SigningForm from './Signing/SigningForm'

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  padding: 16px;

  -webkit-transform: translateZ(0); // Fix for disappearing sign button INTYGFV-14332

  .contentPaperWrapper {
    padding-left: 32px;
    padding-right: 32px;
  }
`

const CategoryWrapper = styled.div`
  background: #ffffff;
  padding-bottom: 0.9375rem;
  :empty {
    display: none;
  }
  :not(:last-child) {
    margin-bottom: 1rem;
  }
`

const Certificate: React.FC = () => {
  const dispatch = useDispatch()
  const certificateStructure = useSelector(getCertificateDataElements, isEqual)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)
  const gotoId = useSelector(getGotoId)
  const isComplementingCertificate = useSelector(getIsComplementingCertificate)
  const isSigned = useSelector(getIsSigned())
  const certificateContainerRef = useRef<HTMLDivElement>(null)
  const certificateContainerId = 'questions-container'
  const links = useSelector(getResourceLinks)
  const showPatientAddress = links.find((link) => link.type === ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE)

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
    <SpinnerBackdrop open={showSpinner} spinnerText={spinnerText}>
      <Wrapper id={certificateContainerId} ref={certificateContainerRef} className="iu-bg-grey-300">
        {isComplementingCertificate && (
          <InfoBox type="info" additionalStyles="iu-mt-400">
            <p> Försäkringskassan har begärt kompletteringar på intyget. </p>
          </InfoBox>
        )}
        <ResponsibleHospName />
        {showPatientAddress && (
          <CategoryWrapper>
            <PatientAddressInfo />
          </CategoryWrapper>
        )}
        <CertificateContext.Provider value={{ certificateContainerId, certificateContainerRef }}>
          {certificateStructure &&
            certificateStructure
              .filter((data) => filterHidden(data))
              .reduce((result, data) => {
                const last = result[result.length - 1]
                if (data.component === ConfigTypes.CATEGORY) {
                  return [...result, [data]]
                } else if (last) {
                  return [...result.slice(0, -1), [...last, data]]
                }
                return result
              }, [] as CertificateStructure[][])
              .map((structure, index) => {
                const category = structure[0].component === ConfigTypes.CATEGORY ? structure[0] : null
                return (
                  <CategoryWrapper key={index}>
                    {structure.map(({ id, subQuestionIds, component }, index) => {
                      if (component === ConfigTypes.CATEGORY) {
                        return <Category key={index} id={id} />
                      } else {
                        return <QuestionWithSubQuestions key={index} questionIds={[id, ...subQuestionIds]} />
                      }
                    })}
                    {category && <QuestionValidationError id={category.id} />}
                  </CategoryWrapper>
                )
              })}
        </CertificateContext.Provider>
        <CareUnit />
        <CertificateValidation />
        <CertificateFooter />
        <SigningForm />
      </Wrapper>
    </SpinnerBackdrop>
  )
}

export default Certificate
