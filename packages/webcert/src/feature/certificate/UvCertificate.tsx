import React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateDataElements, getIsShowSpinner, getSpinnerText } from '../../store/selectors/certificate'
import { Backdrop, Box, CircularProgress } from '@material-ui/core'
import Category from './Category'
import Question from './Question'
import CertificateValidation from './CertificateValidation'
import { CertificateFooter } from './CertificateFooter'

export interface UvCertificateProps {}

// Not currently used, might be used to create a separate component for viewing certificates
// (So that there's 1 for editing and 1 for viewing)
const UvCertificate: React.FC<UvCertificateProps> = (props) => {
  const certificateStructure = useSelector(getCertificateDataElements)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)

  console.log('certificate')

  if (showSpinner)
    return (
      <Backdrop open={showSpinner}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress />
          <h1>{spinnerText}</h1>
        </Box>
      </Backdrop>
    )

  return (
    <Box>
      {certificateStructure &&
        certificateStructure.map((data) => {
          if (data.component === 'category') {
            return <Category key={data.id} id={data.id} />
          } else {
            return <Question key={data.id} id={data.id} />
          }
        })}
      <CertificateValidation />
      <CertificateFooter />
    </Box>
  )
}

export default UvCertificate
