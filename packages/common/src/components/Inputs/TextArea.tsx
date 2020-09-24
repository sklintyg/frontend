import React from 'react'
import { TextareaAutosize } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'

interface TextAreaProps {
  hasValidationError?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  name: string
  value: string
  additionalStyles?: string
  disabled?: boolean
  rowsMin?: number
}

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 'inherit',
  },
}))

const TextArea: React.FC<TextAreaProps> = (props) => {
  const theme = useTheme()
  const classes = useStyles()
  const { hasValidationError, additionalStyles, children, disabled, name, onChange, rowsMin, value } = props

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <TextareaAutosize
      disabled={disabled}
      style={{ border: `${hasValidationError ? `1px solid ${theme.palette.warning.main}` : ''}` }}
      className={`${additionalStyles} ${classes.root}`}
      rowsMin={rowsMin ? rowsMin : 1}
      name={name}
      value={value}
      onChange={(e) => handleOnChange(e)}
    />
  )
}

export default TextArea
