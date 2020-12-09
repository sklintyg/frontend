import { ButtonTooltip, ButtonWithConfirmModal } from '@frontend/common'
import { Button, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { forwardCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import ReplyIcon from '@material-ui/icons/Reply'
import colors from '../../../components/styles/colors'
import { getCertificateMetaData, getUnit } from '../../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: colors.IA_COLOR_17,
    borderColor: colors.IA_COLOR_17,
    color: '#fff',
  },
  icon: {
    transform: 'scaleX(-1)',
  },
}))

interface Props {
  name: string
  description: string
  enabled: boolean
}

const ForwardCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const metadata = useSelector(getCertificateMetaData)
  const classes = useStyles()

  if (!metadata) return null

  const handleEmailSend = () => {
    const href = `mailto:?subject=Du%20har%20blivit%20tilldelad%20ett%20ej%20signerat%20utkast%20i%20Webcert%20p%C3%A5%20enhet%20${metadata.unit.unitName}%20f%C3%B6r%20v%C3%A5rdgivare%20${metadata.careProvider.unitName}&body=Klicka%20p%C3%A5%20l%C3%A4nken%20f%C3%B6r%20att%20g%C3%A5%20till%20utkastet%3A%20http%3A%2F%2Flocalhost%3A3000%2Fcertificate%2F${metadata.id}%0D%0AOBS!%20S%C3%A4tt%20i%20ditt%20SITHS-kort%20innan%20du%20klickar%20p%C3%A5%20l%C3%A4nken.%20`
    window.location.href = href
  }

  if (metadata.forwarded) {
    return (
      <ButtonTooltip description={description}>
        <Button
          disabled={!enabled}
          variant={'contained'}
          className={classes.button}
          startIcon={<ReplyIcon className={classes.icon} />}
          onClick={handleEmailSend}>
          {name}
        </Button>
      </ButtonTooltip>
    )
  }

  return (
    <ButtonWithConfirmModal
      additionalButtonStyles={classes.button}
      disabled={!enabled}
      description={description}
      name={name}
      buttonVariant="contained"
      startIcon={<ReplyIcon className={classes.icon} />}
      modalTitle="Markera som vidarebefordrad?"
      onConfirm={() => dispatch(forwardCertificate(true))}
      onClick={handleEmailSend}
      confirmButtonText="Ja"
      declineButtonText="Nej">
      <Typography>Vill du markera utkastet som vidarebefordrat?</Typography>
    </ButtonWithConfirmModal>
  )
}

export default ForwardCertificateButton
