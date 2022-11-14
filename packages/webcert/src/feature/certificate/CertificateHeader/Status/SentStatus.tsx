import React from 'react'
import { CertificateMetadata, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  let reciever = ''
  switch (certificateMetadata.type) {
    case 'lisjp':
      reciever = 'Försäkringskassan'
      break
    case 'af00213':
      reciever = 'Arbetsförmedlingen'
      break
    case 'ag7804':
      reciever = 'arbetsgivaren'
      break
    case 'db':
      reciever = 'Skatteverket'
      break
    case 'doi':
      reciever = 'Socialstyrelsen'
      break
    default:
      reciever = 'okänd mottagare'
      break
  }
  return <StatusWithIcon icon={'CheckIcon'}>Intyget är skickat till {reciever}</StatusWithIcon>
}

export default SentStatus
