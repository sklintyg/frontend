import { ButtonWrapper, Footer } from './Styles'
import { CustomButton } from '@frontend/common'
import React from 'react'

interface IcfFooterProps {
  handleToggleDropdownButtonClick: () => void
}

const IcfFooter: React.FC<IcfFooterProps> = ({ handleToggleDropdownButtonClick }) => {
  return (
    <Footer className={'iu-bg-secondary-light iu-p-300'}>
      <ButtonWrapper>
        <CustomButton className={'iu-mr-200'} onClick={handleToggleDropdownButtonClick}>
          Stäng
        </CustomButton>
      </ButtonWrapper>
      <a href={'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf'}>
        Läs mer om ICF hos Socialstyrelsenlaunch
      </a>
    </Footer>
  )
}

export default IcfFooter
