import React from 'react'
import { useSelector } from 'react-redux'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { getQuestion } from '../../store/selectors/certificate'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px 28px 4px',
    marginTop: '15px',
    borderBottom: '2px solid #d7d7dd',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
  },
  accordion: {
    boxShadow: 'none',
    marginTop: '10px',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
}))

type Props = {
  id: string
}

const Category: React.FC<Props> = ({ id }) => {
  const category = useSelector(getQuestion(id))

  const styles = useStyles()

  console.log('category', id)

  if (!category || (!category.visible && !category.readOnly)) return null

  return (
    <Paper>
      <div className={styles.root}>
        {category.config.description && (
          <Accordion className={styles.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={styles.heading} variant="h3">
                {category.config.text}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{category.config.description}</Typography>
            </AccordionDetails>
          </Accordion>
        )}
        {!category.config.description && (
          <Typography className={styles.heading} variant="h3">
            {category.config.text}
          </Typography>
        )}
      </div>
    </Paper>
  )
}

export default Category
