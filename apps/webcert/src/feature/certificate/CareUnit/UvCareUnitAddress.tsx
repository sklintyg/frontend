import { isEqual } from 'lodash-es'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { WhiteLogo } from '../../../components/icf/Styles'
import { calendarImage } from '../../../images'
import { getCertificateEvents, getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import CategoryTitle from '../Category/CategoryTitle'

const CareUnitHeaderWrapper = styled.div`
  color: white !important;
  background-color: rgb(1, 165, 163) !important;
  border-bottom: 1px solid rgb(0, 112, 110);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`
const InnerWrapper = styled.div`
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  h3 {
    color: white;
  }
`

const CareUnitAddress = styled.section`
  background-color: rgb(1, 165, 163) !important;
  color: white;
  padding: 20px;

  p + p {
    margin-top: 0;
  }
`

const UvCareUnitAddress = () => {
  const metadata = useSelector(getCertificateMetaData, isEqual)
  const signedCertificate = useSelector(getCertificateEvents, isEqual)
  const signedCertificateDate =
    metadata?.signed ??
    signedCertificate
      .filter((obj) => obj && obj.type === 'SIGNED')
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .reduce((acc, obj) => (obj?.timestamp ? obj.timestamp : acc), '')

  if (!metadata) return null

  function formatDate(date: string) {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${[year, month, day].join('-')}`
  }

  return (
    <>
      <CareUnitHeaderWrapper className="iu-radius-sm">
        <InnerWrapper className="contentPaperWrapper">
          <CategoryTitle textColor="iu-color-white">Ovanstående uppgifter och bedömningar bekräftas</CategoryTitle>
          <div className={'iu-flex iu-flex-center'}>
            <WhiteLogo src={calendarImage} alt="Kalender" />
            <p className={'iu-ml-200'}>{formatDate(signedCertificateDate)}</p>
          </div>
        </InnerWrapper>
      </CareUnitHeaderWrapper>
      <CareUnitAddress className={`contentPaperWrapper questionWrapper`}>
        <h4 className="iu-mb-200 iu-color-white iu-fs-300">Namn och kontaktuppgifter till vårdenheten</h4>
        <p>{metadata?.issuedBy?.fullName}</p>
        <p>{metadata.unit.unitName}</p>
        <p>{metadata.unit.address}</p>
        <p>
          {metadata.unit.zipCode} {metadata.unit.city}
        </p>
        <p>{metadata.unit.phoneNumber}</p>
      </CareUnitAddress>
    </>
  )
}

export default UvCareUnitAddress
