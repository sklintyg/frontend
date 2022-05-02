import * as React from 'react'
import { CertificateListItemValueType, PatientListInfo } from '@frontend/common/src/types/list'
import { PatientListInfoContent } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  value: string | boolean | PatientListInfo
  valueType: CertificateListItemValueType
  openCertificateTooltip: string
}

const ListItemContent: React.FC<Props> = ({ value, valueType, openCertificateTooltip }) => {
  const history = useHistory()

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = (certificateId: string) => {
    return (
      <td>
        <a data-tip={openCertificateTooltip} className="ic-button ic-button--primary" onClick={() => openCertificate(certificateId)}>
          Öppna
        </a>
      </td>
    )
  }

  function formatDate(value: string) {
    const splitDate = value.toString().split('T')
    return <>{`${splitDate[0]} ${splitDate[1].substring(0, 5)}`}</>
  }

  const getListItemContent = () => {
    switch (valueType) {
      case CertificateListItemValueType.TEXT:
        return <td>{value}</td>
      case CertificateListItemValueType.DATE:
        return <td>{formatDate(value as string)}</td>
      case CertificateListItemValueType.PATIENT_INFO:
        return (
          <td>
            <PatientListInfoContent info={value as PatientListInfo} />
          </td>
        )
      case CertificateListItemValueType.OPEN_BUTTON:
        return getOpenCertificateButton(value as string)
      case CertificateListItemValueType.FORWARD:
        return value ? (
          <td>
            <FontAwesomeIcon icon={faCheck} className={`iu-color-main`} size="1x" />
          </td>
        ) : (
          <td />
        )
      case CertificateListItemValueType.HIDDEN:
      default:
        return <td />
    }
  }

  return getListItemContent()
}

export default ListItemContent
