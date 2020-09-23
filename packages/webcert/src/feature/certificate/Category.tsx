import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Paper, Collapse } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { getQuestion } from '../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: `${theme.spacing(2)}px`,
    paddingBottom: `${theme.spacing(2)}px`,
    marginTop: `${theme.spacing(2)}px`,
    borderBottom: `2px solid ${grey[300]}`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.h6.fontSize,
  },
}))

interface CategoryProps {
  id: string
}

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id))
  const classes = useStyles()
  const [mounted, setMounted] = useState(category.visible)

  useEffect(() => {
    setMounted(category.visible)
  }, [category.visible])

  if (!category || (!category.visible && !category.readOnly)) return null

  return (
    <Collapse in={mounted} timeout={750} className={`categoryWrapper`}>
      <Paper className={`${classes.root}`}>
        {category.config.description && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading} variant="h6">
                {category.config.text}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{category.config.description}</Typography>
            </AccordionDetails>
          </Accordion>
        )}
        {!category.config.description && (
          <Typography className={classes.heading} variant="h6">
            {category.config.text}
          </Typography>
        )}
      </Paper>
    </Collapse>
  )
}

export default Category
