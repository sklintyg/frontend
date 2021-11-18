import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Category from './Category/Category'
import Question from './Question/Question'
import { CertificateFooter } from './CertificateFooter/CertificateFooter'
import CertificateValidation from './CertificateValidation'
import {
  getCertificateDataElements,
  getGotoId,
  getIsComplementingCertificate,
  getIsShowSpinner,
  getSpinnerText,
} from '../../store/certificate/certificateSelectors'
import { Backdrop, ConfigTypes, InfoBox } from '@frontend/common'
import CareUnit from './CareUnit/CareUnit'
import styled from 'styled-components/macro'
import { scroller } from 'react-scroll'
import { clearGotoCertificateDataElement } from '../../store/certificate/certificateActions'
import SigningForm from './Signing/SigningForm'
import _ from 'lodash'
import { CustomTooltip } from '@frontend/common/src'

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  padding-right: 16px;
  padding-left: 16px;

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

  return (
    <Backdrop open={showSpinner} spinnerText={spinnerText}>
      <CustomTooltip />
      <Wrapper id={certificateContainerId} className={`iu-bg-grey-300`}>
        {isComplementingCertificate && (
          <InfoBox type={'info'} additionalStyles={'iu-mt-400'}>
            <p> Försäkringskassan har begärt kompletteringar på intyget. </p>
          </InfoBox>
        )}
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
        <SigningForm />
      </Wrapper>
    </Backdrop>
  )
}

export default Certificate
