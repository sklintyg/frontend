import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'
import { Accordion, Expandable } from '@frontend/common'
import _ from 'lodash'

interface CategoryProps {
  id: string
}

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id), _.isEqual)

  if (!category) return null

  const isEditable = !category.readOnly && !category.disabled
  const showTitleWithDescription = !!category.config.description && isEditable

  return (
    <Expandable isExpanded={category.visible} additionalStyles={'categoryWrapper'}>
      <CategoryHeader>
        {showTitleWithDescription ? (
          <Accordion titleId={category.id} title={category.config.text} description={category.config.description} isCategory={true} />
        ) : (
          <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>
        )}
      </CategoryHeader>
    </Expandable>
  )
}

export default Category
