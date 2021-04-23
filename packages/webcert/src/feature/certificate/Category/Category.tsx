import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'
import { Expandable, Accordion } from '@frontend/common'

interface CategoryProps {
  id: string
}

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id))

  return (
    <Expandable isExpanded={category.visible} additionalStyles={'categoryWrapper'}>
      <CategoryHeader>
        {category.config.description && <Accordion title={category.config.text} description={category.config.description}></Accordion>}
        {!category.config.description && <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>}
      </CategoryHeader>
    </Expandable>
  )
}

export default Category
