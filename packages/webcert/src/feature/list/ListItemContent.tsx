import * as React from 'react'
import { CertificateListItemValueType, PatientListInfo } from '@frontend/common/src/types/list'
import { CustomButton, PatientListInfoContent } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  key: string
  value: string | boolean | PatientListInfo
  valueType: CertificateListItemValueType
  openCertificateTooltip: string
}

const ListItemContent: React.FC<Props> = ({ key, value, valueType, openCertificateTooltip }) => {
  const history = useHistory()

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = (certificateId: string) => {
    return (
      <td>
        <CustomButton tooltip={openCertificateTooltip} buttonStyle={'primary'} onClick={() => openCertificate(certificateId)}>
          Öppna
        </CustomButton>
      </td>
    )
  }

  const getListItemContent = () => {
    switch (valueType) {
      case CertificateListItemValueType.TEXT:
        return <td>{value}</td>
      case CertificateListItemValueType.DATE:
        return <td>{value.toString().split('T')[0]}</td>
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
        return <></>
    }
  }

  return <>{getListItemContent()}</>
}

export default ListItemContent
