import * as React from 'react'
import {
  CertificateListItemValueType,
  ListButtonTooltips,
  ListLinkTypes,
  ListResourceLink,
  PatientListInfo,
} from '@frontend/common/src/types/list'
import { PatientListInfoContent } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RenewCertificateButton from '../certificate/Buttons/RenewCertificateButton'

interface Props {
  key: string
  value: string | boolean | PatientListInfo
  valueType: CertificateListItemValueType
  tooltips: ListButtonTooltips
  links: ListResourceLink[]
}

const ListItemContent: React.FC<Props> = ({ key, value, valueType, tooltips, links }) => {
  const history = useHistory()

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = (certificateId: string) => {
    if (links.some((link) => link.type === ListLinkTypes.LASA_INTYG)) {
      return (
        <td>
          <a
            data-tip={tooltips[CertificateListItemValueType.OPEN_BUTTON]}
            className="ic-button ic-button--primary"
            onClick={() => openCertificate(certificateId)}>
            Öppna
          </a>
        </td>
      )
    } else {
      return <td />
    }
  }

  const getRenewCertificateButton = (certificateId: string) => {
    if (links.some((link) => link.type === ListLinkTypes.FORNYA_INTYG)) {
      return (
        <td>
          <RenewCertificateButton
            name="Förnya"
            description={tooltips[CertificateListItemValueType.RENEW_BUTTON]}
            enabled={true}
            functionDisabled={false}
          />
        </td>
      )
    } else {
      return <td />
    }
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
      case CertificateListItemValueType.RENEW_BUTTON:
        return getRenewCertificateButton(value as string)
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
