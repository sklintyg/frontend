import { Link, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ButtonTooltip } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getDynamicLink } from '@frontend/webcert/src/store/utils/utilsSelectors'
import colors from '@frontend/webcert/src/components/styles/colors'

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: theme.typography.pxToRem(14),
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  missingLink: {
    fontSize: theme.typography.pxToRem(14),
    color: colors.IA_COLOR_16,
  },
}))

interface Props {
  linkKey: string
}

const DynamicLink: React.FC<Props> = ({ linkKey }) => {
  const classes = useStyles()
  const link = useSelector(getDynamicLink(linkKey))

  return (
    <>
      {link ? (
        <Link className={classes.link} target={link.target} href={link.url}>
          {link.tooltip ? (
            <ButtonTooltip description={link.tooltip}>
              <Typography className={classes.link}>{link.text}</Typography>
            </ButtonTooltip>
          ) : (
            <Typography className={classes.link}>{link.text}</Typography>
          )}
        </Link>
      ) : (
        <Typography className={classes.missingLink}>{'WARNING: could not resolve dynamic link: ' + linkKey}</Typography>
      )}
    </>
  )
}

export default DynamicLink
