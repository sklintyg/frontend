import { isEqual } from 'lodash-es'
import Accordion from '../../../components/utils/Accordion'
import AccordionHeader from '../../../components/utils/AccordionHeader'
import MandatoryIcon from '../../../components/utils/MandatoryIcon'
import { Text } from '../../../components/utils/Text'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import { sanitizeText } from '../../../utils'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'

interface CategoryProps {
  id: string
}

const Category = ({ id }: CategoryProps) => {
  const category = useAppSelector(getQuestion(id), isEqual)
  const displayMandatory = (!category?.readOnly && category?.mandatory && !category.disabled) ?? false

  if (!category) return null

  const isEditable = !category.readOnly && !category.disabled
  const showTitleWithDescription = !!category.config.description && isEditable

  return category.visible ? (
    <CategoryHeader>
      {showTitleWithDescription ? (
        <div id={category.id}>
          <Accordion>
            <AccordionHeader>
              {displayMandatory && <MandatoryIcon />}
              <h3 className={'iu-fs-400  iu-fw-heading'}>{category.config.text}</h3>
            </AccordionHeader>
            <Text className={'iu-mb-400'} dangerouslySetInnerHTML={sanitizeText(category.config.description)}></Text>
          </Accordion>
        </div>
      ) : (
        <>
          {displayMandatory && <MandatoryIcon />}
          <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>
        </>
      )}
    </CategoryHeader>
  ) : null
}

export default Category
