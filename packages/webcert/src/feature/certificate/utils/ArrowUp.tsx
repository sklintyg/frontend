import { makeStyles } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  arrowUp: {
    width: '0',
    height: '0',
    content: ' ',
    left: '35px',
    marginLeft: '35px',
    borderWidth: '10px',
    borderHeight: '10px',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid',
    borderBottomColor: grey[300],
  },
}))

const ArrowUp: React.FC = () => {
  const classes = useStyles()

  return <div className={classes.arrowUp}></div>
}

export default ArrowUp
