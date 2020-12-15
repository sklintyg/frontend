import { makeStyles } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const Icon = styled.span`
  font-size: 1.5rem;
  position: absolute;
  margin-left: -16px;
`

const Wrapper = styled.span`
  position: relative;
`

// const useStyles = makeStyles((theme) => ({
//   mandatoryIcon: {
//     color: theme.palette.error.main,
//     fontSize: '1.5rem',
//     position: 'absolute',
//     marginLeft: -theme.spacing(2),
//   },
//   wrapper: {
//     position: 'relative',
//   },
// }))

interface Props {
  additionalStyles?: string
  display: boolean
}

const MandatoryIcon: React.FC<Props> = ({ additionalStyles, display }) => {
  if (!display) return null

  return (
    <>
      <Wrapper>
        <Icon className="iu-color-error">*</Icon>
      </Wrapper>
      {/* <span className={classes.wrapper}>
        <span className={`${classes.mandatoryIcon} ${additionalStyles && additionalStyles}`}>*</span>
      </span> */}
    </>
  )
}

export default MandatoryIcon
