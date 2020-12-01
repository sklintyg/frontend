import { Link, makeStyles } from '@material-ui/core'
import React, { MouseEvent, useState } from 'react'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(14),
    color: 'inherit',
    textDecoration: 'underline',
    alignItems: 'bottom',
  },
  textWrapper: {
    '& p + p': {
      marginTop: '14px',
      marginBottom: 0,
    },
    '& p:first-child': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
}))

interface Props {
  text?: string
  maxLength: number
}

//TODO: Expand state is kept when switching between diagnoses

const ExpandableText: React.FC<Props> = ({ text, maxLength }) => {
  const classes = useStyles()
  const [expand, setExpand] = useState(false)

  const onReadLessOrMore = (event: MouseEvent) => {
    setExpand(!expand)
  }

  return (
    <>
      {!expand && text && text.length > maxLength ? (
        <div>
          <div className={classes.textWrapper} dangerouslySetInnerHTML={{ __html: text.substring(0, maxLength) }} />
          <Link className={classes.link} onClick={onReadLessOrMore}>
            Läs mer
            <ExpandMore />
          </Link>
        </div>
      ) : (
        <div>
          <div className={classes.textWrapper} dangerouslySetInnerHTML={{ __html: text ?? '' }} />
          {text && text.length > maxLength && (
            <Link className={classes.link} onClick={onReadLessOrMore}>
              Läs mindre
              <ExpandLess />
            </Link>
          )}
        </div>
      )}
    </>
  )
}

export default ExpandableText
