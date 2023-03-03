import {
  CertificateListItemValueType,
  checkImage,
  CustomButton,
  formatDate,
  ForwardedListInfo,
  ListButtonTooltips,
  PatientListInfo,
  PatientListInfoContent,
  readImage,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import ForwardCertificateButton from '../certificate/Buttons/ForwardCertificateButton'
import RenewCertificateButton from '../certificate/Buttons/RenewCertificateButton'

export const StyledIcon = styled.img`
  width: 14px;
  margin: auto;
`

interface Props {
  value: string | boolean | PatientListInfo | ForwardedListInfo | ResourceLink[]
  valueType: CertificateListItemValueType
  tooltips: ListButtonTooltips
  links: ResourceLink[]
  certificateId: string
}

const ListItemContent: React.FC<Props> = ({ value, valueType, tooltips, links, certificateId }) => {
  const history = useHistory()

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = () => {
    const link = getLink(ResourceLinkType.READ_CERTIFICATE)
    if (link) {
      return (
        <td>
          <CustomButton
            tooltip={
              tooltips[CertificateListItemValueType.OPEN_BUTTON] ? tooltips[CertificateListItemValueType.OPEN_BUTTON] : link.description
            }
            buttonStyle="primary"
            startIcon={<img src={readImage} alt={'Logo Öppna intyg'} />}
            onClick={() => openCertificate(certificateId)}>
            {link.name}
          </CustomButton>
        </td>
      )
    } else {
      return <td />
    }
  }

  const getRenewCertificateButton = () => {
    const link = getLink(ResourceLinkType.RENEW_CERTIFICATE)
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
            body={link.body}
            certificateId={certificateId}
          />
        </td>
      )
    } else {
      return <td />
    }
  }

  const getLink = (type: ResourceLinkType): ResourceLink | undefined => {
    return links ? links.find((link) => link.type === type) : undefined
  }

  const getForwardedButton = (info: ForwardedListInfo) => {
    const forwardDraft = getLink(ResourceLinkType.FORWARD_CERTIFICATE)
    const forwardQuestion = getLink(ResourceLinkType.FORWARD_QUESTION)
    const link = forwardDraft ? forwardDraft : forwardQuestion
    if (link && info) {
      return (
        <td>
          <ForwardCertificateButton
            name={link.name}
            description={tooltips[CertificateListItemValueType.FORWARD] ? tooltips[CertificateListItemValueType.FORWARD] : link.description}
            functionDisabled={false}
            enabled={link.enabled}
            forwarded={info.forwarded}
            unitName={info.unitName}
            careProviderName={info.careProviderName}
            certificateId={certificateId}
            certificateType={info.certificateType}
            type={link.type}
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
      case CertificateListItemValueType.FORWARD_BUTTON:
        return getForwardedButton(value as ForwardedListInfo)
      case CertificateListItemValueType.FORWARD:
        return value ? (
          <td>
            <StyledIcon
              src={checkImage}
              data-tip={tooltips[CertificateListItemValueType.FORWARD]}
              alt={tooltips[CertificateListItemValueType.FORWARD]}
            />
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
