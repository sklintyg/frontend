import { CertificateMetadata, StatusWithIcon } from '@frontend/common'
import React from 'react'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  let reciever = ''
  switch (certificateMetadata.type) {
    case 'lisjp':
    case 'fk7801':
    case 'fk7802':
    case 'luae_na':
    case 'luae_fs':
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
