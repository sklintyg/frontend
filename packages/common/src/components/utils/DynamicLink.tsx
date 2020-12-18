import { Link, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ButtonTooltip } from '@frontend/common'
import { DynamicLinkData } from '../../types/utils'

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: theme.typography.pxToRem(14),
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  missingLink: {
    fontSize: theme.typography.pxToRem(14),
  },
}))

interface Props {
  link: DynamicLinkData
}

const DynamicLink: React.FC<Props> = ({ link }) => {
  const classes = useStyles()

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
        <Typography className={classes.missingLink}>{'WARNING: could not resolve dynamic link'}</Typography>
      )}
    </>
  )
}

export default DynamicLink
