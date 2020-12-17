import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Certificate from '../feature/certificate/Certificate'
import CertificateHeader from '../feature/certificate/CertificateHeader/CertificateHeader'
import { getCertificate } from '../store/certificate/certificateActions'
import CertificateSidePanel from '../feature/certificate/CertificateSidePanel/CertificateSidePanel'
import { AppHeader, AppHeaderLink } from '@frontend/common'
import WebcertTitle from '../components/header/WebcertTitle'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import RemovedCertificate from '../feature/certificate/RemovedCertificate/RemovedCertificate'
import { getIsCertificateDeleted } from '../store/certificate/certificateSelectors'

interface Params {
  id: string
}

const CertificatePage = () => {
  const { id } = useParams<Params>()
  const dispatch = useDispatch()
  const certificateIsDeleted = useSelector(getIsCertificateDeleted())

  useEffect(() => {
    if (id) {
      dispatch(getCertificate(id))
    }
  }, [id])

  const secondaryItems = [
    <AppHeaderLink text={'Om Webcert'} link={'#'}></AppHeaderLink>,
    <AppHeaderLink text={'Logga ut'} link={'#'} withoutDivider={true}></AppHeaderLink>,
  ]

  // Todo: Remove fixed height below and do some JS magic to calculate the height.
  return (
    <section style={{ height: '100vh' }}>
      <AppHeader title={<WebcertTitle />} primaryItems={<WebcertHeaderUser />} secondaryItems={secondaryItems} />
      {certificateIsDeleted ? (
        <RemovedCertificate />
      ) : (
        <>
          <CertificateHeader />
          <div style={{ height: `calc(100vh - 230px` }} className={`ic-container`}>
            <div style={{ height: '100%' }} className="iu-grid-cols iu-grid-cols-12">
              <div style={{ overflowY: 'auto', height: '100%' }} className="iu-grid-span-8">
                <Certificate />
              </div>
              <div style={{ height: '100%' }} className="iu-grid-span-4">
                <CertificateSidePanel />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default CertificatePage
