import * as React from 'react'
import { CertificateListItemValueType, ForwardedListInfo, ListButtonTooltips, PatientListInfo } from '@frontend/common/src/types/list'
import { PatientListInfoContent, ResourceLink, ResourceLinkType } from '@frontend/common'
import check from '@frontend/common/src/images/check.svg'
import { useHistory } from 'react-router-dom'
import RenewCertificateButton from '../certificate/Buttons/RenewCertificateButton'
import styled from 'styled-components'
import ForwardCertificateButton from '../certificate/Buttons/ForwardCertificateButton'

export const StyledIcon = styled.img`
  width: 14px;
`

interface Props {
  key: string
  value: string | boolean | PatientListInfo
  valueType: CertificateListItemValueType
  tooltips: ListButtonTooltips
  links: ResourceLink[]
  certificateId: string
}

const ListItemContent: React.FC<Props> = ({ key, value, valueType, tooltips, links, certificateId }) => {
  const history = useHistory()

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = () => {
    const link = links.find((link) => link.type === ResourceLinkType.READ_CERTIFICATE)
    if (link) {
      return (
        <td>
          <a
            data-tip={
              tooltips[CertificateListItemValueType.OPEN_BUTTON] ? tooltips[CertificateListItemValueType.OPEN_BUTTON] : link.description
            }
            className="ic-button ic-button--primary"
            onClick={() => openCertificate(certificateId)}>
            {link.name}
          </a>
        </td>
      )
    } else {
      return <td />
    }
  }

  const getRenewCertificateButton = () => {
    const link = links.find((link) => link.type === ResourceLinkType.RENEW_CERTIFICATE)
    if (link) {
      return (
        <td>
          <RenewCertificateButton
            name={link.name}
            description={
              tooltips[CertificateListItemValueType.RENEW_BUTTON] ? tooltips[CertificateListItemValueType.RENEW_BUTTON] : link.description
            }
            enabled={link.enabled}
            functionDisabled={false}
            excludeIcon={true}
            body={link.body}
            certificateId={certificateId}
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

  const getNotForwardedContent = (info: ForwardedListInfo) => {
    const link = links.find((link) => link.type === ResourceLinkType.FORWARD_CERTIFICATE)
    if (link) {
      return (
        <td>
          <ForwardCertificateButton
            name={link.name}
            description={tooltips[CertificateListItemValueType.FORWARD] ? tooltips[CertificateListItemValueType.FORWARD] : link.description}
            functionDisabled={false}
            enabled={link.enabled}
            forwarded={info.forwarded}
            unitName={info.unitName}
            careProviderName={info.careGiverName}
            certificateId={certificateId}
            excludeIcon={true}
          />
        </td>
      )
    } else {
      return <td />
    }
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
        return getOpenCertificateButton()
      case CertificateListItemValueType.RENEW_BUTTON:
        return getRenewCertificateButton()
      case CertificateListItemValueType.FORWARD:
        return (value as ForwardedListInfo).forwarded ? (
          <td>
            <StyledIcon
              src={check}
              data-tip={tooltips[CertificateListItemValueType.FORWARD]}
              alt={tooltips[CertificateListItemValueType.FORWARD]}
            />
          </td>
        ) : (
          getNotForwardedContent(value)
        )
      case CertificateListItemValueType.HIDDEN:
      default:
        return <td />
    }
  }

  return getListItemContent()
}

export default ListItemContent
